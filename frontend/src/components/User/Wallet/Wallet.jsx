import TopNav from "../TopNav/TopNav";
import BottomNav from "../BottomNav/BottomNav";
import "./Wallet.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import SERVER_URL from "../../../config/SERVER_URL";
import { toast } from "react-toastify";
function Wallet() {
  const [user, setUser] = useState({});
  const [redeemCards, setRedeemCards] = useState([]);
  const navigate = useNavigate();
  const [walletChange,setWalletChange] = useState(false)
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
                  axios
                    .get(SERVER_URL + "/user/redeem-card", {
                      headers: {
                        "x-access-token": localStorage.getItem("token"),
                      },
                    })
                    .then((res) => {
                      if (res.status === 200) {
                        setRedeemCards(res.data);
                      }
                    });
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
  }, [navigate, user?.wallet]);
  function handleRedeem(id,cashback){
    if(user?.wallet<cashback){
      return toast.error("Not enough balance")
    }

    axios.post(SERVER_URL+"/user/add-redeem-code",{
      cashbackId:id
    }, {
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    }).then((res)=>{
      if(res.status===200){
        setUser(res.data.user);
      setWalletChange((prev)=>!prev)
      }
    })
  }
  return (
    <>
      <div className="container">
        <div className="box">
          <TopNav change={walletChange}/>
          <div className="wallet-cashback-container">
            <div className="wallet-card">
              <div className="wallet-card-content">
                <p>Wallet Balance</p>
                <p>{user?.wallet}</p>
              </div>
            </div>
            {user?.redeemed?.some((card) => !card.verified) && (
              <>
                <div className="redeemed-cashback-cards">
                  <div className="redeemed-card-header">
                    <h3>Redeemed Cards</h3>
                  </div>
                  {user?.redeemed.map(
                    (card) =>
                      !card.verified && (
                        <div className="redeem-card" key={card.code}>
                          <div className="redeem-card-content">
                            <p>{card?.name}</p>
                            <p>{card?.price}</p>
                          </div>
                          <div className="redeem-cashback-code">
                            <p className="info">Show This At RTouch</p>
                            <p className="redeem-code">{card?.code}</p>
                          </div>
                        </div>
                      )
                  )}
                </div>
              </>
            )}

            <div className="redeem-cashback">
              <h3>Redeem Cashback</h3>
              <div className="redeem-cards">
                {
                  redeemCards?.map((card)=>(<>
                  
                <div className="redeem-card">
                  <div className="redeem-card-img">
                    <img src={card?.image} alt="" />
                  </div>
                  <div className="redeem-card-content">
                    <p>{card?.name}</p>
                    <p>{card?.cashback}</p>
                  </div>
                  <div className="redeem-btn">
                    <button onClick={()=>handleRedeem(card._id,card?.cashback)}>Redeem</button>
                  </div>
                </div>
                  </>))
                }
         
              </div>
            </div>
          </div>
          <BottomNav />
        </div>
      </div>
    </>
  );
}

export default Wallet;
