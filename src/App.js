import { Fragment, useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Login from "./pages/Login";
import Root from "./pages/Root";
import ErrorPage from "./pages/ErrorPage";
import PrivateRoute from "./pages/PrivateRoute";
import Home from "./pages/Home";
import Roles from "./pages/Roles";
import Users from "./pages/Users";
import Password from "./pages/Password";
import Profile, {loader as userDataLoader} from "./pages/Profile";
import UserInfo, {loader as adminsLoader} from "./pages/UserInfo";
import Layout from "./pages/Layout";
import Items from "./pages/Items";
import Inventory from "./pages/Inventory";
import Order from "./pages/Order";
import SpecificOrder from "./pages/SpecificOrder";
import Statistics from "./pages/Statistics";

const router = createBrowserRouter([
  {path: "/login", element: <Login />},
  {path: "/userInfo", element: <UserInfo />, loader: adminsLoader},
  {path: "/", element: <PrivateRoute to='/login'><Root /></PrivateRoute>, errorElement: <ErrorPage />, children: [
    {path: "/", element: <Home />}, 
    {path: "/roles", element: <Roles />},
    {path: "/users", element: <Users />},
    {path: "/password", element: <Password />},
    {path: "/layouts", element: <Layout />},
    {path: "/profile", element: <Profile />, loader: userDataLoader},
    {path: "/items", element: <Items />},
    {path: "/inventory", element: <Inventory />},
    {path: "/order", element: <Order />},
    {path: "/order/:id", element: <SpecificOrder />},
    {path: "/statistics", element: <Statistics />},    
  ]},
]);

function App () {

  const [userIsLoggedIn, setUserIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token === null) {
      setUserIsLoggedIn(false);
    } else {
      setUserIsLoggedIn(true);
    }

  }, []);


  return (
    <Fragment>
      <RouterProvider router={router} />
      <ToastContainer />
    </Fragment>
  );
}

export default App;
