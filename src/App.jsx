import Login from "./login/Login.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Route, Routes } from "react-router-dom";
import Register from "./register/Register.jsx";
import Home from "./home/Home.jsx";
import NotFound from "./NotFound/NotFound.jsx";
import { VerifyUser } from "./utils/VerifyUser.jsx";
import { IfLoggedIn } from "./utils/IfLoggedIn.jsx";
import Profile from "./home/components/Profile.jsx";
function App() {
  return (
    <>
      <div className="p-2 w-screen h-screen flex items-center justify-center">
        <Routes>
          <Route element={<IfLoggedIn />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
          <Route element={<VerifyUser />}>
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/" element={<Home />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ToastContainer />
      </div>
    </>
  );
}

export default App;
