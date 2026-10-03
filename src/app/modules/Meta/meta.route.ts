import express from 'express';
import { MetaControllers } from './meta.controller';

const router = express.Router();

router.get('/constants', MetaControllers.getConstants);

export const MetaRoutes = router;
