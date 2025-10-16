// // import React, { useEffect } from "react";
// import { Navigate, Outlet, useLocation } from "react-router-dom";
// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";  
// import { isAuthenticatedUser } from "../redux/user/userActions";

// const PrivateRoute = () => {
  
//    const dispatch = useDispatch();
//   const isAuthenticated = useSelector((state) => state.auth.loggedIn);
//   const location = useLocation();

//   // On mount (or location change), check session from backend
//   useEffect(() => {
//     dispatch(isAuthenticatedUser());
//   }, [dispatch, location]);


//   if (!isAuthenticated) {
//     console.log("Not authenticated");
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }

//   console.log("Authenticated user => " + isAuthenticated);
//   return <Outlet />;
// };

// export default PrivateRoute;

import React, { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";  
import { isAuthenticatedUser } from "../redux/user/userActions";
import Header from "../comp/Header/Header"; // adjust path
import Navbar from "../comp/NavBar/Navbar";

const PrivateRoute = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.loggedIn);
  const location = useLocation();

  // On mount (or location change), check session from backend
  useEffect(() => {
    dispatch(isAuthenticatedUser());
  }, [dispatch, location]);

  if (!isAuthenticated) {
    console.log("Not authenticated");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  console.log("Authenticated user => " + isAuthenticated);
return (
  <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
    <div style={{position: 'sticky', top: 0,zIndex: 1000,background: 'white',}}>
      <Header />
    </div>

    <div style={{ flex: 1, overflowY: 'auto' }}>
      <Outlet />
    </div>

    <div style={{position: 'sticky',bottom: 0,zIndex: 1000,background: 'white',}}>
      <Navbar />
    </div>
  </div>
);

  // return (
  //   <>
  //   <Header />
  //     <div className="private-content">
  //       <Outlet />
  //     </div>
  //     <Navbar /> {/* always displayed at bottom */}
  //   </>
  // );
};

export default PrivateRoute;

