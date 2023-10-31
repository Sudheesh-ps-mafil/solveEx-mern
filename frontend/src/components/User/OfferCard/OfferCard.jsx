import { useNavigate } from "react-router-dom";

function OfferCard() {
  const navigate = useNavigate();
  return (
    <>
        <div className="offer-card-container">
             
             <div className="offer-card">
               <div className="offer-card-left">
         
               </div>
               <div className="offer-card-right">
                 <p>10% Cashback on Every Booking</p>
                 <button onClick={() => navigate("/booking")}>Book Now</button>
               </div>
             </div>
             <div className="offer-card">
               <div className="offer-card-left">
                
               </div>
               <div className="offer-card-right">
                 <p>Redeem And Get Unlimited Offers</p>
                 <button onClick={() => navigate("/wallet")}>Redeem Now</button>
               </div>
             </div>
             <div className="offer-card">
               <div className="offer-card-left">
               
               </div>
               <div className="offer-card-right">
                 <p>Know More Details</p>
                 <button>Contact Us</button>
               </div>
             </div>
           </div>
    </>
  )
}

export default OfferCard
