import axios from "axios"
const API_URL = import.meta.env.VITE_API_URL

class messageServices {
    sendMessageService = async (data : Omit<MessagePayload , 'message'>) : Promise<ResponseFormat> => {
        const res = await axios.post(`${API_URL}/message/send-messages` , data);
        return res.data
    }

    getMessageService = async ({from , to} : Omit<MessagePayload , 'message'>) : Promise<ResponseFormat> => {
        const res = await axios.get(`${API_URL}/message/get-messages?from=${from}&to=${to}`);
        return res.data
    }

    deleteMessageService = async (idMsg : string) : Promise<ResponseFormat> => {
        const res = await axios.delete(`${API_URL}/message/delete-message/${idMsg}`);
        return res.data
    }

    updateViewersMessage = async (idsViewers : MessageData) => {
        await axios.put(`${API_URL}/message/update-viewers`, idsViewers)
    }
}

export default new messageServices