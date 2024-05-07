import axios from "axios"
const API_URL = import.meta.env.VITE_API_URL

class userServices {
    signInService = async (data : User) => {
        const res = await axios.post(`${API_URL}/user/sign-in` , data);
        return res.data
    }

    signUpService = async (data : User) => {
        const res = await axios.post(`${API_URL}/user/sign-up` , data);
        return res.data
    }

    setAvatarService = async (data : any , idUser : string) => {
        const res = await axios.put(`${API_URL}/user/set-avatar/${idUser}` , data);
        return res.data
    }

    getAllUsersService = async (idUser : string) => {
        const res = await axios.get(`${API_URL}/user/all-users/${idUser}`);
        return res.data
    }

    searchUsersService = async (text : string , userId : string) => {
        const res = await axios.get(`${API_URL}/user/search-users?text=${text}&userId=${userId}`);
        return res.data
    }
}

export default new userServices