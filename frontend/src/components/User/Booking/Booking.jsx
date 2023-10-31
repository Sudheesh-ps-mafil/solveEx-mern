import "./Booking.css";
import TopNav from "../TopNav/TopNav";
import BottomNav from "../BottomNav/BottomNav";
import { useEffect, useState } from "react";
import axios from "axios";
import SERVER_URL from "../../../config/SERVER_URL";
import { useNavigate } from "react-router-dom";
function Booking() {
  const [items, setItems] = useState([]);
  const [originalItems, setOriginalItems] = useState([]);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
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
              .get(SERVER_URL + "/user/items", {
                headers: {
                  "x-access-token": localStorage.getItem("token"),
                },
              })
              .then((res) => {
                if (res.status === 200) {
                  setItems(res.data.items);
                  setOriginalItems(res.data.items);
                }
              })
              .catch(() => {
                localStorage.removeItem("token");
              });
          }
        })
        .catch(() => {
          localStorage.removeItem("token");
        });
    }
  }, [navigate]);

  useEffect(()=>{
    if (search === "") {
      setItems(originalItems);
    } else {
      axios
        .get(SERVER_URL + "/user/items/search/" + search)
        .then((res) => {
          setItems(res.data.items);
        });
    }
  },[originalItems, search])
  return (
    <>
      <div className="container">
        <div className="box">
          <TopNav />
          <div className="booking-container">
            <div className="booking-search">
              <div className="booking-search-container">
                <div className="booking-search-left">
                  <i className="fa-solid fa-magnifying-glass"></i>
                  <input
                    type="text"
                    placeholder="Search for Services"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                    }}
                  />
                </div>
                <div className="booking-search-right">
                  <i className="fa-solid fa-xmark"  onClick={() => {
                      setSearch("");
                    }}></i>
                </div>
              </div>
            </div>
            <div className="booking-card-container">
              {items?.map((item) => (
                <>
                  <div className="booking-card">
                    <div className="booking-image">
                      <img src={item?.image} alt="" />
                    </div>
                    <div className="booking-title">
                      <p>{item?.name}</p>
                    </div>
                    <div className="booking-price">
                      <p>₹ {item?.price}</p>
                    </div>
                    <div className="booking-cashback">
                      <p>Cashback {item?.cashback}</p>
                    </div>
                    <div className="booking-button">
                      <button
                        onClick={() => navigate("/single-booking/" + item?._id)}
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </>
              ))}
            </div>
          </div>
          <BottomNav />
        </div>
      </div>
    </>
  );
}

export default Booking;
