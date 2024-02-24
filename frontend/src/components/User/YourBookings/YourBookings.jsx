import TopNav from "../TopNav/TopNav";
import BottomNav from "../BottomNav/BottomNav";
import "./YourBooking.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import SERVER_URL from "../../../config/SERVER_URL";
import ReactModal from 'react-modal';
import {QRCodeSVG} from 'qrcode.react';
import CLIENT_URL from "../../../config/CLIENT_URL";
function YourBookings() {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [cancelId, setCancelId] = useState(null);
  const [showQr, setShowQr] = useState(false);
  const [qr, setQr] = useState(null);
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
          } else {
            axios
              .get(SERVER_URL + "/user/profile", {
                headers: {
                  "x-access-token": localStorage.getItem("token"),
                },
              })
              .then((res) => {
                if (res.status === 200) {
                  setUser(res.data.user);
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
  }, [navigate]);
  function handleCancelConfirmation(id){
    axios.delete(SERVER_URL+"/user/cancel-booking/"+id,{
      headers:{
        "x-access-token":localStorage.getItem("token")
      }
    }).then(res=>{
      if(res.status===200){
        setUser(res.data.user)
        setShowModal(false)
      }
    }).catch((err)=>console.log(err))
  }
  function handleCancel(id) {
    setCancelId(id);
    setShowModal(true);
  }
  return (
    <>
      <div className="container">
        <div className="box">
          <TopNav />
          <div className="your-booking-container">
            <div className="back-arrow" onClick={() => navigate("/")}>
              <i className="fa-solid fa-chevron-left"></i>
            </div>
            <div className="booking-header">
              <h3>Your Bookings</h3>
            </div>
            <div className="your-booking">
              {!user?.booked?.some((card) => !card.verified) && (
                <div className="no-booking-message">
                  <p>No bookings available</p>
                </div>
              )}

              {user?.booked?.map(
                (card) =>
                  !card.verified && (
                    <div className="your-booking-card" key={card.code}>
                      <div className="your-booking-card-img">
                        <img src="./home-girl.webp" alt="" />
                      </div>
                      <div className="your-booking-card-content">
                        <div>
                          <p>{card?.name}</p>
                          <p>₹ {card?.price}</p>
                          <p>{card?.date}</p>
                          <p>{card?.time}</p>
                          <button className="btn-xs btn-success" onClick={() => (
                            setShowQr(true),
                            setQr(card?.code)
                          )}>QR</button>
                        </div>

                        <div className="your-booking-card-right">
                          <p>Show This Code At RTouch</p>
                          <div className="coupon-code">
                            <p>{card?.code}</p>
                          </div>
                          <button onClick={()=>handleCancel(card._id)}>Cancel</button>
                        </div>
                      </div>
                    </div>
                  )
              )}
            </div>
          </div>
          <BottomNav />
        </div>
      </div>
          {showModal && (
        <ReactModal
          isOpen={showModal}
          contentLabel="Confirmation Modal"
          onRequestClose={() => setShowModal(false)}
        >
          <div className="model">
            <p>Are you sure you want to cancel this booking?</p>
            <button onClick={() => handleCancelConfirmation(cancelId)} className="btn-danger">Yes</button>
            <button onClick={() => setShowModal(false)} className="btn-success">No</button>
          </div>
        </ReactModal>
      )}
      {
        showQr && (
          <ReactModal
            isOpen={showQr}
            contentLabel="Confirmation Modal"
            onRequestClose={() => setShowQr(false)}
          >
            <div className="model">
              <p>QR Code</p>
              <QRCodeSVG value={`${CLIENT_URL}/qrcode-booking/${qr}`} />
              <button onClick={() => setShowQr(false)} className="btn-xs btn-success">Close</button>
            </div>
          </ReactModal>
        )
      }

    </>
  );
}

export default YourBookings;
