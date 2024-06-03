import { MessageModel } from "../model/MessageModel.js";

class BaseService {

    async showConversationBetween(idSender , idReceiver){
        const messagesQuery = await MessageModel
            .find({
                users: {
                    $all: [idSender , idReceiver],
                },
            }).sort({ createdAt: 1 })
            .select({ updatedAt: 0, deletedAt: 0 });
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

}

export default new BaseService