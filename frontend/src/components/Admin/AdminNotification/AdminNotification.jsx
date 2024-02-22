import { useEffect, useState } from "react";
import AdminNavbar from "../AdminNavbar/AdminNavbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SERVER_URL from "../../../config/SERVER_URL";

function AdminNotification() {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");
  const [url, setUrl] = useState("");

  useEffect(()=>{
    if (!localStorage.getItem("admin-token")) {
      navigate("/login");
    } else {
      axios
        .get(SERVER_URL + "/admin/protected", {
          headers: {
            "x-access-token": localStorage.getItem("admin-token"),
          },
        })
        .then((res) => {
          if (res.status !== 200) {
            navigate("/login");
            localStorage.removeItem("admin-token");
          }
        })
        .catch(() => {
          localStorage.removeItem("admin-token");
        });
    }
  },[navigate])
  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", image);
    formData.append("title", message);
    formData.append("url", url);

    axios
      .post(SERVER_URL + "/admin/send-notification", formData, {
        headers: {
          "x-access-token": localStorage.getItem("admin-token"),
        },
      })
      .then((res) => {
        if (res.status === 200) {
          navigate("/admin/notification");
        }
      })
      .catch((err) => {
        console.error("Error submitting notification:", err);
      });
  };

  return (
    <div className="admin-container">
      <AdminNavbar />
      <div className="notification-container">
        <div className="flex flex-col items-center justify-center h-screen dark">
          <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-200 mb-4">
              Add Notification
            </h2>
            <div className="max-w-sm mx-auto my-4">
              <label
                htmlFor="message"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Body
              </label>
              <textarea
                onChange={(e) => setMessage(e.target.value)}
                value={message}
                id="message"
                rows={4}
                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Leave a comment..."
              />
            </div>
            <div className="max-w-sm mx-auto my-4">
              <label
                htmlFor="url"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Your URL
              </label>
              <input
                type="url"
                id="url"
                onChange={(e) => setUrl(e.target.value)}
                value={url}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="example.com"
              />
            </div>
            <div className="max-w-lg mx-auto my-4">
              <label
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                htmlFor="user_avatar"
              >
                Upload Image
              </label>
              <input
                className="block w-full text-lg text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                id="user_avatar"
                type="file"
                onChange={handleFileChange}
              />
            </div>
            <div className="max-w-lg mx-auto my-5">
              <button
                type="button"
                onClick={handleSubmit}
                className="text-white my-5 w-full bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminNotification;
