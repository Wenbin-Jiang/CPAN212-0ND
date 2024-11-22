import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider } from "./contexts/UserContext";
import Homepage from "./pages/Homepage";
import FindRide from "./pages/FindRide";
import PostRide from "./pages/PostRide";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProfilePage from "./pages/profilePage";
import Checkout from "./pages/Checkout";
import MyTrips from "./pages/MyTrips";

const user = {
  name: "Wen Bin",
  profileImage: "../profile-pic.png",
};

function App() {
  return (
    <div>
      <UserProvider>
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <Routes>
            <Route index element={<Homepage />} />
            <Route path="findride" element={<FindRide />} />
            <Route path="postride" element={<PostRide />} />
            <Route path="login" element={<Login />} />
            <Route path="mytrips" element={<MyTrips />} />
            <Route path="dashboard" element={<Dashboard user={user} />} />
            {/* <Route path="/forgot-password" element={<ForgotPassword />} /> */}
            {/* <Route path="/sign-up" element={<SignUp />} /> */}
            <Route path="userprofile" element={<ProfilePage />} />
            <Route path="checkout" element={<Checkout />} />
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </div>
  );
}

export default App;
