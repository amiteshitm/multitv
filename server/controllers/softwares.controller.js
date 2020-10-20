const _ = require('lodash')

const Software = require('server/models/software').SoftwareModel

module.exports = {
  /**
   * Get all softwares
   * @param req
   * @param res
   * @returns void
   */
  getSoftwares (req, res) {
    Software.find({ is_published: true })
      .sort('cmc_rank')
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
    Software.find({ name: new RegExp(req.params.query, 'i'), is_published: true })
      .sort('cmc_rank')
      .exec((err, softwares) => {
        if (err) {
          res.status(500).send(err)
        }
        res.json({ softwares })
      })
  },

  /**
   * Get a single software
   * @param req
   * @param res
   * @returns void
   */
  getSoftware (req, res) {
    Software.findOne({ slug: req.params.software })
      .lean()
      .then(software => {
        res.json({ software })
      })
      .catch(err => {
        res.status(500).send(err)
      })
  },
  /**
   * @param req
   * @param res (res.body should contain the specified fields in Obj Ex: {name:1,_id:0})
   * @returns softwares with specified Fields Only
   */
  getSoftwaresWithFields (req, res) {
    let fields = req.body || { _id: 1, slug: 1 }
    Software.find({ is_published: true })
      .select(fields)
      .exec((err, softwares) => {
        if (err) {
          res.status(500).send(err)
        }
        res.json({ softwares })
      })
  },
}
