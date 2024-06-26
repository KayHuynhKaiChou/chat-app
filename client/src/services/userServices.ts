import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

class userServices {
    signInService = async (data : Account) : Promise<ResponseFormat> => {
        const res = await axios.post(`${API_URL}/user/sign-in` , data);
        return res.data
    }

    signUpService = async (data : Account) : Promise<ResponseFormat> => {
        const res = await axios.post(`${API_URL}/user/sign-up` , data);
        return res.data
    }

    setAvatarService = async (data : any , idUser : User['id']) : Promise<ResponseFormat> => {
        const res = await axios.put(`${API_URL}/user/set-avatar/${idUser}` , data);
        return res.data
    }

    getListContactsService = async (idUser : User['id']) : Promise<ResponseFormat> => {
        const res = await axios.get(`${API_URL}/user/all-users/${idUser}`);
        return res.data
    }

    searchUsersService = async (text : string , userId : string) : Promise<ResponseFormat> => {
        const res = await axios.get(`${API_URL}/user/search-users?text=${text}&userId=${userId}`);
        return res.data
    }
}

export default new userServices