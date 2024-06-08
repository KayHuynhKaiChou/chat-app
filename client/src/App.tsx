import { BrowserRouter , Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import { lazy } from "react";

const ChatPage = lazy(() => import('./pages/ChatPage/ChatPage'));
const LoginPage = lazy(() => import('./pages/LoginPage/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage/RegisterPage'));
const SetAvatarPage = lazy(() => import('./pages/SetAvatarPage/SetAvatarPage'));

function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <PrivateRoute>
            <ChatPage />
          </PrivateRoute>
        }/>
        <Route path="/sign-in" Component={LoginPage}/>
        <Route path="/sign-up" Component={RegisterPage}/>
        <Route path="/set-avatar" Component={SetAvatarPage}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
