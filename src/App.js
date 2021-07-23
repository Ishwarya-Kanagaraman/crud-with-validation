import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import DeleteIcon from "@material-ui/icons/Delete"
import EditIcon from "@material-ui/icons/Edit"
import {BrowserRouter as Router ,Route,Link} from "react-router-dom";
import "./styles.css";
import { Button } from "@material-ui/core";

export default function App() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUsers] = useState({});
  
  const [editFlag,setEditFlag]=useState(false)
  const [name, setName] = useState();
  const [avatar, setAvatar] = useState();

  function getUsers() {
    fetch("https://609e2a6033eed80017957df0.mockapi.io/usersList")
      .then((res) => res.json())
      .then((res) => setUsers(res));
  }

  useEffect(() => {
    getUsers();
  }, [newUser]);
  function deleteUser(id) {
    fetch(`https://609e2a6033eed80017957df0.mockapi.io/usersList/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((res) => getUsers())
      .then((res) => console.log(res));
  }
  return (
    <div >
      <Router>
      {/* <AddUser refreshUsers={getUsers} /> */}
      <div>
        <ul >
          <li>Home</li>
          <li>Users</li>
        </ul>
      </div>
      {users.map((user,idx) => (
        <>
       
        
        <div className="card" key={user.id}>
          <div className="card-body">
          <img
            src={user.avatar}
            // style={{ height: "100px" }}
            alt="Sometimes profile must be blank"
          />
          <div className="card-content">
          <h3>{user.name}</h3>
          <p>{user.description}</p>
          </div>
          </div>
          {/* <hr/> */}
          <DeleteIcon onClick={()=>deleteUser(user.id)}className="icons"/>
          <Link style={{color:"white",textDecoration:'none'}}to={`/editUser/${idx}`}>
          <EditIcon className="icons edit"/>
          </Link>

         
          <Route path={`/editUser/${idx}`}>
      <UpdateUser  user={user}
              flag={editFlag}
              setFlag={setEditFlag}
              refreshUsers={setNewUsers}
              name={name}
              setName={setName}
              avatar={avatar}
              setAvatar={setAvatar} />
      </Route>
        </div>
       
        </>
      ))}
      
      <Button style={{margin:'15px auto',width:'100%'}}variant="contained" color="primary">
        <Link style={{color:"white",textDecoration:'none'}}to='/adduser'>Add User</Link>
      </Button>
      <Route path="/adduser">
      <AddUser refreshUsers={setNewUsers} />
      </Route>
      </Router>
    </div>
  );
}

function AddUser({ refreshUsers }) {
  const [flag,setFlag]=useState(true);
  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required("Name is awesome why leave it blank!?")
      .min(3, "Tell me your full name")
      .max(8, "Keep it short buddy"),
    avatar: Yup.string()
      .required("Show as your handsome pic")
      .url("Not looks like a url"),
    password: Yup.string().min(8, "Password at least 8 chars"),
    confrimPassword: Yup.string().oneOf(
      [Yup.ref("password"), null],
      "Password must match"
    )
  });

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({ resolver: yupResolver(validationSchema) });

  const onSubmit = (data) => {
    
    console.log(data);
    addUser(data);
    setFlag(false)
  };

  return (
    <form style={{display:flag? 'block':'none'}}className="myForm"onSubmit={handleSubmit(onSubmit)}>
      <input {...register("name")} placeholder="Enter your name" />
      {errors.name && (
        <span style={{ color: "crimson" }}> {errors.name.message} </span>
      )}
      <input {...register("avatar")} placeholder="Enter your profile pic url" />
      {errors.avatar && (
        <span style={{ color: "crimson" }}> {errors.avatar.message} </span>
      )}
      {/* crt+d */}
      <br />
      <input
        {...register("password")}
        type="password"
        placeholder="Enter your password"
      />
      {errors.password && (
        <span style={{ color: "crimson" }}> {errors.password.message} </span>
      )}

      <input
        {...register("confrimPassword")}
        type="password"
        placeholder="Confirm password"
      />
      {errors.confrimPassword && (
        <span style={{ color: "crimson" }}>
          {errors.confrimPassword.message}
        </span>
      )}

      <input type="submit" />
    </form>
  );

  function addUser(data) {
    fetch("https://609e2a6033eed80017957df0.mockapi.io/usersList", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ ...data, createdAt: new Date().toISOString() })
    })
      .then((res) => res.json())
      .then((res) => refreshUsers(res));
  }
}
function UpdateUser({ name,
  setName,
  avatar,
  setAvatar,
  flag,
  setFlag,
  refreshUsers,
  user,}) {

  const [flag1,setFlag1]=useState(true);
  
  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required("Name is awesome why leave it blank!?")
      .min(3, "Tell me your full name")
      .max(8, "Keep it short buddy"),
    avatar: Yup.string()
      .required("Show as your handsome pic")
      .url("Not looks like a url")
    // password: Yup.string().min(8, "Password at least 8 chars"),
    // confrimPassword: Yup.string().oneOf(
    //   [Yup.ref("password"), null],
    //   "Password must match"
    // )
  });

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({ resolver: yupResolver(validationSchema) });

  const onSubmit = (data) => {
    
    console.log(data);
    editUser(data);
    setFlag1(false)
  };

  return (
    <form style={{display:flag1 ? 'block':'none'}}className="myForm"onSubmit={handleSubmit(onSubmit)}>
      <input {...register("name")} placeholder="Enter name to be updated" />
      {errors.name && (
        <span style={{ color: "crimson" }}> {errors.name.message} </span>
      )}
      <input {...register("avatar")} placeholder="Enter profile to be updated" />
      {errors.avatar && (
        <span style={{ color: "crimson" }}> {errors.avatar.message} </span>
      )}
  
      <br />

      <input type="submit" />
    </form>
  );

  function editUser(data) {
    fetch(`https://609e2a6033eed80017957df0.mockapi.io/usersList/${user.id}`, {
      method: "PUT",
      headers: {
        "Accept":"application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ ...data, createdAt: new Date().toISOString() })
    })
      .then((res) => res.json())
      .then((res) => refreshUsers(res));
  }
}