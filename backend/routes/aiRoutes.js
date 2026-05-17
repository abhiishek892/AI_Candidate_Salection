import express from 'express';
import { aiShortlist, aiChatbot } from '../controllers/aiController.js';

const router = express.Router();

router.post('/shortlist', aiShortlist);
router.post('/chatbot', aiChatbot);

export default router;
