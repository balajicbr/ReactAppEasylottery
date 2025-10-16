import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { isAuthenticatedUser } from "../redux/user/userActions";

const UnPrivateRoute = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.loggedIn);
  const location = useLocation();

  // On mount (or location change), check session from backend
/*   useEffect(() => {
    if(!isAuthenticated){
    dispatch(isAuthenticatedUser());
    }
    
  }, [dispatch,isAuthenticated]); */

  if (isAuthenticated) {
    // If already logged in, redirect to dashboard/home
    return <Navigate to="/home" state={{ from: location }} replace />;
  }

  // Otherwise, allow access to public routes (e.g., Login, Signup)
  return <Outlet />;
};

export default UnPrivateRoute;
