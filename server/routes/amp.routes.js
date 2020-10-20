import { Router } from 'express';
import * as CoinController from '../controllers/amp/coin.controller';

const router = new Router();
router.route('/coins').get(CoinController.getCoins);
router.route('/:coin').get(CoinController.getCoin);
router.route('/:coin/buy').get(CoinController.getCoin);

module.exports = router;
