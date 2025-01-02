import { MessageModel } from "../model/MessageModel.js";

class BaseService {

    async showConversationBetween(senderId , receiverId){
        const messagesQuery = await MessageModel
            .find({
                $or: [
                    { 'users': [senderId, receiverId] },
                    { 'users': [receiverId, senderId] }
                ],
            }).sort({ createdAt: 1 })
            .select({ updatedAt: 0, deletedAt: 0 });
            console.log(messagesQuery.length)
        return messagesQuery
    }

    sortListContactsByNewMessage(listContacts){
        const listContactsNotMessage = listContacts.filter(con => !con.newMessage)
        const listContactsHasMessage = listContacts.filter(con => con.newMessage)
        listContactsHasMessage.sort((conPrev , conNext) => {
            const datePrev = new Date(conPrev.newMessage.createdAt).getTime();
            const dateNext = new Date(conNext.newMessage.createdAt).getTime();
            return dateNext - datePrev
        })
        return [...listContactsHasMessage , ...listContactsNotMessage]
    }

    
    getLastMessageInConversation(senderId , receiverId){
        const lastMessageQuery = MessageModel.findOne({
            $or: [
                { 'users': [senderId, receiverId] },
                { 'users': [receiverId, senderId] }
            ],
        }).sort({ _id: -1 })
        return lastMessageQuery
    }
}

export default new BaseService