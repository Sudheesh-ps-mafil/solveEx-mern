import { Link } from "react-router-dom"
import "./AdminNavbar.css"
import { useState } from "react"
function AdminNavbar() {
  const [show,setShow] = useState(false)
  return (
    <>
      <div  className={`admin-navbar ${show && "active"}`}>
        <ul>
            <li>
                <Link to="/admin/dashboard">Booking Verify</Link>
            </li>
            <li>
                <Link to="/admin/redeem-code">Coupon</Link>
            </li>
            <li>
                <Link to="/admin/all-users">All Users</Link>
            </li>
            <li>
                <Link to="/admin/all-bookings">Bookings</Link>
            </li>
            <li>
                <Link to="/admin/notification">Notification</Link>
            </li>
            <li>
                <Link to="/admin/add-items">Add Items</Link>
            </li>
            <li>
                <Link to="/admin/all-items">All Items</Link>
            </li>
            <li>
                <Link to="/admin/add-cashback">Add Cashback</Link>
            </li>
            <li>
                <Link to="/admin/all-cashback">All Cashback</Link>
            </li>
        </ul>
        <i onClick={()=>setShow((prev)=>!prev)} className="fa-solid fa-bars"></i>
      </div>
    </>
  )
}

export default AdminNavbar
