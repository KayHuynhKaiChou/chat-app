import { MessageModel } from "../model/MessageModel.js";
import { status200, status400, status500 } from "../utils/statusResponse.js"
import baseService from "./baseService.js";

class messageController {

    addMessages = async (req,res) => {
        try {
            const { from , to , message } = req.body;
            const newMsg = new MessageModel({
                message,
                users : [from , to],
                sender : from ,
                viewers : from
            })
            await newMsg.save();
            res.status(200).json(status200("send message to "+to+" successfully", newMsg))
        } catch (error) {
            status500(error)
        }
    }

    getMessages = async ( req, res) => {
        try {
            const { from, to } = req.query;

            const messagesResult = await baseService.showConversationBetween(from , to);

            res.status(200).json(status200(
                `get data messages between ${from} and ${to} successfully`,
                messagesResult
            ))
            
        } catch (error) {
            status500(error)
        }
    }

    deleteMessage = async ( req, res) => {
        try {
            await MessageModel.findByIdAndUpdate(req.params.id , {
                $set : {
                    isDeleted : true
                }
            });
            
            res.status(200).json(status200(`Delete message successfully`,null))
            
        } catch (error) {
            status500(error)
        }
    }

    updateViewersMessage = async (req, res) => {
        try {
            const newMessage = req.body
            // const lastMessage = await MessageModel
            //     .findOne({
            //         users: { $all: [userAId, userBId] }
            //     })
            //     .sort({ createdAt: -1 }) // Sort by creation time in descending order
            //     .exec();            
            await MessageModel.findByIdAndUpdate(
                newMessage._id,
                newMessage,
                {new : true}
            )
            res.status(200).json(status200("Update viewers in conversation successfully!",null))           
        } catch (error) {
            status500(error)
        }
    }

} 

export default new messageController