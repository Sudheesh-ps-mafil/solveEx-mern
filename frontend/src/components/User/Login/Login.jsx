import  { useEffect, useState } from "react";
import "./Login.css";
import { RecaptchaVerifier, signInWithPhoneNumber, signInWithPopup } from "firebase/auth";

import { useNavigate } from "react-router-dom";
import axios from "axios";
import  SERVER_URL  from "../../../config/SERVER_URL";
import { auth,provider } from "../../../config/firebase";
function Login() {

  const [phoneNumber, setPhoneNumber] = useState("");
  const [OTP,setOTP] = useState(0)
  const [showOTP, setShowOTP] = useState(false);
  const navigate = useNavigate()
  // Initialize the reCAPTCHA verifier
  useEffect(() => {
    if (localStorage.getItem("token")) {
      axios.get(SERVER_URL+"/user/protected", {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      }).then((res) => {
        if (res.status === 200) {
          navigate("/");
        }else{
            localStorage.removeItem("token");
        }
      }
      ).catch(()=>{
        localStorage.removeItem("token");
      })
    }
  }, [navigate]);

const initializeRecaptchaVerifier = () => {
    if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(
            "recaptcha-container",
            {
                size: "invisible",
                callback: () => {
                    onSignup();
                },
                "expired-callback": () => {},
            },
            auth
        );
    }
}

// Handle phone number submission
const onSignup = async () => {
    initializeRecaptchaVerifier();

    // Ensure the phone number includes "91"
    const formatPh = phoneNumber.startsWith("91") ? `+${phoneNumber}` : `+91${phoneNumber}`;

    try {
        console.log(formatPh);

        const confirmationResult = await signInWithPhoneNumber(auth, formatPh, window.recaptchaVerifier);
        window.confirmationResult = confirmationResult;

        setShowOTP(true);
    } catch (error) {
        console.log(error);
      
    }
}

// Handle OTP verification
const onOTPVerify = async () => {
    try {
        if (!window.confirmationResult) {
            throw new Error("No confirmation result available. Please submit your phone number again.");
        }

        const res = await window.confirmationResult.confirm(OTP);

        if (res.user) {
            console.log("User signed in:", res.user);
            axios.post(SERVER_URL + '/user/phone-login', {
                token: await res.user.getIdToken()
            }).then((res) => {
                if (res.status === 200) {
                    localStorage.setItem('token', res.data.token);
                    if(res.data.newAccount){

                      navigate("/profile-edit");
                    }else{
                      navigate("/");
            
                    }
                    
                }
            })
            // Handle successful verification, e.g., redirect or update UI
        } else {
            throw new Error("Verification failed. User not signed in.");
        }
    } catch (error) {
        console.log(error);
       
    }
}

  const handleGoogleSubmit = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const idToken = await user.getIdToken();

      const loginResponse = await axios.post(SERVER_URL + "/user/google-login", {
        user: user,
        token: idToken,
      });

      if (loginResponse.status === 200) {
        localStorage.setItem('token', loginResponse.data.token);
        if(loginResponse.data.newAccount){

          navigate("/profile-edit");
        }else{
          navigate("/");

        }
      }
    } catch (error) {
      console.log(error);
      // Handle the error here
   
    }
  };
  return (
    <>
      <div className="container">
        <div className="box">
          <div className="login">
            <div className="logo">
              <img src="./orange-brush.jpg" alt="logo" />
            </div>

            <div className="text-logo">
              <p>RTouch</p>
            </div>
            <div className="login-container">
              {!showOTP ? (
                <>
                  <div className="phone-login">
                    <p>Phone Number</p>
                    <input
                      className="login-input"
                      name="text"
                      id="phone"
                      placeholder="Enter Your Phone Number"
                      type="number"
                      value={phoneNumber}
                      onChange={(e)=>setPhoneNumber(e.target.value)}
                    />

                    <div>
                      <button onClick={onSignup}>Submit</button>
                    </div>
                  </div>
                  <div className="divider">
                    <span className="line"></span>
                    <span className="or">OR</span>
                    <span className="line"></span>
                  </div>
                  <div className="google-login" onClick={handleGoogleSubmit}>
                    <button className="google-button">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        preserveAspectRatio="xMidYMid"
                        viewBox="0 0 256 262"
                      >
                        <path
                          fill="#4285F4"
                          d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                        ></path>
                        <path
                          fill="#34A853"
                          d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                        ></path>
                        <path
                          fill="#FBBC05"
                          d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
                        ></path>
                        <path
                          fill="#EB4335"
                          d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                        ></path>
                      </svg>
                      Continue with Google
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="back-arrow" onClick={()=>setShowOTP(false)}>
                    <i className="fa-solid fa-chevron-left"></i>
                  </div>
                  <div className="phone-login">
                    <p>Verify OTP</p>
                    <input
                      className="login-input"
                      name="text"
                      id="phone"
                      placeholder="Enter Your OTP"
                      type="number"
                      value={OTP}
                      onChange={(e)=>setOTP(e.target.value.slice(0, 6))}
                    />

                    <div>
                      <button onClick={onOTPVerify}>Submit</button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
          <div id="recaptcha-container"></div>
        </div>
      </div>
    </>
  );
}

export default Login;
