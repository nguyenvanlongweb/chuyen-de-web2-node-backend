import { Router } from 'express';
import { WebController as route } from '~/app/controllers';

const router: Router = Router();

router.get('/login', route.login);
router.get('/countries', route.country);
router.get('/leagues', route.league);
router.get('/seasons', route.season);
router.get('/topscorers', route.topscore);
router.get('/', route.index);

export default router;
