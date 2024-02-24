import "./App.css";
import { Route, Routes } from "react-router-dom";
import Login from "./components/User/Login/Login";
import Home from "./components/User/Home/Home";
import Booking from "./components/User/Booking/Booking";
import SingleBooking from "./components/User/SingleBooking/SingleBooking";
import YourBookings from "./components/User/YourBookings/YourBookings";
import Wallet from "./components/User/Wallet/Wallet";
import ProfileEdit from "./components/User/ProfileEdit/ProfileEdit";
import Profile from "./components/User/Profile/Profile";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from "react-toastify";
import AdminLogin from "./components/Admin/AdminLogin/AdminLogin";
import AdminDashboard from "./components/Admin/AdminDashboard/AdminDashboard";
import AdminCashbackCode from "./components/Admin/AdminCashbackCode/AdminCashbackCode";
import AdminNotification from './components/Admin/AdminNotification/AdminNotification';
import AddItem from "./components/Admin/AddItem/AddItem";
import AdminBookingCode from "./components/Admin/AdminBookingCode/AdminBookingCode";
import AllUsers from "./components/Admin/AllUsers/AllUsers";
import AllBookings from "./components/Admin/AllBookings/AllBookings";
import AllItems from "./components/Admin/AllItems/AllItems";
import AddCashBack from "./components/Admin/AddCashBack/AddCashBack";
import AllCashBack from "./components/Admin/AllCashback/AllCashBack";


function App() {


  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/single-booking/:id" element={<SingleBooking />} />
        <Route path="/your-bookings" element={<YourBookings />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/profile-edit" element={<ProfileEdit/>} />
        <Route path="/profile" element={<Profile/>} />



        <Route path="/admin/login" element={<AdminLogin/>} />
        <Route path="/admin/dashboard" element={<AdminDashboard/>} />
        <Route path="/admin/redeem-code" element={<AdminCashbackCode/>} />
        <Route path="/admin/notification" element={<AdminNotification/>} />
        <Route path="/admin/add-items" element={<AddItem/>} />
        <Route path="/admin/qrcode-booking/:code" element={<AdminBookingCode/>} />
        <Route path="/admin/all-users" element={<AllUsers/>} />
        <Route path="/admin/all-bookings" element={<AllBookings/>} />
        <Route path="/admin/all-items" element={<AllItems/>} />
        <Route path="/admin/add-cashback" element={<AddCashBack/>} />
        <Route path="/admin/all-cashback" element={<AllCashBack/>} />

      </Routes>
      <ToastContainer/>
    </>
  );
}

export default App;
