import express from 'express';
const router = express.Router();

//Imports
import posts from './posts.js';



//Routes
router.use('/api/posts', posts);



export default router;