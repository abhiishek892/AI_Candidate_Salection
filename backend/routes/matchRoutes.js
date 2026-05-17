import express from 'express';
import { matchCandidates, saveShortlist, getSavedShortlists } from '../controllers/matchController.js';

const router = express.Router();

router.post('/', matchCandidates);
router.post('/save', saveShortlist);
router.get('/saved', getSavedShortlists);

export default router;
