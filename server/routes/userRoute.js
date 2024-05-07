import express from 'express'
import userController from '../controller/userController.js';

const userRoute = express.Router();

userRoute.post('/sign-in' , userController.signIn)
userRoute.post('/sign-up' , userController.signUp)
userRoute.put('/set-avatar/:id' , userController.setAvatar)
userRoute.get('/all-users/:id' , userController.getAllUsers)
userRoute.get('/search-users' , userController.searchUsers)

export default userRoute