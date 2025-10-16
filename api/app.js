const express = require('express');
const cors = require("cors");
const bodyParser = require('body-parser'); 
const session = require('express-session');
const cookieParser = require("cookie-parser");
const axios = require('axios');
const pg = require('pg');
const pgSession = require('connect-pg-simple')(session);

const app = express();
const root = express();
const contextPath = '/authn';  
root.use(contextPath, app);

// DB CONNECTION 
const pgPool = new pg.Pool({
  user: "postgres",
  password: "axxonet",
  host: "localhost",
  port: 5434,
  database: "easyLottery"
});

pgPool.connect((err, client, release) => {
  if (err) {
    console.error("Error connecting to database:", err.stack);
  } else {
    console.log("Database connected successfully!");
  }
  release();
});

// MIDDLEWARE 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "http://localhost:8080", 
    credentials: true,
  })
);

app.use(cookieParser("secretcode"));

app.use(session({
  store: new pgSession({
    pool: pgPool,
    pruneSessionInterval: true,
    disableTouch: true
  }),
  secret: 'secretcodemydev',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1200000 } // 20 minutes
}));

// HELPERS 
const getUserAxios = async (requestData) => {
  try {
    const response = await axios.post(
      //"https://api.easylotto.in/OTP",
      "https://api.easylotto.in/reactDummy",
      requestData,
      {
        withCredentials: true,
        timeout: 10000,
      }
    );
    return { status: response.status, data: response.data };
  } catch (error) {
    if (error.response) {
      return { status: error.response.status, data: error.response.data };
    }
    return { status: 500, data: { error: "Login API failed" } };
  }
};

const redirectHome = (req, res, next) => {
  console.log("in middleware =>", req.session);

  if (req.session.userId) {
    console.log("Has Session =>", req.session.userId);
    return res.status(200).json({
      isAuthenticated: true,
      alreadyLoggedIn: true,
      sessionId: req.session.id
    });
  }
  next();
};

// ROUTES 

// app.post("/api/login", async (req, res) => {
//   try {
//     const response = await axios.post("https://api.easylotto.in/login", req.body, {
//       headers: { "Content-Type": "application/json" },
//     });
//     res.status(response.status).json(response.data);
//   } catch (err) {
//     res.status(err.response?.status || 500).json(err.response?.data || { error: "Login API failed" });
//   }
// });

app.post("/api/otp", async (req, res) => {
  try {
    const response = await axios.post("https://api.easylotto.in/OTP", req.body, {
      headers: { "Content-Type": "application/json" },
    });
    res.status(response.status).json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { error: "OTP API failed" });
  }
});

// Signup route
app.post("/signup", async (req, res) => {
  console.log("new signup req =>", req.body);

  try {
    // STEP 1: Call OTP
    const otpResult = await getUserAxios(req.body);
    console.log("OTP API result =>", otpResult);

    if (otpResult.status !== 200 || otpResult.data.error) {
      return res.status(otpResult.status).json(
        otpResult.data || { error: "OTP verification failed" }
      );
    }

    // STEP 2: Build signup payload
    const signupPayload = {
      loginId: req.body.phoneno,
      applicationId: "b2b10a31-7370-4696-8706-7c5e0bc356f0",
      type: "EASY-LOTTO",
      phoneNumber: req.body.phoneno,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      stateid: 17,
      is18: true,
      isAuthorisedState: true,
      reg_terms: true,
      referal_code: "",
      device_info: req.body.device_info,
      device_name: "web",
      type1: "signUp",
      link: "",
      linkid: "",
      version: "",
    };

    console.log("signup payload =>", signupPayload);

    // STEP 3: Call signup API
    const signupRes = await axios.post(
      "https://api.easylotto.in/reactDummy",
      signupPayload,
      { withCredentials: true, validateStatus: () => true }
    );

    if (signupRes.status === 200) {
      // STEP 4: Save session
      req.session.userId = signupRes.data;
      return res.status(200).json({
        isAuthenticated: true,
        sessionId: req.session.id,
        ...signupRes.data,
      });
    } else {
      return res.status(signupRes.status).json(
        signupRes.data || { error: "Signup failed" }
      );
    }
  } catch (err) {
    console.error("Error in /signup:", err.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});



// Login with session
app.post("/login", redirectHome, async (req, res) => {
  console.log("new login req =>", req.body);
const dummyPayload = {
      phoneno: "8431309476",
      formstep: "1",
      type: "EASY-LOTTO",
    };
  try {
    // const result = await getUserAxios(req.body);
    const result = await axios.post(
      "https://api.easylotto.in/reactDummy",
      dummyPayload,
      { withCredentials: true, validateStatus: () => true }
    );
    console.log("Login API result =>", result);

    if (result.status === 200 && !result.data.error) {
      req.session.userId = result.data;
      return res.status(200).json({
        isAuthenticated: true,
        sessionId: req.session.id,
        ...result.data
      });
    } else {
      return res.status(result.status).json(result.data);
    }
  } catch (err) {
    console.error("Error in /login:", err);
    return res.status(500).json({
      isAuthenticated: false,
      error: "Server error",
    });
  }
});

// Login Authentication proxy
app.post("/loginAuthentication", async (req, res) => {

  try {
    //const response = await axios.post("https://api.easylotto.in/login", req.body, {
    const response = await axios.post("https://api.easylotto.in/reactDummy", req.body, {
      headers: { "Content-Type": "application/json" },
      timeout: 10000,
    });

    console.log("LoginAuthentication response =>", response.status, response.data);

    if (response.status === 200) {
      return res.status(200).json({
        success: true,
        user: response.data,
        sessionId: req.session.id,
        message: "Login success",
      });
    } else if (response.status === 330) {
      return res.status(330).json({
        success: false,
        message: "Your account has been deleted. Please contact administrator.",
      });
    } else if (response.status === 310) {
      return res.status(310).json({
        success: false,
        message: "Mobile number is changed. Use the new one.",
      });
    } else if (response.status === 404) {
      return res.status(404).json({
        success: false,
        message: "This mobile number is not registered yet! Please Sign up!",
      });
    } else {
      return res.status(response.status).json({
        success: false,
        message: "Unknown error from Login API",
      });
    }
  } catch (error) {
    console.error("Error in /loginAuthentication =>", error.message);

    if (error.response) {
      return res
        .status(error.response.status)
        .json(error.response.data || { message: "External API error" });
    }

    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// Home
app.get('/home', redirectHome, (req, res) => {
  console.log("home session =>", req.session);
  const { userId } = req.session;
  if (userId) {
    console.log("in home myuser =>", userId);
  }
  return res.status(201).json({ inhome: true });
});

// Logout
app.get('/mylogout', (req, res) => {
  console.log("logout session before cleared =>", req.session);

  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      return res.status(500).json({ logout: false, error: "Logout failed" });
    }

    res.clearCookie('connect.sid');
    console.log("logout session cleared");
    return res.status(200).json({ isAuthenticated: false, logout: true });
  });
});

// Auth check
app.get('/isauthenticated', (req, res) => {
  console.log("Inside isauthenticated");

  if (req.session.userId) {
    console.log("Inside has authentication");
    return res.status(200).json({
      isAuthenticated: true,
      user: req.session.userId
    });
  }

  console.log("Inside no session authentication");
  return res.status(200).json({
    isAuthenticated: false
  });
});

// ROOT SERVER 
root.listen(9080, () => {
  console.log(`ElUser01 listening at http://localhost:9080`);
});
