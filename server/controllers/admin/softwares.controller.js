import _ from 'lodash'

import { SoftwareModel as Software } from 'server/models/software'

module.exports = {
  /**
   * Get all softwares
   * @param req
   * @param res
   * @returns void
   */
  getSoftwares (req, res) {
    Software.find()
      .sort('-dateAdded')
      .exec((err, softwares) => {
        if (err) {
          res.status(500).send(err)
        }
        res.json({ softwares })
      })
  },

  /**
   * Search the Softwares
   * @param req
   * @param res
   * @returns void
   */
  searchSoftwares (req, res) {
    Software.find({ name: new RegExp(req.params.query, 'i') })
      .sort('-updated_at')
      .exec((err, softwares) => {
        if (err) {
          res.status(500).send(err)
        }
        res.json({ softwares })
      })
  },

  /**
   * Save a software
   * @param req
   * @param res
   * @returns void
   */
  addSoftware (req, res) {
    const newSoftware = new Software(req.body.software)

    newSoftware.save(function (err, saved) {
      if (err) {
        if (err.errors['slug']) {
          return res.status(409).json({ success: false, error: err, message: 'Slug Already Taken' })
        } else if (err.errors['symbol']) {
          return res.status(409).json({ success: false, error: err, message: 'Symbol Already Taken' })
        } else {
          return res.status(500).json({ success: false, error: err, message: 'Database Error' })
        }
      }
      return res.json({ software: saved, success: true })
    })
  },

  /**
   * Update a software
   * @param req
   * @param res
   * @returns void
   */
  updateSoftware (req, res) {
    if (!req.body.software._id) {
      return res.status(404).json({ success: false, message: 'Please Reload the page and try again.' })
    }

    let body = _.omit(req.body.software, '_id')

    // Hack, Always keep setting is_published true on update.
    _.extend(body, { is_published: true })
    Software.findOneAndUpdate({ _id: req.body.software._id }, { $set: body }, { new: true }, function (err, saved) {
      if (err) {
        return res.status(500).json({ success: false, message: 'Database Error', error: err })
      }
      return res.json({ software: saved, success: true })
    })
  },
  addIco (req, res) {
    if (!req.params.cid) {
      return res.status(404).json({ success: false, message: 'Please Reload the page and try again.' })
    }
    let ico = req.body.ico
    if (typeof ico.currency_accepted === 'string') {
      ico.currency_accepted = ico.currency_accepted
        .toUpperCase()
        .replace(/ /g, '')
        .split(',')
        .filter(a => a)
    }
    if (typeof ico.excluded_geos === 'string') {
      ico.excluded_geos = ico.excluded_geos
        .toUpperCase()
        .replace(/ /g, '')
        .split(',')
        .filter(a => a)
    }
    if (ico.bonuses) {
      ico.bonuses.forEach(b => {
        if (typeof b.ranges === 'string') {
          b.ranges = b.ranges
            .replace(/ /g, '')
            .split(',')
            .filter(a => a)
        }
      })
    }

    Software.findOneAndUpdate({ _id: req.params.cid }, { $set: { ico } }, { new: true }).exec((err, software) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Database Error', error: err })
      }
      if (!software) {
        return res.status(404).json({ success: false, message: 'Software Not Found' })
      }
      return res.json({ software, success: true })
    })
  },
  addTeam (req, res) {
    if (!req.params.cid) {
      return res.status(404).json({ success: false, message: 'Please Reload the page and try again.' })
    }
    Software.findOneAndUpdate({ _id: req.params.cid }, { $set: { team: req.body.team } }, { new: true }).exec(
      (err, software) => {
        if (err) {
          return res.status(500).json({ success: false, message: 'Database Error', error: err })
        }
        if (!software) {
          return res.status(404).json({ success: false, message: 'Software Not Found' })
        }
        return res.json({ software, success: true })
      }
    )
  },
  /**
   * Get a single software
   * @param req
   * @param res
   * @returns void
   */
  getSoftware (req, res) {
    Software.findOne({ cuid: req.params.cuid }).exec((err, software) => {
      if (err) {
        res.status(500).send(err)
      }
      res.json({ software })
    })
  },
}
