import { useEffect, useState } from "react";
import AdminNavbar from "../AdminNavbar/AdminNavbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SERVER_URL from "../../../config/SERVER_URL";
import { toast } from "react-toastify";
function AddCashBack() {
  const navigate = useNavigate();
  const [cashBack, setCashBack] = useState({
    name: "",
    cashback: 0,
  });
  const [image, setImage] = useState(null);

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
    formData.append("name", cashBack.name);
    formData.append("cashback", cashBack.cashback);

    axios
      .post(SERVER_URL + "/admin/cashback", formData, {
        headers: {
          "x-access-token": localStorage.getItem("admin-token"),
        },
      })
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          toast.success("Cashback Added Successfully");
          setCashBack({
            name: "",
            cashback: 0,
          });
          setImage(null);
        }
      })
      .catch((err) => {
        console.error("Error submitting notification:", err);
      });
  };

  return (
    <div className="admin-container">
      <AdminNavbar />
      <div className="notification-container my-10 flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center h-screen dark w-96">
          <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-200 mb-4">Add CashBack</h2>
            <div className="max-w-sm mx-auto my-4">
              <label
                htmlFor="name"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                onChange={(e) => setCashBack({ ...cashBack, name: e.target.value })}
                value={cashBack.name}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="example"
              />
            </div>
         
            <div className="max-w-sm mx-auto my-4">
              <label
                htmlFor="number"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                cashback
              </label>
              <input
                type="number"
                id="cashback"
                onChange={(e) => setCashBack({ ...cashBack, cashback: e.target.value })}
                value={cashBack.cashback}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="example"
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

export default AddCashBack;
