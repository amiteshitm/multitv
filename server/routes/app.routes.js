const Router = require('express').Router

const SoftwaresController = require('server/controllers/softwares.controller')

const router = new Router()

// Get all Softwares
router.route('/softwares').get(SoftwaresController.getSoftwares)

// Get one software by cuid
router.route('/softwares/:software').get(SoftwaresController.getSoftware)
router.route('/softwares/search/:query').get(SoftwaresController.searchSoftwares)

module.exports = router
