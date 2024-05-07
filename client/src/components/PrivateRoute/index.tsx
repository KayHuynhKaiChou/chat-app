import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
    children : React.ReactNode
}

export default function PrivateRoute({children} : PrivateRouteProps) {
    const user = JSON.parse(localStorage.getItem('user') as string);
    if(user?.username){
        return children
    }else{
        return <Navigate to="/sign-in" />
    }
}
