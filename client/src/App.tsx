import { BrowserRouter , Routes, Route } from "react-router-dom"
import ChatPage from "./pages/ChatPage/ChatPage"
import LoginPage from "./pages/LoginPage/LoginPage"
import RegisterPage from "./pages/RegisterPage/RegisterPage"
import SetAvatarPage from "./pages/SetAvatarPage/SetAvatarPage"
import PrivateRoute from "./components/PrivateRoute"


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
