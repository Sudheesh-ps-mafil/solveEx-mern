import { useEffect, useState } from "react";
import AdminNavbar from "../AdminNavbar/AdminNavbar";
import { useNavigate,useParams} from "react-router-dom";
import axios from "axios";
import SERVER_URL from "../../../config/SERVER_URL";
function AdminBookingCode() {
  const [bookingCode, setBookingCode] = useState("");
  const [show, setShow] = useState(true);
  const navigate = useNavigate();
  const [bookingDetails,setBookingDetails] = useState({});
  const [userId,setUserId] = useState("");
  const {code} = useParams()

  useEffect(()=>{
    if (!localStorage.getItem("admin-token")) {
      navigate("/login");
    } else {
      axios
        .get(SERVER_URL + "/admin/protected", {
          headers: {
            "x-access-token": localStorage.getItem("admin-token"),
          },
        })
        .then((res) => {
          if (res.status !== 200) {
            navigate("/login");
            localStorage.removeItem("admin-token");
          }else{
            setBookingCode(code);
            console.log(code)
          }
        })
        .catch(() => {
          localStorage.removeItem("admin-token");
        });
    }
  },[navigate])
  function showCodeDetails(){
    axios.get(SERVER_URL+"/admin/get-item-code-info/"+bookingCode,{
      headers:{
        "x-access-token":localStorage.getItem("admin-token")
      }
    }).then((res)=>{
      if(res.status===200){
        setShow(false);
        setBookingDetails(res.data[0]?.booked[0]);

setUserId(res.data[0]?.userId)
      }
    }).catch((error)=>{
      console.log(error);
    })
  }
  function handleVerify(){
    axios.post(SERVER_URL+"/admin/verify-item-code",{
      code:bookingCode,
      userId:userId
    },{
      headers:{
        "x-access-token":localStorage.getItem("admin-token")
      }
    }).then((res)=>{
      if(res.status===200){
        setShow(true);
        setBookingCode("");
        setBookingDetails({});
      }
    }).catch((error)=>{
      console.log(error);
    })
  }
  return (
    <>
      <div className="admin-container">
        <AdminNavbar />
        <div className="booking-coupon-code">
          <div className="admin-booking-card">
            {show ? (
              <>
                <h1>Bookings Code</h1>
                <input type="text" placeholder="Enter The Booking Code" value={bookingCode} onChange={(e)=>setBookingCode(e.target.value)} />
                <button onClick={showCodeDetails}>Submit</button>
              </>
            ) : (
              <>
                <h1>Bookings Code</h1>
                <div>

                <p>Name: {bookingDetails?.name}</p>
                <p>Price: {bookingDetails?.price}</p>
                <p>Date: {bookingDetails?.date}</p>
                <p>Time: {bookingDetails?.time}</p>
                <p>Code : {bookingDetails?.code}</p>
                </div>
                <button onClick={handleVerify}>Verify</button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminBookingCode;
