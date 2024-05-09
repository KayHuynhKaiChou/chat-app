import { CssBaseline } from "@mui/material";
import logoChat from '../../assets/logoChat.svg'
import './login.scss'
import FormSignInComponent from "../../components/FormComponent/FormSignInComponent";
import userServices from "../../services/userServices";
import { useNavigate } from "react-router-dom";
import {toast} from 'react-toastify'
import { toastMSGObject } from "../../utils/availableMethod";

export default function LoginPage() {

    const navigate = useNavigate();

    const handleSignIn = (values : Account) => {
        userServices.signInService(values)
            .then(res => {
                toast.success(res.message , toastMSGObject());
                localStorage.setItem("user",JSON.stringify(res.data));
                navigate('/');
            })
            .catch(error => {
                toast.error(error.response.data.message , toastMSGObject());
            })
    }

    return (
        <div className="login-page">
            <CssBaseline/>
            <div className="login-page__header">
                <img src={logoChat} alt="" />
                <h1>HKT CHAT</h1>
            </div>
            <div className="login-page__form">
                <FormSignInComponent handleSignIn={handleSignIn}/>
            </div>
            <div className="login-page__redirect">
                <div className="login-page__redirect--title">don't have an account ?</div>
                <div className="login-page__redirect--act">sign up</div>
            </div>
        </div>
    )
}
