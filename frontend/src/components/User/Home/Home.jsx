import BottomNav from "../BottomNav/BottomNav";
import TopNav from "../TopNav/TopNav";
import "./Home.css";
import OfferCard from "../OfferCard/OfferCard";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import SERVER_URL from "../../../config/SERVER_URL";
function Home() {
  const [items,setItems] = useState([])
  const navigate = useNavigate();
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
            axios.get(SERVER_URL + "/user/items", {
              headers: {
                "x-access-token": localStorage.getItem("token"),
              },
            })
            .then((res) => {
            if(res.status===200){
              setItems(res.data.items)
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
  return (
    <>
      <div className="container">
        <div className="box">
          <TopNav />
          <div className="home">
            <div className="home-search">
              <div className="home-search-container" onClick={() => navigate("/booking")}>
                <div className="home-search-left">
                  <i className="fa-solid fa-magnifying-glass"></i>
                  <input type="text" placeholder="Search for Services" />
                </div>
                <div className="home-search-right"></div>
              </div>
            </div>
            <div className="home-card">
              <img src="./home-girl.webp" alt="" />
              <div className="home-card-inside">
                <p>Explore the your Beauty at RTouch Makeup Studio</p>
                <button onClick={() => navigate("/booking")}>Book Now</button>
              </div>
            </div>
            <OfferCard />
            <p className="service-title">Our Services</p>
            <div className="service-container">
              {items?.map((item) => (
                <>
                
              <div className="service-card">
                <div className="service-card-left">
                  <img src={item?.image} alt="" />
                  <div className="service-card-left-content">
                    <p>{item?.name}</p>
                    <p>{item?.price}</p>
                    <p>Cashback {item?.cashback}</p>
                  </div>
                </div>
                <div className="service-card-right">
                  <button onClick={()=>navigate("/single-booking/"+item?._id)}>Book Now</button>
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

export default Home;
