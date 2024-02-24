import { useEffect, useState } from "react";
import "./ProfileEdit.css";
import TopNav from "../TopNav/TopNav";
import BottomNav from "../BottomNav/BottomNav";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SERVER_URL from "../../../config/SERVER_URL";
import { toast } from "react-toastify";
function ProfileEdit() {
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
                  ).catch((err)=>{
                    
                    console.log(err)
                })  
              }
        }
        ).catch(()=>{
          localStorage.removeItem("token");
        })
      }
      }, [navigate]);
      function handleSubmit(){
        if(user.email==="" || user.name==="" || user.password===""){
          toast.error("Complete all fields")
        }else{
          axios.post(SERVER_URL+"/user/profile-edit",{
            name:user.name,
            email:user.email,
            phoneNumber:user.phoneNumber
          },{
            headers: {
              "x-access-token": localStorage.getItem("token"),
            },
          }).then((res)=>{
            if(res.status===200){
              toast.success("Profile updated")
              navigate("/profile")
            }
          }).catch(()=>{
            toast.error("Something went wrong")
          })
        }
      }
  return (
    <>
      <div className="container">
        <div className="box">
          <TopNav />
          <div className="profile-edit-container">
            <div className="profile-edit">
              <div className="back-arrow" onClick={()=>navigate("/profile")}>
              <i className="fa-solid fa-chevron-left"></i>
              </div>
              <div className="profile-edit-header">
                <p>Edit Profile</p>
              </div>
              <div className="profile-edit-body">
                <div className="profile-edit-body-left">
                  <div className="profile-edit-body-left-input">
                    <label htmlFor="name">Name</label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      placeholder="Enter your name"
                      value={user.name}
                      onChange={(e) => setUser((prev) => ({ ...prev, name: e.target.value }))}

                    />
                  </div>
                  <div className="profile-edit-body-left-input">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      placeholder="Enter your email"
                      value={user.email}
                      onChange={(e) => setUser((prev) => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  <div className="profile-edit-body-left-input">
                    <label htmlFor="phone">Phone</label>
                    <input
                      type="text"
                      name="phone"
                      id="phone"
                      placeholder="Enter your phone"
                      value={user.phoneNumber}
                      onChange={(e) => {
                        const phoneNumber = e.target.value.startsWith('+91') ? e.target.value : '+91' + e.target.value;
                        setUser((prev) => ({ ...prev, phoneNumber }));
                      }}
                    />
                  </div>

                  <div className="profile-edit-button">
                    <button onClick={handleSubmit}>Save</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <BottomNav />
        </div>
      </div>
    </>
  );
}

export default ProfileEdit;
