import express from 'express'
import messageController from '../controller/messageController.js';

const messageRoute = express.Router();

messageRoute.post('/send-messages' , messageController.addMessages)
messageRoute.get('/get-messages' , messageController.getMessages)
messageRoute.delete('/delete-message/:id' , messageController.deleteMessage)

export default messageRoute