import { CssBaseline } from "@mui/material";
import logoChat from '../../assets/logoChat.svg'
import './register.scss'
import FormSignUpComponent from "../../components/FormComponent/FormSignUpComponent";
import userServices from "../../services/userServices";
import { useNavigate } from "react-router-dom";
import {toast} from 'react-toastify'
import { toastMSGObject } from "../../utils/availableMethod";

export default function RegisterPage() {

    const navigate = useNavigate();

    const handleSignUp = (values : Account) => {
        userServices.signUpService(values)
            .then(res => {
                toast.success(res.message , toastMSGObject())
                localStorage.setItem('user',JSON.stringify(res.data))
                navigate('/set-avatar')
            })
            .catch(error => {
                toast.error(error.response.data.message , toastMSGObject());
            })
    }

    return (
        <div className="register-page">
            <CssBaseline/>
            <div className="register-page__header">
                <img src={logoChat} alt="" />
                <h1>HKT CHAT</h1>
            </div>
            <div className="register-page__form">
                <FormSignUpComponent handleSignUp={handleSignUp}/>
            </div>
            <div className="register-page__redirect">
                <div className="register-page__redirect--title">already have an account ?</div>
                <div className="register-page__redirect--act">sign in</div>
            </div>
        </div>
    )
}
