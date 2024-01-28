
import "./Profile.css"
import TopNav from '../TopNav/TopNav'
import BottomNav from '../BottomNav/BottomNav'
import { useNavigate } from 'react-router-dom'
import { useEffect ,useState} from "react"
import axios from "axios"
import SERVER_URL from "../../../config/SERVER_URL"
function Profile() {
  const [user,setUser] = useState({})
    const navigate = useNavigate()
    useEffect(() => {
      if(!localStorage.getItem("token")){
        navigate("/login");
      }else{
        axios.get(SERVER_URL+"/user/protected", {
          headers: {
            "x-access-token": localStorage.getItem("token"),
          },
        }).then((res) => {
            if (res.status !== 200) {
                navigate("/login");
                localStorage.removeItem("token");
              }else{
                axios.get(SERVER_URL+"/user/profile", {
                  headers: {
                    "x-access-token": localStorage.getItem("token"),
                  },
                }).then((res) => {
                    if(res.status===200){
                      if(res.data.user.email==="" || res.data.user.name==="" || res.data.user.password===""){
                        navigate("/profile-edit")
                      }
                      setUser(res.data.user)
                    }
                  }
                  ).catch(()=>{
                  console.log("error")

                })
              }
        }
        ).catch(()=>{
          localStorage.removeItem("token");
        })
      }
      }, [navigate]);
  return (
    <>
      <div className="container">
        <div className="box">
            <TopNav/>
            <div className="profile-container">
                <div className="profile-details">
                <div className="back-arrow" onClick={()=>navigate("/")}>
              <i className="fa-solid fa-chevron-left"></i>
              </div>
                    <div className="profile-header">
                        <p>Profile</p>
                    </div>
                    <div className="profile-details-container">
{/* 
                    <div className="profile-logo">
                        <img src="https://i.ibb.co/7XsQw7j/Rectangle-1.png" alt="profile-logo" />
                    </div> */}
                    <div>

                    <div className="profile-name">
                    <i className="fa-solid fa-user"></i>
                        <p> {user?.name}</p>
                        </div>
                        <div className="profile-email">
                        <i className="fa-solid fa-envelope"></i>
                            <p>{user?.email}</p>
                        </div>
                        <div className="profile-phone">
                        <i className="fa-solid fa-phone"></i>
                            <p>{user?.phoneNumber}</p>
                        </div>
                    </div>
                    </div>
                    <div className="profile-buttons" onClick={()=>navigate("/profile-edit")}>
                        <button>Edit Profile</button>
                    </div>
                    <div className="profile-buttons">
                        <button>Terms and Conditions</button>
                    </div>
                    <div className="profile-buttons">
                        <button>Privacy Policy</button>
                    </div>
                    <div className="profile-buttons">
                        <button>Logout</button>
                    </div>
                    
                </div>
            </div>
            <BottomNav/>
        </div>
      </div>
    </>
  )
}

export default Profile
