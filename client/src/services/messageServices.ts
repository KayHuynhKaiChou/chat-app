import axios from "axios"
const API_URL = import.meta.env.VITE_API_URL

class messageServices {
    sendMessageService = async (data : Message) => {
        const res = await axios.post(`${API_URL}/message/send-messages` , data);
        return res.data
    }

    getMessageService = async ({from , to} : Message) => {
        const res = await axios.get(`${API_URL}/message/get-messages?from=${from}&to=${to}`);
        return res.data
    }

    deleteMessageService = async (idMsg : string) => {
        const res = await axios.delete(`${API_URL}/message/delete-message/${idMsg}`);
        return res.data
    }
}

export default new messageServices