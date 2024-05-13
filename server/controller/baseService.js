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

}

export default new BaseService