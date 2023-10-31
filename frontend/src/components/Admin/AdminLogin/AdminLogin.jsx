import axios from "axios";
import { useState } from "react";
import SERVER_URL from "../../../config/SERVER_URL";
import { useNavigate } from "react-router-dom";


function AdminLogin() {
const [email,setEmail] = useState("");
const [password,setPassword] = useState("");
const navigate = useNavigate()
function handleSubmit(){
    axios.post(SERVER_URL+"/admin/login",{
        email:email,
        password:password
    }).then((res)=>{   
        if(res.status===200){
         
            localStorage.setItem('admin-token',res.data.token);
            navigate("/admin/dashboard")
        }
    }).catch((error)=>{
        console.log(error);
    })
}
  return (
    <>
      <div className="container">
        <div className="box">
          <div className="login">
            <div className="logo">
              <img src="/orange-brush.jpg" alt="logo" />
            </div>

            <div className="text-logo">
              <p>Admin</p>
            </div>
            <div className="login-container">
             
                  <div className="phone-login">
                    <p>Email</p>
                    <input
                      className="login-input"
                      name="text"
                      id="email"
                      placeholder="Enter Your Email"
                      type="email"
                     value={email}
                        onChange={(e)=>setEmail(e.target.value)}
                    />
                    <p>Password</p>
                    <input
                      className="login-input"
                      name="text"
                      id="password"
                      placeholder="Enter Your Password"
                      type="text"
                     value={password}
                        onChange={(e)=>setPassword(e.target.value)}
                    />

                    <div>
                      <button onClick={handleSubmit}>Submit</button>
                    </div>
                  </div>
          
               
            
                 
             
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminLogin;
