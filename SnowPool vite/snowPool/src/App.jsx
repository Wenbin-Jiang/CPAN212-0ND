import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Homepage from "./pages/Homepage";
import FindRide from "./pages/FindRide";
import PostRide from "./pages/PostRide";
import Login from "./pages/Login";
import Checkout from "./pages/Checkout";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route index element={<Homepage />} />
          <Route path="findride" element={<FindRide />} />
          <Route path="postride" element={<PostRide />} />
          <Route path="login" element={<Login />} />
          {/* <Route path="/forgot-password" element={<ForgotPassword />} /> */}
          {/* <Route path="/sign-up" element={<SignUp />} /> */}
          <Route path="checkout" element={<Checkout />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
