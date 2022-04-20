import {React} from "react";
import {BrowserRouter as Router, Routes, Route, Link} from "react-router-dom";
import Account from "./Views/Account";
import Login from "./Views/Login";
import Logout from "./Views/Logout";
import UsersMenu from "./Views/Users/UsersMenu";
import GetUsers from "./Views/Users/GetUsers";
import SearchUsers from "./Views/Users/SearchUsers";
import CreateUser from "./Views/Users/CreateUser";
import EditUser from "./Views/Users/EditUser";
import DeleteUser from "./Views/Users/DeleteUser";
import Home from "./Views/Home";
import Error from "./Views/404";

function App() {

  return (
    <>
      <Router>
        <nav style={{display: 'flex',  justifyContent:'space-evenly', alignItems:'center', width: '100%'}}>
          <Link to="/" style={{marginleft:"auto"}}>Home</Link>
            <Link to="/account" style={{marginleft:"auto"}}>Account</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Home/>}/>{/*The "" path redirects to the component*/}
          <Route path="/account" element={<Account/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/logout" element={<Logout/>}/>
          <Route path="/users" element={<UsersMenu/>}/>
          <Route path="/users/get" element={<GetUsers/>}/>
          <Route path="/users/search" element={<SearchUsers/>}/>
          <Route path="/users/create" element={<CreateUser/>}/>
          <Route path="/users/edit" element={<EditUser/>}/>
          <Route path="/users/delete" element={<DeleteUser/>}/>
          <Route path="*" element={<Error/>}/>{/*If a bad route is given*/}
        </Routes>
      </Router>
    </>
  );

}

export default App;
