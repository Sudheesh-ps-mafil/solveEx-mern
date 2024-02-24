
import TopNav from '../TopNav/TopNav'
import BottomNav from '../BottomNav/BottomNav'
import { useNavigate, useParams} from 'react-router-dom';
import "./SingleBooking.css";
import { useEffect, useState } from 'react';
import axios from 'axios';
import SERVER_URL from '../../../config/SERVER_URL';
import { toast } from 'react-toastify';
function SingleBooking() {
    const {id} = useParams();
    const [item,setItem] = useState([])
    const navigate = useNavigate();
    const [booking,setBooking] = useState({
      time:"",
      date:""
    })
    useEffect(() => {
      if (!localStorage.getItem("token")) {
        navigate("/login");
      } else {
        axios
          .get(SERVER_URL + "/user/protected", {
            headers: {
              "x-access-token": localStorage.getItem("token"),
            },
          })
          .then((res) => {
            if (res.status !== 200) {
              navigate("/login");
              localStorage.removeItem("token");
            }else{
              axios.get(SERVER_URL + "/user/item/"+id, {
                headers: {
                  "x-access-token": localStorage.getItem("token"),
                },
              })
              .then((res) => {
              if(res.status===200){
                setItem(res.data)
              }
              })
              .catch((err) => {
                console.log(err);
              });
            }
          })
          .catch(() => {
            localStorage.removeItem("token");
          });
      }
    }, [id, navigate]);
  
    const handleBooking=()=>{

      if(booking.date==="" || booking.time===""){
        toast.error("Complete all fields")
      }else{
        axios.post(SERVER_URL+"/user/add-booking",{
          itemId:item._id,
          date:booking.date,
          time:booking.time
        },{
          headers: {
            "x-access-token": localStorage.getItem("token"),
          },
        })
        .then((res)=>{
          if(res.status===200){
            toast.success("Booking Done")
            navigate("/your-bookings")
          }
        })
        .catch(()=>{
          toast.error("Something went wrong")
        })
      }
    }
  return (
    <>
      <div className="container">
        <div className="box">
            <TopNav/>
                <div className="single-booking-container">
                    <div className="single-booking-img">
                    <img src={item?.image} alt="" />
                    </div>
                    <i className="fa-solid fa-chevron-left" onClick={()=>navigate("/booking")}></i>
                    <div className="single-booking-content">
                        <div className="single-booking-content-top">
                        <h3>{item?.name}</h3>
                        <p>₹ {item?.price}</p>
                        <p className="description">{item?.description}</p>
                        <p className='cashback'>Cashback {item?.cashback}</p>
                        </div>
                        <div className="single-booking-content-bottom">
                          
                    <p>Pick Date</p>
                        <input type="date" onChange={(e)=>setBooking((prev) => ({ ...prev, date: e.target.value }))} value={booking.date}/>
                    <p>Pick Time</p>
                        <input type="time" onChange={(e)=>setBooking((prev) => ({ ...prev, time: e.target.value }))} value={booking.time}/>
                        
                        <button onClick={handleBooking}>Book Now</button>
                        </div>
                    </div>
                </div>
            <BottomNav/>
        </div>
      </div>
    </>
  )
}

export default SingleBooking
