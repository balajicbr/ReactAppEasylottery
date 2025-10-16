import { AUTHENTICATED, NOT_AUTHENTICATED,SIGNUP_SUCCESS } from "./userTypes";
import axios from "axios";


/* 
const setToken = (token) => {
  localStorage.setItem("token", token);
  localStorage.setItem("lastLoginTime", new Date(Date.now()).getTime());
};

const getToken = () => {
  const now = new Date(Date.now()).getTime();
  const thirtyMinutes = 1000 * 60 * 30;
  const timeSinceLastLogin = now - localStorage.getItem("lastLoginTime");
  if (timeSinceLastLogin < thirtyMinutes) {
    return localStorage.getItem("token");
  }
}; */

export const checkAuth = () => {
  return (dispatch) => {
    return fetch("http://localhost:3001/current_user", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      /*   Authorization: getToken() */
      }
    }).then((res) => {
      if (res.ok) {
        return res
          .json()
          .then((user) => dispatch({ type: AUTHENTICATED, payload: user }));
      } else {
        return Promise.reject(dispatch({ type: NOT_AUTHENTICATED }));
      }
    });
  };
};

export const logoutUser = () => {
  return (dispatch) => {
    return axios.get("http://localhost:9080/authn/mylogout", {
      withCredentials: true
    })
    .then((res) => {
      console.log("getlogout => ", res.data);
      dispatch({ type: NOT_AUTHENTICATED });
    })
    .catch((err) => {
      console.error("Logout error =>", err.message);
      dispatch({ type: NOT_AUTHENTICATED });
    });
  };
};

//new

export const loginUser = (requestData) => async (dispatch) => {
  try {
    const res = await axios.post("http://localhost:9080/authn/login", requestData, {
      withCredentials: true,
      validateStatus: () => true,
    });
console.log("inside loginUser action => " , res.data);


    // Return full response (status + data)
    return { status: res.status, data: res.data };
  } catch (err) {
    if (err.response) {
      // return real error status + data
      return { status: err.response.status, data: err.response.data };
    }
    return { status: 500, data: { error: "Network/Server error" } };
  }
};

export const loginAuthentication = (credentials) => async (dispatch) => {
  try {
    dispatch({ type: "USER_LOGIN_REQUEST", payload: res.data });

    const { data } = await axios.post(
      "http://localhost:9080/authn/loginAuthentication",
      credentials,
      { withCredentials: true }
    );

    if (data.success) {
      dispatch({
        type: "USER_LOGIN_SUCCESS",
        payload: data.user,   // 🔹 store user object
      });
    } else {
      dispatch({
        type: "USER_LOGIN_FAIL",
        payload: data.message || "Login failed",
      });
    }
  } catch (error) {
    dispatch({
      type: "USER_LOGIN_FAIL",
      payload:
        error.response?.data?.message || error.message || "Server error",
    });
  }
};


export const isAuthenticatedUser = () => {
  return (dispatch) => {
    // console.log("Inside isAuthenticatedUser userAction");
    axios.get("http://localhost:9080/authn/isauthenticated", {
      withCredentials: true
    })
    .then((res) => {
      console.log("getAuthenticated => ", res.data);

      if (res.data.isAuthenticated) {
        dispatch({ type: AUTHENTICATED, payload: res.data });
      } else {
        dispatch({ type: NOT_AUTHENTICATED });
      }
    })
    .catch((error) => {
      console.log("error => ", error.message);
      dispatch({ type: NOT_AUTHENTICATED });
    });
  };
};