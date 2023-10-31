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
                <Link to="/admin/dashboard">Dashboard</Link>
            </li>
            <li>
                <Link to="/admin/redeem-code">Coupon</Link>
            </li>
            <li>
                <Link to="/admin/users">All Users</Link>
            </li>
            <li>
                <Link to="/admin/bookings">Bookings</Link>
            </li>
        </ul>
        <i onClick={()=>setShow((prev)=>!prev)} className="fa-solid fa-bars"></i>
      </div>
    </>
  )
}

export default AdminNavbar
