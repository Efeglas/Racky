import { Fragment, useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Login from "./pages/Login";
import Root from "./pages/Root";
import ErrorPage from "./pages/ErrorPage";
import PrivateRoute from "./pages/PrivateRoute";
import Search from "./pages/Search";

const router = createBrowserRouter([
  {path: "/login", element: <Login />},
  {path: "/", element: <PrivateRoute to='/login'><Root /></PrivateRoute>, errorElement: <ErrorPage />, children: [
    {path: "/", element: <Search />}, 
  ]},
]);

function App () {

  const [userIsLoggedIn, setUserIsLoggedIn] = useState(false);

  useEffect(async () => {
    const token = localStorage.getItem('token');
    if (token === null) {
      setUserIsLoggedIn(false);
    } else {
      setUserIsLoggedIn(true);
    }

    const response = await fetch("http://192.168.50.62:8080/user/test", {
              method: "GET",
              headers: {
                  'Content-Type': 'application/json',
              },            
          });
          const json = await response.json();
          console.log(json); 
  }, []);


  return (
    <Fragment>
      <RouterProvider router={router} />
    </Fragment>
  );
}

export default App;
