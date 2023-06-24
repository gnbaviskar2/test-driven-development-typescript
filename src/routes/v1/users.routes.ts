import { Router } from 'express';

import {
  getUserController,
  saveUserController,
} from '../../controllers/user.controller';

const router = Router();

router.get('/', getUserController);
router.post('/', saveUserController);

export default router;
