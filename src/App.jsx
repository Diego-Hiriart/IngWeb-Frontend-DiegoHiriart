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
import AdminEditUser from "./Views/Users/AdminEditUser";
import BrandsModelsMenu from "./Views/BrandsModels/BrandsModelsMenu";
import ModelSearch from "./Views/BrandsModels/ModelSearch"
import ManageBrands from "./Views/BrandsModels/ManageBrands"
import ManageModels from "./Views/BrandsModels/ManageModels"
import ManageComponents from "./Views/BrandsModels/ManageComponents";
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
          <Route path="/users/admin-control" element={<AdminEditUser/>}/>
          <Route path="/brands-models" element={<BrandsModelsMenu/>}/>
          <Route path="/brands-models/model-search" element={<ModelSearch/>}/>
          <Route path="/brands-models/manage-brands" element={<ManageBrands/>}/>
          <Route path="/brands-models/manage-models" element={<ManageModels/>}/>
          <Route path="/brands-models/manage-components" element={<ManageComponents/>}/>
          <Route path="*" element={<Error/>}/>{/*If a bad route is given*/}
        </Routes>
      </Router>
    </>
  );

}

export default App;
