import React, { useEffect, useState } from 'react';
import { messaging } from "./firebase"; // Make sure you import messaging correctly
import { getToken } from "firebase/messaging";
import axios from "axios";

function Notification() {
    const [token, setToken] = useState(null);

    async function requestPermission() {
        try {
            const permission = await Notification.requestPermission();
            if (permission === "granted") {
                const newToken = await getToken(messaging, { vapidKey: "BIho2d9b0XKQE85ZDUh6Ovm9CtDdXhShRRllimp1SmYtCqZ" });
                setToken(newToken);
                await axios.post("http://localhost:3001/api/notification", {
                    token: newToken,
                });
            } else if (permission === "denied") {
                alert("You have denied the permission");
            }
        } catch (error) {
            console.error('Error requesting notification permission:', error);
        }
    }

    useEffect(() => {
        requestPermission();
    }, []);

    console.log(token);

    return (
        <div>
            Token: {token}
        </div>
    );
}

export default Notification;
