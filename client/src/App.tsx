import { BrowserRouter , Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import { Suspense, lazy } from "react";

const ChatPage = lazy(() => import('./pages/ChatPage/ChatPage'));
const LoginPage = lazy(() => import('./pages/LoginPage/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage/RegisterPage'));
const SetAvatarPage = lazy(() => import('./pages/SetAvatarPage/SetAvatarPage'));

function App() {
  
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={
            <PrivateRoute>
              <ChatPage />
            </PrivateRoute>
          }/>
          <Route path="/sign-in" element={<LoginPage />} />
          <Route path="/sign-up" element={<RegisterPage />} />
          <Route path="/set-avatar" element={<SetAvatarPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
