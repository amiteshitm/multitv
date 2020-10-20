import { Router } from 'express'
import * as SoftwareController from '../controllers/admin/softwares.controller'

const router = new Router()

// Softwares
router.get('/softwares', SoftwareController.getSoftwares)
router.get('/softwares/:cuid', SoftwareController.getSoftware)
router.post('/softwares', SoftwareController.addSoftware)
router.put('/softwares', SoftwareController.updateSoftware)
router.route('/softwares/search/:query').get(SoftwareController.searchSoftwares)

router.post('/softwares/:cid/team', SoftwareController.addTeam)
module.exports = router
