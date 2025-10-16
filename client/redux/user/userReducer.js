// import { AUTHENTICATED, NOT_AUTHENTICATED,IS_AUTHENTICATED,SIGNUP_SUCCESS } from "./userTypes";



// const initialState = {
//   authChecked: false,
//   loggedIn: false,
//   refreshToken: '',
//   currentUser: {},
//   user: null,      // ensure this exists
//   error: null // so it’s never undefined
//   };

// const userReducer = (state = initialState, action) => {
//     switch (action.type) {
//     case AUTHENTICATED:
//       return {
//         ...state,
//         loggedIn: true, 
//         isAuthenticated: true,
//         user: action.payload,
//         refreshToken: action.payload.refreshToken || '', // store refreshToken from API response
//         error: null,
//       };
//     case NOT_AUTHENTICATED:
//       return {
//         ...state,
//         loggedIn: false, 
//         isAuthenticated: false,
//         user: null,
//         error: action.payload,
//         refreshToken: '',
//       };
//       case "LOGIN_SUCCESS":
//   return {
//     ...state,
//     loggedIn: true,
//     isAuthenticated: true,
//     user: action.payload,                     // store full loginAuthentication response
//     refreshToken: action.payload?.refreshToken || state.refreshToken || '',
//     error: null,
//   };
//     default:
//       return state;
//   }
// }

// export default userReducer

import { ChartNoAxesColumnDecreasing } from "lucide-react";
import { AUTHENTICATED, NOT_AUTHENTICATED, LOGIN_SUCCESS, LOGIN_FAIL } from "./userTypes";

const initialState = {
  authChecked: false,
   isAuthenticated: false,
  loggedIn: false,
  refreshToken: "",
  user: null,   //  this will hold the loginAuthentication response
  error: null
};

const userReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case AUTHENTICATED:
      // console.log("AUTHENTICATED reducer payload => " , payload);
      return {       
        loggedIn: true,
        authChecked: true,
        isAuthenticated: true,
        error: null,
        ...state
      };

    case NOT_AUTHENTICATED:
      return {
        loggedIn: false,
        isAuthenticated: false,
        error: payload
      };

    case LOGIN_SUCCESS:
      console.log("login Success reducer payload => " , payload);
      return {
        loggedIn: true,
        isAuthenticated: true,
        user: payload, // full loginAuthentication response
        refreshToken: payload?.refreshToken || "",
        error: null
      };

    case LOGIN_FAIL:
      return {
        loggedIn: false,
        isAuthenticated: false,
        user: null,
        error: payload,
        refreshToken: ""
      };

    default:
      return state;
  }
};

export default userReducer;
