
import { useEffect, useState } from "react";
import "./TopNav.css"
import { useNavigate } from 'react-router-dom'
import axios from "axios";
import SERVER_URL from "../../../config/SERVER_URL";
function TopNav({change}) {
  const navigate = useNavigate()
  const [wallet,setWallet] = useState(0)
  const [redCircle,setRedCircle] = useState(false)
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    } else {
      axios
        .get(SERVER_URL + "/user/profile", {
          headers: {
            "x-access-token": localStorage.getItem("token"),
          },
        })
        .then((res) => {
          if (res.status === 200) {
            setWallet(res.data.user.wallet);
            if (res.data.user.booked.some((card) => !card.verified)) {
              setRedCircle(true);
            }
            
          }else{
            navigate("/login");
            localStorage.removeItem("token");

          }
        })
        .catch(() => {
          localStorage.removeItem("token");
        });
    }
  }, [navigate,change]);
  return (
    <>
      <div className="top-nav">
        <div className="top-nav-left" onClick={()=>navigate("/")}>
          <p>RTouch</p>
        </div>
        <div className="top-nav-right">
          <div className="wallet-container" onClick={()=>navigate("/wallet")}>
          <i className="fa-solid fa-wallet"></i>
          <p>{wallet}</p>
          </div>
          <div className="bell-icon" onClick={()=>navigate("/your-bookings")}> 

          <i  className="fa-solid fa-bell"></i>
          {redCircle && <span className="red-circle"></span>}
         
          </div>
          <i onClick={()=>navigate("/profile")} className="fa-solid fa-user"></i>
        </div>
      </div>
    </>
  )
}

export default TopNav
