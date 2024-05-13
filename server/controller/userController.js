import { UserModel } from "../model/UserModel.js";
import { status200, status400, status500 } from "../utils/statusResponse.js"
import bcrypt from 'bcrypt'
import baseService from "./baseService.js";

class userController {

    signIn = async (req,res) => {
        try {
            const { username , password } = req.body;
            const userChecked = await UserModel.findOne({username});
            if(userChecked){
                const isMatchedPassword = await bcrypt.compare(password , userChecked.password)
                if(isMatchedPassword){
                    res.status(200).json(status200("Login successfully",{
                        id : userChecked._id,
                        username,
                        email : userChecked.email,
                        avatarImage : userChecked.avatarImage
                    }))
                }else{
                    res.status(400).json(status400("Password is not right"))
                }
            }else{
                res.status(400).json(status400("Username is not right"))
            }
        } catch (error) {
            status500(error)
        }
    }

    signUp = async (req,res) => {
        try {
            const { username , email , password } = req.body;
            const isExistedEmail = await UserModel.findOne({email});
            if(isExistedEmail){
                res.status(400).json(status400("Email has existed in system"))
            }
            const isExistedUsername = await UserModel.findOne({username});
            if(isExistedUsername){
                res.status(400).jsonresolve(status400("Username has existed in system"))
            }
            const hashPass = await bcrypt.hash(password, 10);
            const newAccount = new UserModel({
                username,
                email,
                password : hashPass
            })
            await newAccount.save();
            res.status(200).json(status200("Register successfully" , {
                id : newAccount._id,
                username,
                email
            }))
        } catch (error) {
            status500(error)
        }
    }

    setAvatar = async (req,res) => {
        try {
            const { avatarImage } = req.body
            await UserModel.findByIdAndUpdate(req.params.id,{
                $set : {
                    avatarImage
                }
            });
            res.status(200).json(status200("Set avatar success",null))

        } catch (error) {
            status500(error)
        }
    }

    getAllUsers = async (req,res) => {
        try {
            const idSender = req.params.id;
            const listUsers = await UserModel.find({ _id: { $ne: idSender } }).select([
                "email",
                "username",
                "avatarImage",
                "_id",
            ]).lean();

            const modifiedListUsersPromise = listUsers.map(async (user) => {
                const messagesResult = await baseService.showConversationBetween(idSender , user._id.toString())
                const receiver = {
                    id: user._id,
                    username: user.username,
                    email : user.email,
                    avatarImage : user.avatarImage 
                };
                const newMessage = [...messagesResult].pop() 
                return {
                    receiver,
                    newMessage
                }
            });
            const modifiedListUsers = await Promise.all(modifiedListUsersPromise)
            res.status(200).json(status200("Get all users success", modifiedListUsers));
        } catch (error) {
            status500(error)
        }
    }

    searchUsers = async (req,res) => {
        const {text,userId} = req.query;
        try {
            let filterUsers = [];
            if(text !== ''){
                filterUsers = await UserModel.find({
                    _id: { $ne: userId },
                    username : {
                        $regex : text,
                        $options : "i"
                    }
                }).select([
                    "email",
                    "username",
                    "avatarImage",
                    "_id",
                ]).lean()
            }else{
                filterUsers = await UserModel.find({ _id: { $ne: userId } }).select([
                    "email",
                    "username",
                    "avatarImage",
                    "_id",
                ]).lean()
            }

            const modifiedFilterUsers = filterUsers.map(user => {
                return { ...user, id: user._id };
            });
            
            res.status(200).json(status200(`Search username by text ${text}`,modifiedFilterUsers))
        } catch (error) {
            status500(error)
        }
    }
} 

export default new userController