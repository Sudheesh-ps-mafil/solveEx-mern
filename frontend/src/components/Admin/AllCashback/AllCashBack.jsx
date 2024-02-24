import React, { useEffect, useState } from "react";
import AdminNavbar from "../AdminNavbar/AdminNavbar";
import SERVER_URL from "../../../config/SERVER_URL";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

function AllCashBack() {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();
  const [page, setPage] = useState(1);

  useEffect(() => {
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
          } else {
            axios
              .get(SERVER_URL + "/admin/get-all-cashback?page=1&limit=10", {
                headers: {
                  "x-access-token": localStorage.getItem("admin-token"),
                },
              })
              .then((res) => {
                if (res.status === 200) {
                  setItems(res.data.cashback);
                }
              })
              .catch((error) => {
                console.log(error);
              });
          }
        })
        .catch(() => {
          localStorage.removeItem("admin-token");
        });
    }
  }, [navigate]);
  useEffect(() => {
    axios
      .get(SERVER_URL + "/admin/get-all-cashback?page=" + page + "&limit=10", {
        headers: {
          "x-access-token": localStorage.getItem("admin-token"),
        },
      })
      .then((res) => {
        if (res.status === 200) {
          setItems(res.data.cashback);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [page]);
 
  const handleDelete = (id) => {
    axios
      .delete(SERVER_URL + "/admin/cashback/" + id, {
        headers: {
          "x-access-token": localStorage.getItem("admin-token"),
        },
      })
      .then((res) => {
        if (res.status === 200) {
            setItems(items.filter((item) => item._id !== id));
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handlePageChange = (value) => {
    // Ensure that the value is within the valid range
    const newPage = Math.max(1, Math.min(value, totalPage));

    // Update the page state
    setPage(newPage);
  };
  return (
    <>
      <div className="admin-container">
        <AdminNavbar />
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg p-10 h-100 overflow-hidden">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Item Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Image
                </th>
                <th scope="col" className="px-6 py-3">
       Cashback
                </th>
            
         
                <th scope="col" className="px-6 py-3">
                    Delete
                </th>
              </tr>
            </thead>
            <tbody>
              {items?.map((item) =>
               <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
               <th
                 scope="row"
                 className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
               >
                 {item?.name}
               </th>
               <th
                 scope="row"
                 className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
               >
                <img src={item?.image} className="w-20" alt="" />
               </th>

               <td className="px-6 py-4">{item?.cashback}</td>

               <td className="px-6 py-4">
                 <button
                   onClick={() => handleDelete(item._id)}
                   className="font-medium text-red-600 dark:text-red-500 hover:underline"
                 >
              Delete
                 </button>
               </td>
             </tr>

              )}
            </tbody>
          </table>
          <nav aria-label="Page navigation example p-4 m-4">
            <ul class="flex items-center -space-x-px h-8 text-sm">
              <li onClick={() => handlePageChange(page - 1)}>
                <p class="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                  <span class="sr-only">Page 1</span>
                  prev
                </p>
              </li>

              <li onClick={() => handlePageChange(page + 1)}>
                <p
                  href="?page=3&limit=10"
                  class="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  <span class="sr-only">Next Page</span>
                  Next
                </p>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}

export default AllCashBack;
