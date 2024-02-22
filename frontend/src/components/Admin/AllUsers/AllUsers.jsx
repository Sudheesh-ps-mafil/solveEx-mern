import React, { useEffect } from 'react'

function AllUsers() {
  const [Users, setUsers] = useState([])
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
  return (
    <div>
      
    </div>
  )
}

export default AllUsers
