import React from 'react'
import "./BottomNav.css"
import { useNavigate } from 'react-router-dom'
function BottomNav() {
  const navigate = useNavigate()
  return (
    <>
      <div className="bottom-nav">
        <div className="booking"  onClick={()=>navigate("/booking")}>
        <i class="fa-solid fa-book"></i>
            <p>Booking</p>
        </div>
        <div className="wallet"  onClick={()=>navigate("/wallet")}>
        <i class="fa-solid fa-wallet"></i>
            <p>Wallet</p>
        </div>
      </div>
    </>
  )
}

export default BottomNav
