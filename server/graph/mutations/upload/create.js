import fs from 'fs'
import path from 'path'
import { PassThrough } from 'stream'
import shortid from 'shortid'
import AWS from 'aws-sdk'

import { SoftwareModel } from 'server/models/software'
import getConfig from 'next/config'

const sharp = require('sharp')
const UPLOAD_DIR = 'server/uploads'

const ASPECTS = [
  { thumbnail: { w: 150, h: 150 } },
  { medium: { w: 300, h: 300 } },
  { proof: { w: 640, h: 480 } },
  { proof_square: { w: 640, h: 640 } },
  { large: { w: 1024, h: 1024 } },
]
const LOGO_ASPECTS = [{ small: { h: 120 } }]

function uploadFromStream (key, Bucket) {
  const s3 = new AWS.S3({
    apiVersion: '2006-03-01',
    accessKeyId: process.env.S3_API_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
  })
  const pass = new PassThrough()
  const params = { ACL: 'public-read', Bucket, Key: key, Body: pass }
  const uploadPromise = s3.upload(params).promise()

  return { writeStream: pass, uploadPromise }
}

async function storeS3 ({ stream, filename, mimetype, encoding, _id, type = 'upload' }) {
  const id = shortid.generate()
  const key = `${id}-${filename}`
  const rpath = `${UPLOAD_DIR}/${key}`
  const parsedName = path.parse(filename)

  return new Promise((resolve, reject) => {
    stream.pipe(fs.createWriteStream(rpath)).on('finish', () => {
      const {
        serverRuntimeConfig: { uploadBucket, aspectBucket },
      } = getConfig()
      const { writeStream, uploadPromise } = uploadFromStream(key, uploadBucket)
      const uploadStream = fs.createReadStream(rpath)
      let uploads = []

      uploadStream.pipe(writeStream)

      return uploadPromise
        .then((data) => {
          uploads.push({
            name: filename,
            mimetype,
            encoding,
            filepath: data.Location,
            type,
            aspect: 'original',
          })

          const aspects = type === 'upload' ? ASPECTS : LOGO_ASPECTS
          let allPromises = []

          for (let aspect of aspects) {
            Object.keys(aspect).forEach((variant) => {
              const aspectName = `${parsedName.name}-${type}-${variant}${parsedName.ext}`
              const key = `${_id}/${aspectName}`
              const stream = fs.createReadStream(rpath)
              const transformer = sharp()
                .resize(aspect[variant].w, aspect[variant].h)
                .on('error', function (error) {
                  console.log(`Error while resize: ${error}`)
                })
              const { writeStream, uploadPromise } = uploadFromStream(key, aspectBucket)

              stream.pipe(transformer).pipe(writeStream)

              allPromises.push(
                uploadPromise.then((data) => {
                  uploads.push({
                    name: aspectName,
                    mimetype,
                    encoding,
                    filepath: data.Location,
                    type,
                    aspect: variant,
                  })
                  return true
                })
              )
            })
          }

          return Promise.all(allPromises).then((_results) => resolve(uploads))
        })
        .catch((error) => {
          console.log(error)
          reject(error)
        })
    })
  })
}

const processUpload = async (_id, upload) => {
  return upload.then((file) => {
    const { stream, filename, mimetype, encoding } = file

    return storeS3({ stream, filename, mimetype, encoding, _id })
  })
}

const processLogo = async (_id, logo) => {
  // TODO: Fix this up and delete the file from s3 as well before setting the array.
  await SoftwareModel.findOneAndUpdate({ _id }, { $set: { logo: [] } })

  return logo.then((file) => {
    const { stream, filename, mimetype, encoding } = file

    return storeS3({ stream, filename, mimetype, encoding, _id, type: 'logo' })
  })
}

const uploadCreate = (root, params) => {
  return new Promise((resolve, reject) => {
    processUpload(root, params.input)
      .then((result) => resolve({ status: true }))
      .catch((error) => reject(error))
  })
}

export { uploadCreate, processUpload, processLogo }
