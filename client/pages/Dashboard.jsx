
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux"; 
import "./Dashboard.css";
import { FaYoutube } from "react-icons/fa"; 
import axios from "axios";
import credit from "../assets/credit.png";
import ticket from "../assets/ticket.png";
import Refer from "../assets/Refer.jpg";
import Im_WinBg_ from "../assets/Im_WinBg_1.jpg";
import addCredits from "../assets/addCredits.png";
import buytickets from "../assets/buyticket.png";
import PrizeDetails from "../comp/PrizeDetails/PrizeDetails";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import CountdownTimer from "../comp/CountdownTimer/CountdownTimer";
import AlertPopup from "../comp/AlertPopup/AlertPopup";
import TotalWinbg from "../assets/TotalwinBg.png";
import "swiper/css";
import "swiper/css/pagination";
import coupon from "../assets/coupon.png";


export default function Dashboard() {
const navigate = useNavigate();
const user = useSelector((state) => state.auth.user.user);
const firstName = user?.user_name;
const refreshToken = user?.refreshToken;
const [schemeDetails, setSchemeDetails] = useState(null);
const [winningData, setWinningData] = useState(null);
const [latestSchemeDetails, setLatestSchemeDetails] = useState([]);
const [selectedScheme, setSelectedScheme] = useState("All");

const [showPrizes, setShowPrizes] = useState(false);
const [selectedId, setSelectedId] = useState(null);
const [alertMessage, setAlertMessage] = useState("");
const [credits, setCredits] = useState("");
const [activeTickets, setactiveTickets] = useState("");
const [showAlert, setShowAlert] = useState(false);
const [timeLeft, setTimeLeft] = useState();
const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
const [highlights, setHighlights] = useState("");



//Scheme Details
  useEffect(() => {
    const fetchSchemeDetails = async () => {
      try {
        const requestData = {
          refreshToken,
          formstep: "4",
          isd: "en",
          date: new Date().toISOString(),          
        };

        const response = await axios.post(
          "https://api.easylotto.in/GetSchemeDetails",
          requestData
        );

       // setSchemeDetails(response.data);

      } catch (error) {
        console.error("Error fetching scheme details:", error);
      }
    };
    if (refreshToken) {
      fetchSchemeDetails();
    }
  }, [refreshToken]);
  const handleLiveResults = () => {
    window.open(
      "https://www.youtube.com/@EasyLotteryofficial/streams",
      "_blank"
    );
  };

//winning Details
useEffect(() => {
  const fetchWinningAmount = async () => {
    try {
      const requestData = {
        refreshToken,
        formstep: "getWinningAmount",
        id: "en"
      };

      const response = await axios.post(
        "https://api.easylotto.in/transaction",
        requestData
      ); 
        setWinningData(response.data); // store it in state
    } catch (error) {
      console.error("Error fetching winning amount:", error);
    }
  };
  if (refreshToken) {
    fetchWinningAmount();
    fetchdetails();
  }
}, [refreshToken]);

//Latest schemes
useEffect(() => {
  const fetchLatestSchemes = async () => {
    try {
      const requestData = {
        refreshToken,
        formstep: "getfeaturedscheme"
      };

      const response = await axios.post(
        "https://api.easylotto.in/GetSchemeDetails",
        requestData
      );

     setLatestSchemeDetails(response.data);
        // console.log("RESp",LatestSchemeDetails);

    } catch (error) {
      console.error("Error fetching schemes:", error);
    }
  };

  fetchLatestSchemes();
}, [refreshToken]);

  // filter logic
  const filteredSchemes =
    selectedScheme === "All"
      ? schemeDetails
      : schemeDetails.filter((item) => item.json.scheme_name === selectedScheme);
// console.log("Filtered scheme is",filteredSchemes);

const handleBuyNow = (scheme) => {
  // 1. Closed check
  if (scheme.json.closed === "0") {
    console.log("closed =0",scheme.json.closed);
    setAlertMessage(
      `${scheme.json.subname} is no longer available for purchase as of ${scheme.json.close_date}.`
      
    );
    setShowAlert(true);
    return;
  }

  // 2. Sold out check
  if (scheme.json.available === "0") {
    console.log("available =0",scheme.json.available);
    setAlertMessage(`${scheme.json.subname} is sold out, no tickets left.`);
    setShowAlert(true);
    return;
  }

  // 3. Blocked schemes check
  if (scheme.json.id === "E00268" || scheme.json.id === "E00271") {
    setAlertMessage(`${scheme.json.subname} is Closed & no loger available for purchase.`);
    setShowAlert(true);
    console.log("scheme closed");
    return; // silently terminate
  }
    if (scheme.json.closed === "0") {
    setAlertMessage(`${scheme.json.subname} is Closed & no loger available for purchase.`);
    setShowAlert(true);
    console.log("scheme closed");
    return; // silently terminate
  }

  // 4. Balance check
  if (parseInt(scheme.json.credits) < parseInt(scheme.json.amount)) {
    console.log("credits =0",scheme.json.credits);
    console.log("amount =0",scheme.json.amount);
    setAlertMessage("Insufficient balance.");
    setShowAlert(true);

   //navigate("/addCredits", { state: { id: scheme.json.id } });
    return;
  }

  // 5. Default: proceed to BuyTickets
 navigate("/buytickets", {
    state: {
      id: scheme.json.id,
      imagename: scheme.json.image_url,
      subname: scheme.json.subname,
    },
  });
};
  const fetchdetails = async (schemeId, fromDate = "", toDate = "") => {
    try {
      const requestData = {
        refreshToken: refreshToken,
        formstep: "4",
        ids: "en",
        id: "3",
        date:  new Date().toISOString(),
        amount: "0",
        price: "0",
        sort: "1",
      };

      const response = await axios.post(
        "https://api.easylotto.in/myticket",
        requestData,
        {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
            "lang-policies-mode": "max-age=0",
          },
        },
      );

      if (response.data) {
      setCredits(response.data[0].json.credits);
      setactiveTickets(response.data[0].json.lefttickets);
      setSchemeDetails(response.data);
      console.log("Details response:", response.data);
      }
    } catch (error) {
      console.error("Error fetching details:", error);
    } finally {

    }
  };


  return (
    <div className="dashboard-container">
      {/* Background Gradient */}
      <div className="dashboard-bg-gradient">
        <svg width="412" height="494" viewBox="0 0 412 494" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clipPath="url(#clip0_522_8165)">
            <g opacity="0.2" filter="url(#filter0_f_522_8165)">
              <ellipse cx="203.5" cy="211.5" rx="330.5" ry="419.5" fill="#CEB0FF"/>
            </g>
            <g style={{mixBlendMode:"darken"}} filter="url(#filter1_f_522_8165)">
              <path d="M203.247 373C392.265 373 545.494 452.652 545.494 550.907C545.494 649.163 392.265 728.815 203.247 728.815C14.2292 728.815 -139 649.163 -139 550.907C-139 452.652 14.2294 373 203.247 373Z" fill="#D2BAFF"/>
            </g>
            <path d="M544.267 550.907C544.267 605.807 600.45 743.836 525.263 776.471C465.884 802.244 266.899 776.471 183.493 776.471C108.457 776.471 -50.8991 786.395 -107.308 765.109C-192.995 732.775 -142.317 618.071 -140.227 550.907C-140.227 452.652 13.0019 373 202.02 373C391.038 373 544.267 452.652 544.267 550.907Z" fill="white"/>
          </g>
          <defs>
            <filter id="filter0_f_522_8165" x="-357.7" y="-438.7" width="1122.4" height="1300.4" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feFlood floodOpacity="0" result="BackgroundImageFix"/>
              <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
              <feGaussianBlur stdDeviation="115.35" result="effect1_foregroundBlur_522_8165"/>
            </filter>
            <filter id="filter1_f_522_8165" x="-147.3" y="364.7" width="701.094" height="372.415" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feFlood floodOpacity="0" result="BackgroundImageFix"/>
              <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
              <feGaussianBlur stdDeviation="4.15" result="effect1_foregroundBlur_522_8165"/>
            </filter>
            <clipPath id="clip0_522_8165">
              <rect width="412" height="587" fill="white" transform="translate(0 -93)"/>
            </clipPath>
          </defs>
        </svg>
      </div>

      {/* Main Content */}
      <div className="dashboard-content">
        {/* User Greeting and Live Results */}
        <div className="greeting-section">
          <div className="greeting-content">
            <h1 className="greeting-text">Hi, {firstName}</h1>
            <button onClick={handleLiveResults} className="live-results-btn" >
              <FaYoutube  className="text-xl" color="#ffffff" />
              <span>View Live Results</span>
            </button>
          </div>
        </div>
        {/* <div id ="first-add-credits" onClick={() => navigate("/AddCredits")}>
          <img src= {addCredits} alt="first add credit" />
        </div>
        <div id ="first-buy-tickets" onClick={() => navigate("/AddCredits")}>
          <img src= {buytickets} alt="first add credit" />
        </div> */}

        {/* Conditional divs based on schemeDetails[0].credit_visible */}
  {schemeDetails?.length > 0 && (
    <>    
      {schemeDetails[0].json.credit_visible === 0 && (
        <div className="conditional-section" onClick={() => navigate("/AddCredits")}>
          <img src={addCredits} alt="Add Credits" className="w-full rounded-xl" />
        </div>
      )}
      {schemeDetails[0].json.credit_visible === 1 && (
        <div className="conditional-section" onClick={() => navigate("/buytickets")}>
          <img
            src={buytickets}
            alt="Buy Your Ticket"
            className="w-full rounded-xl"
          />
        </div>
      )}
      {schemeDetails[0].json.credit_visible === 2 && (
        <div className="stats-section">
          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-value">₹ {credits}</div>
              <div className="stat-label">Available Credits</div>
            </div>
            <div className="stat-icon">
              <img src={credit} alt="Credit" />
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-value">{activeTickets}</div>
              <div className="stat-label">Active Tickets</div>
            </div>
            <div className="stat-icon">
              <img src={ticket} alt="Ticket" />
            </div>
          </div>
        </div>
      )}
    </>
  )}

        {/* Promotional Banner */}
<div className="promo-carousel">
  <Swiper
    modules={[Pagination, Autoplay]}
    spaceBetween={16}
    slidesPerView={1}
    pagination={{ clickable: true }}
    autoplay={{ delay: 3000, disableOnInteraction: false }}
    loop={true}
  >
    <SwiperSlide>
      <img src="https://app.easylottery.in/img/4/cpn/C1.jpg" alt="Coupon Offer" className="promo-slide-img" />
    </SwiperSlide>
    <SwiperSlide>
      <img src="https://app.easylottery.in/img/4/cpn/C2.jpg" alt="Buy Ticket" className="promo-slide-img" />
    </SwiperSlide>
    <SwiperSlide>
      <img src="https://app.easylottery.in/img/4/cpn/C3.jpg" alt="Refer & Earn" className="promo-slide-img" />
    </SwiperSlide>
  </Swiper>
</div>

        {/* Winning Announcement */}
        {winningData?.length > 0 && winningData[0]?.status === 1 && (
          
        // <div className="winning-section"  style={{  backgroundImage: `url(${TotalWin})`, backgroundSize: "contain", backgroundPosition: "center"}} >
        //   <div className="winning-content">
        //     {/* <div className="winning-text">You have Won</div> */}
        //     <div className="winning-amount">₹{winningData[0].win_amount}</div>           
        //   </div>
        // </div>
        <div className="winning-section" style={{  backgroundImage: `url(${TotalWinbg})`,  backgroundSize: "cover", backgroundPosition: "center bottom" , backgroundRepeat:"no-repeat"}}>
          <svg width="224" height="100" viewBox="0 0 224 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M79.5535 134.527C79.5535 134.527 65.5003 118.556 52.693 121.652L-28.8004 141.355C-29.9884 141.642 -31.1837 140.912 -31.4703 139.724C-31.7568 138.536 -31.0272 137.341 -29.8392 137.054L51.6543 117.352C64.4616 114.255 69.6665 93.6282 69.6665 93.6282L79.5535 134.527Z" fill="#78A9EF"/>
            <path d="M76.8026 123.115C72.9904 119.991 67.4124 119.198 62.6701 120.201C67.4146 121.164 72.156 121.769 76.8026 123.115Z" fill="white"/>
            <path d="M72.4141 105.046C68.8956 108.367 64.9557 111.07 61.174 114.095C65.8495 112.821 70.4517 109.566 72.4141 105.046Z" fill="white"/>
            <path d="M74.2031 114.186C68.9973 114.457 63.991 115.66 59.2384 117.804C64.4451 117.541 69.4479 116.324 74.2031 114.186Z" fill="white"/>
            <path d="M91.3815 102.347C103.989 99.6457 115.594 92.6557 123.811 82.6737C125.348 80.8059 126.595 78.9955 127.556 77.2278C135.858 73.1784 141.93 66.3731 144.02 58.6386C146.685 48.775 142.125 38.0352 133.639 34.1887L132.482 36.7426C139.631 39.9826 143.593 49.4776 141.314 57.9075C139.692 63.9127 135.353 69.3144 129.322 73.0575C129.736 71.6691 129.965 70.2996 130.011 68.9452C130.189 63.8009 126.856 57.6849 121.16 56.7741C117.545 56.1952 113.69 57.8667 111.338 61.0318C109.294 63.78 108.44 67.5292 108.994 71.3191C109.367 73.8853 110.348 75.9942 111.828 77.4194C114.375 79.868 118.415 80.4223 123.1 79.0204C122.653 79.6353 122.17 80.2595 121.647 80.8932C112.745 91.7067 99.6642 98.8338 85.7509 100.437L86.0737 103.223C87.8562 103.014 89.6287 102.723 91.3815 102.347ZM125.506 75.0948C125.053 75.3005 124.593 75.4983 124.127 75.6875C121.999 76.5457 116.729 78.2414 113.771 75.3972C112.473 74.1497 111.965 72.27 111.768 70.9131C111.321 67.8527 111.983 64.8605 113.588 62.7031C115.299 60.4028 118.168 59.1343 120.716 59.5416C124.902 60.2105 127.345 64.892 127.21 68.8461C127.14 70.853 126.577 72.9228 125.506 75.0948Z" fill="#FCC145"/>
            <path d="M215.917 88.1716C208.662 75.5256 196.374 66.7945 183.048 64.8151C175.761 63.7349 167.416 65.8606 162.286 70.0892C160.12 71.8763 158.545 73.9777 157.6 76.3142C155.84 76.2986 154.128 76.4989 152.534 76.9311C146.085 78.6907 142.802 83.1149 141.583 87.9189C135.349 87.3186 127.406 89.9693 123.082 94.5031L124.922 95.9054C128.63 92.0212 135.772 89.7356 141.136 90.3823C140.983 91.7401 140.975 93.0975 141.09 94.4038C141.754 101.958 146.521 109.21 153.066 107.753C156.524 106.976 157.576 104.908 157.896 103.743C159.221 98.9251 153.345 91.9316 145.322 88.7746C144.925 88.6193 144.513 88.4832 144.087 88.368C144.885 84.8447 147.097 80.8266 152.812 79.2703C154.138 78.9087 155.498 78.732 156.866 78.7139C156.63 79.8262 156.523 80.9804 156.549 82.1683C156.721 90.3949 161.156 99.6229 169.296 101.343C171.736 101.858 174.309 101.15 176.351 99.4199C178.586 97.5207 179.712 94.7668 179.36 92.0567C178.265 83.626 169.043 77.5575 160.176 76.4836C160.944 74.7183 162.165 73.1403 163.832 71.7657C168.282 68.0956 175.647 66.2655 182.149 67.2319C194.829 69.113 206.554 77.4819 213.516 89.6172L215.917 88.1716ZM159.437 78.8604C167.872 79.919 175.904 86.4679 176.726 92.7974C176.967 94.6668 176.238 96.5297 174.768 97.7772C173.503 98.8528 171.891 99.2799 170.342 98.9537C163.311 97.4688 159.356 88.9333 159.203 81.6564C159.182 80.6845 159.261 79.7537 159.437 78.8604ZM143.712 90.9812C143.778 91.0047 143.842 91.0305 143.907 91.055C151.34 93.9792 156.234 100.304 155.329 103.59C155.171 104.166 154.748 104.978 152.93 105.382C148.66 106.333 144.364 100.899 143.735 93.7516C143.68 93.1159 143.635 92.1389 143.712 90.9812Z" fill="#FFBA81"/>
            <path d="M165.022 123.752C161.186 115.65 152.016 110.439 143.1 111.24C142.969 111.108 142.834 110.977 142.697 110.852C140.14 108.524 136.57 107.158 131.786 106.67C126.593 106.142 121.291 106.686 116.459 108.241L117.316 110.911C121.786 109.473 126.692 108.972 131.504 109.461C134.884 109.804 137.526 110.615 139.523 111.929C137.578 112.54 135.967 113.5 134.777 114.773C132.385 117.327 131.948 121.181 133.751 123.736C134.93 125.403 136.909 126.284 139.186 126.153C141.747 126.005 144.134 124.57 145.266 122.497C146.628 119.992 146.483 116.741 145.067 113.96C152.284 114.012 159.386 118.397 162.489 124.949L165.022 123.752ZM141.948 114.219C143.352 116.194 144.04 118.922 142.805 121.154C142.138 122.379 140.619 123.264 139.025 123.355C137.737 123.429 136.648 122.98 136.042 122.119C134.898 120.502 135.559 118.045 136.824 116.688C138.203 115.213 140.219 114.529 141.948 114.219Z" fill="#FCC145"/>
          </svg>
          <svg width="76" height="76" viewBox="0 0 109 109" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M80.4881 81.9664C95.8495 67.4209 96.511 43.1766 81.9656 27.8151C67.4201 12.4537 43.1758 11.7922 27.8144 26.3376C12.4529 40.8831 11.7914 65.1274 26.3369 80.4889C40.8823 95.8503 65.1266 96.5118 80.4881 81.9664Z" fill="url(#paint0_linear_1871_25222)"/>
              <path d="M81.966 27.8145C80.0259 25.7656 77.9119 23.9809 75.6708 22.4562L62.9089 34.5402L63.3882 16.9716C60.7571 16.3206 58.017 15.9378 55.1964 15.8608C52.3758 15.7839 49.6189 16.0167 46.9562 16.5233L46.4768 34.0919L34.3927 21.3298C32.0718 22.73 29.8635 24.3968 27.8146 26.3369C25.7657 28.2769 23.981 30.391 22.4563 32.6321L34.5403 45.394L16.9716 44.9148C16.3205 47.546 15.9378 50.286 15.8609 53.1068C15.784 55.9274 16.0168 58.6842 16.5234 61.347L34.092 61.8263L21.3299 73.9105C22.7301 76.2314 24.3969 78.4396 26.337 80.4885C28.2771 82.5374 30.3911 84.3221 32.6322 85.8468L45.3941 73.7628L44.9148 91.3314C47.5459 91.9825 50.286 92.3653 53.1066 92.4422C55.9272 92.5192 58.6841 92.2864 61.347 91.7799L61.8263 74.2113L73.9103 86.9732C76.2312 85.573 78.4394 83.9062 80.4883 81.9661C82.5372 80.0261 84.322 77.912 85.8467 75.6709L73.7627 62.909L91.3313 63.3884C91.9823 60.7572 92.3651 58.0171 92.4419 55.1964C92.5189 52.3758 92.2861 49.6189 91.7795 46.9562L74.2109 46.4768L86.9728 34.3928C85.5729 32.0716 83.9061 29.8634 81.966 27.8145Z" fill="url(#paint1_linear_1871_25222)"/>
              <path d="M78.3217 79.6622C92.4139 66.3186 93.0207 44.0776 79.6771 29.9855C66.3336 15.8933 44.0926 15.2865 30.0004 28.6301C15.9083 41.9736 15.3015 64.2146 28.645 78.3068C41.9886 92.3989 64.2296 93.0057 78.3217 79.6622Z" fill="url(#paint2_linear_1871_25222)"/>
              <path d="M73.2129 74.2694C84.3245 63.748 84.803 46.211 74.2816 35.0993C63.7603 23.9877 46.2232 23.5092 35.1116 34.0306C23.9999 44.552 23.5215 62.089 34.0428 73.2006C44.5642 84.3123 62.1013 84.7908 73.2129 74.2694Z" fill="url(#paint3_linear_1871_25222)"/>
              <path d="M80.4872 81.966C95.8486 67.4205 96.5101 43.1762 81.9647 27.8147L26.3359 80.4885C40.8814 95.8499 65.1257 96.5114 80.4872 81.966Z" fill="url(#paint4_linear_1871_25222)"/>
              <path d="M87.5452 35.3574L51.5137 34.3743L36.3182 52.5921L45.3051 52.8373L43.0571 59.0936L51.5269 59.3247L55.2293 63.2348L68.6693 63.6015L69.3874 66.303L90.2956 66.8734C93.9049 56.5964 93.0154 45.0594 87.5452 35.3574Z" fill="url(#paint5_linear_1871_25222)"/>
              <path d="M55.5817 41.4306L53.0161 43.8599C51.7862 43.0513 50.432 42.503 49.0318 42.2176L52.8784 38.5753C53.8588 37.647 53.901 36.0995 52.9727 35.1191C52.0444 34.1387 50.4969 34.0965 49.5165 35.0248L38.865 45.1104L35.3145 48.4724C34.3341 49.4007 34.2919 50.9482 35.2202 51.9286C36.1485 52.909 37.696 52.9512 38.6764 52.0229L42.227 48.661C44.1741 46.8172 46.9647 46.4058 49.2899 47.3882L41.3799 54.878C40.3995 55.8064 40.3573 57.3539 41.2856 58.3343C42.214 59.3147 43.7614 59.3569 44.7418 58.4286L52.7553 50.8408C53.8005 53.2904 53.2809 56.2408 51.2367 58.1764L47.6862 61.5383C46.9681 62.2182 46.7305 63.2636 47.0838 64.1873C47.4371 65.1109 48.3119 65.7304 49.3004 65.7576L69.3873 66.3056C70.0622 66.324 70.6806 66.0672 71.135 65.6369C71.5894 65.2066 71.8796 64.6032 71.898 63.9283C71.9348 62.5787 70.8705 61.4547 69.5208 61.4178L55.276 61.0289C58.6796 57.213 59.0936 51.6094 56.4347 47.3566L58.9434 44.9812C59.9238 44.0528 59.966 42.5053 59.0377 41.5249C58.1093 40.5445 56.5622 40.5023 55.5817 41.4306Z" fill="#F8A836"/>
              <defs>
              <linearGradient id="paint0_linear_1871_25222" x1="26.2055" y1="53.3895" x2="91.5048" y2="55.171" gradientUnits="userSpaceOnUse">
              <stop stop-color="#FEE45A"/>
              <stop offset="1" stop-color="#FEA613"/>
              </linearGradient>
              <linearGradient id="paint1_linear_1871_25222" x1="-16.3869" y1="4.9045" x2="179.113" y2="141.394" gradientUnits="userSpaceOnUse">
              <stop stop-color="#FEA613" stop-opacity="0"/>
              <stop offset="1" stop-color="#E94444"/>
              </linearGradient>
              <linearGradient id="paint2_linear_1871_25222" x1="28.5246" y1="53.4466" x2="88.4281" y2="55.0811" gradientUnits="userSpaceOnUse">
              <stop stop-color="#FEE45A"/>
              <stop offset="1" stop-color="#FEA613"/>
              </linearGradient>
              <linearGradient id="paint3_linear_1871_25222" x1="82.8254" y1="54.932" x2="27.342" y2="53.4182" gradientUnits="userSpaceOnUse">
              <stop stop-color="#FEE45A"/>
              <stop offset="1" stop-color="#FEA613"/>
              </linearGradient>
              <linearGradient id="paint4_linear_1871_25222" x1="60.3362" y1="60.6845" x2="85.4861" y2="87.2454" gradientUnits="userSpaceOnUse">
              <stop stop-color="#FEA613" stop-opacity="0"/>
              <stop offset="1" stop-color="#E94444"/>
              </linearGradient>
              <linearGradient id="paint5_linear_1871_25222" x1="95.9608" y1="51.0805" x2="24.7" y2="49.7817" gradientUnits="userSpaceOnUse">
              <stop stop-color="#FEA613" stop-opacity="0"/>
              <stop offset="1" stop-color="#E94444"/>
              </linearGradient>
              </defs>
          </svg>
          <svg width="53" height="53" viewBox="0 0 70 1" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M29.3574 54.5839C44.0498 53.8233 55.3437 41.2961 54.5831 26.6037C53.8225 11.9113 41.2953 0.617388 26.6029 1.37801C11.9105 2.13864 0.616609 14.6658 1.37724 29.3582C2.13786 44.0506 14.665 55.3445 29.3574 54.5839Z" fill="url(#paint0_linear_1871_25233)"/>
          <path d="M54.5834 26.6033C54.4819 24.6437 54.1692 22.7452 53.6718 20.927L41.4658 21.5589L49.6499 12.4811C48.5518 10.949 47.2751 9.50963 45.8177 8.19568C44.3602 6.88173 42.7967 5.76043 41.1594 4.82646L32.9752 13.9042L32.3433 1.69802C30.4835 1.39108 28.5629 1.27606 26.6032 1.37751C24.6435 1.47896 22.7451 1.7917 20.9269 2.28905L21.5588 14.4951L12.4809 6.31101C10.9487 7.40907 9.50935 8.68583 8.19541 10.1434C6.88146 11.6008 5.76016 13.1643 4.82619 14.8017L13.904 22.9858L1.69775 23.6177C1.39081 25.4776 1.27579 27.3982 1.37724 29.3578C1.47869 31.3175 1.79143 33.2159 2.28878 35.0342L14.4949 34.4023L6.31073 43.48C7.40879 45.0122 8.68555 46.4515 10.143 47.7655C11.6004 49.0794 13.1639 50.2007 14.8013 51.1348L22.9854 42.0571L23.6173 54.2632C25.4772 54.5701 27.3978 54.6851 29.3574 54.5837C31.3171 54.4822 33.2155 54.1695 35.0338 53.6721L34.4019 41.466L43.4796 49.6502C45.0118 48.5521 46.4511 47.2753 47.7651 45.8178C49.079 44.3604 50.2003 42.7968 51.1343 41.1595L42.0565 32.9754L54.2626 32.3435C54.5698 30.4836 54.6848 28.563 54.5834 26.6033Z" fill="url(#paint1_linear_1871_25233)"/>
          <path d="M29.2519 52.3872C42.7303 51.6895 53.091 40.1974 52.3932 26.7191C51.6954 13.2407 40.2034 2.87998 26.725 3.57775C13.2467 4.27553 2.88597 15.7676 3.58375 29.2459C4.28152 42.7243 15.7736 53.085 29.2519 52.3872Z" fill="url(#paint2_linear_1871_25233)"/>
          <path d="M28.9856 47.2282C39.6132 46.678 47.7827 37.6165 47.2325 26.9888C46.6823 16.3612 37.6208 8.19175 26.9931 8.74194C16.3654 9.29214 8.19602 18.3536 8.74622 28.9813C9.29641 39.609 18.3579 47.7784 28.9856 47.2282Z" fill="url(#paint3_linear_1871_25233)"/>
          <path d="M29.363 54.583C44.0554 53.8224 55.3493 41.2952 54.5887 26.6028L1.38281 29.3573C2.14344 44.0497 14.6706 55.3436 29.363 54.583Z" fill="url(#paint4_linear_1871_25233)"/>
          <path d="M54.1284 33.112L35.5108 16.3271L19.2484 19.1054L23.892 23.2919L19.8787 25.5868L24.2551 29.5324L24.4487 33.2722L31.3932 39.5331L30.5536 41.2863L41.3569 51.0262C47.9055 47.2187 52.6427 40.7138 54.1284 33.112Z" fill="url(#paint5_linear_1871_25233)"/>
          <path d="M34.4814 21.8965L32.0275 22.0235C31.7419 21.0405 31.273 20.1392 30.6611 19.3561L34.3401 19.1657C35.2779 19.1171 35.9987 18.3175 35.9502 17.3798C35.9016 16.4421 35.1021 15.7212 34.1643 15.7698L23.9768 16.2972L20.5809 16.473C19.6432 16.5215 18.9223 17.3211 18.9709 18.2588C19.0194 19.1966 19.819 19.9174 20.7567 19.8689L24.1526 19.6931C26.015 19.5967 27.677 20.6387 28.4636 22.208L20.8981 22.5997C19.9604 22.6482 19.2395 23.4478 19.2881 24.3855C19.3366 25.3233 20.1362 26.0441 21.0739 25.9956L28.7383 25.5988C28.1855 27.3665 26.5789 28.6928 24.6236 28.794L21.2278 28.9698C20.541 29.0053 19.9434 29.4511 19.7133 30.0992C19.4834 30.7473 19.6665 31.47 20.1772 31.9305L30.5562 41.2878C30.9049 41.6021 31.3479 41.7454 31.7826 41.7229C32.2172 41.7004 32.6431 41.5122 32.9575 41.1635C33.5862 40.4661 33.5305 39.391 32.8332 38.7623L25.4729 32.1263C28.996 31.6441 31.7445 28.8665 32.2576 25.4165L34.657 25.2922C35.5948 25.2437 36.3156 24.4441 36.2671 23.5064C36.2185 22.5687 35.4191 21.8479 34.4814 21.8965Z" fill="#F8A836"/>
          <defs>
          <linearGradient id="paint0_linear_1871_25233" x1="13.5405" y1="14.9627" x2="47.281" y2="45.3816" gradientUnits="userSpaceOnUse">
          <stop stop-color="#FEE45A"/>
          <stop offset="1" stop-color="#FEA613"/>
          </linearGradient>
          <linearGradient id="paint1_linear_1871_25233" x1="12.8943" y1="-29.9134" x2="54.7057" y2="130.542" gradientUnits="userSpaceOnUse">
          <stop stop-color="#FEA613" stop-opacity="0"/>
          <stop offset="1" stop-color="#E94444"/>
          </linearGradient>
          <linearGradient id="paint2_linear_1871_25233" x1="14.742" y1="16.04" x2="45.6944" y2="43.9454" gradientUnits="userSpaceOnUse">
          <stop stop-color="#FEE45A"/>
          <stop offset="1" stop-color="#FEA613"/>
          </linearGradient>
          <linearGradient id="paint3_linear_1871_25233" x1="42.7997" y1="41.3374" x2="14.1312" y2="15.4912" gradientUnits="userSpaceOnUse">
          <stop stop-color="#FEE45A"/>
          <stop offset="1" stop-color="#FEA613"/>
          </linearGradient>
          <linearGradient id="paint4_linear_1871_25233" x1="28.3092" y1="34.2284" x2="29.6244" y2="59.6325" gradientUnits="userSpaceOnUse">
          <stop stop-color="#FEA613" stop-opacity="0"/>
          <stop offset="1" stop-color="#E94444"/>
          </linearGradient>
          <linearGradient id="paint5_linear_1871_25233" x1="51.483" y1="45.2287" x2="14.3708" y2="12.3742" gradientUnits="userSpaceOnUse">
          <stop stop-color="#FEA613" stop-opacity="0"/>
          <stop offset="1" stop-color="#E94444"/>
          </linearGradient>
          </defs>
          </svg>
          <svg width="35" height="35" viewBox="0 0 70 109" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M29.3574 54.5839C44.0498 53.8233 55.3437 41.2961 54.5831 26.6037C53.8225 11.9113 41.2953 0.617388 26.6029 1.37801C11.9105 2.13864 0.616609 14.6658 1.37724 29.3582C2.13786 44.0506 14.665 55.3445 29.3574 54.5839Z" fill="url(#paint0_linear_1871_25233)"/>
          <path d="M54.5834 26.6033C54.4819 24.6437 54.1692 22.7452 53.6718 20.927L41.4658 21.5589L49.6499 12.4811C48.5518 10.949 47.2751 9.50963 45.8177 8.19568C44.3602 6.88173 42.7967 5.76043 41.1594 4.82646L32.9752 13.9042L32.3433 1.69802C30.4835 1.39108 28.5629 1.27606 26.6032 1.37751C24.6435 1.47896 22.7451 1.7917 20.9269 2.28905L21.5588 14.4951L12.4809 6.31101C10.9487 7.40907 9.50935 8.68583 8.19541 10.1434C6.88146 11.6008 5.76016 13.1643 4.82619 14.8017L13.904 22.9858L1.69775 23.6177C1.39081 25.4776 1.27579 27.3982 1.37724 29.3578C1.47869 31.3175 1.79143 33.2159 2.28878 35.0342L14.4949 34.4023L6.31073 43.48C7.40879 45.0122 8.68555 46.4515 10.143 47.7655C11.6004 49.0794 13.1639 50.2007 14.8013 51.1348L22.9854 42.0571L23.6173 54.2632C25.4772 54.5701 27.3978 54.6851 29.3574 54.5837C31.3171 54.4822 33.2155 54.1695 35.0338 53.6721L34.4019 41.466L43.4796 49.6502C45.0118 48.5521 46.4511 47.2753 47.7651 45.8178C49.079 44.3604 50.2003 42.7968 51.1343 41.1595L42.0565 32.9754L54.2626 32.3435C54.5698 30.4836 54.6848 28.563 54.5834 26.6033Z" fill="url(#paint1_linear_1871_25233)"/>
          <path d="M29.2519 52.3872C42.7303 51.6895 53.091 40.1974 52.3932 26.7191C51.6954 13.2407 40.2034 2.87998 26.725 3.57775C13.2467 4.27553 2.88597 15.7676 3.58375 29.2459C4.28152 42.7243 15.7736 53.085 29.2519 52.3872Z" fill="url(#paint2_linear_1871_25233)"/>
          <path d="M28.9856 47.2282C39.6132 46.678 47.7827 37.6165 47.2325 26.9888C46.6823 16.3612 37.6208 8.19175 26.9931 8.74194C16.3654 9.29214 8.19602 18.3536 8.74622 28.9813C9.29641 39.609 18.3579 47.7784 28.9856 47.2282Z" fill="url(#paint3_linear_1871_25233)"/>
          <path d="M29.363 54.583C44.0554 53.8224 55.3493 41.2952 54.5887 26.6028L1.38281 29.3573C2.14344 44.0497 14.6706 55.3436 29.363 54.583Z" fill="url(#paint4_linear_1871_25233)"/>
          <path d="M54.1284 33.112L35.5108 16.3271L19.2484 19.1054L23.892 23.2919L19.8787 25.5868L24.2551 29.5324L24.4487 33.2722L31.3932 39.5331L30.5536 41.2863L41.3569 51.0262C47.9055 47.2187 52.6427 40.7138 54.1284 33.112Z" fill="url(#paint5_linear_1871_25233)"/>
          <path d="M34.4814 21.8965L32.0275 22.0235C31.7419 21.0405 31.273 20.1392 30.6611 19.3561L34.3401 19.1657C35.2779 19.1171 35.9987 18.3175 35.9502 17.3798C35.9016 16.4421 35.1021 15.7212 34.1643 15.7698L23.9768 16.2972L20.5809 16.473C19.6432 16.5215 18.9223 17.3211 18.9709 18.2588C19.0194 19.1966 19.819 19.9174 20.7567 19.8689L24.1526 19.6931C26.015 19.5967 27.677 20.6387 28.4636 22.208L20.8981 22.5997C19.9604 22.6482 19.2395 23.4478 19.2881 24.3855C19.3366 25.3233 20.1362 26.0441 21.0739 25.9956L28.7383 25.5988C28.1855 27.3665 26.5789 28.6928 24.6236 28.794L21.2278 28.9698C20.541 29.0053 19.9434 29.4511 19.7133 30.0992C19.4834 30.7473 19.6665 31.47 20.1772 31.9305L30.5562 41.2878C30.9049 41.6021 31.3479 41.7454 31.7826 41.7229C32.2172 41.7004 32.6431 41.5122 32.9575 41.1635C33.5862 40.4661 33.5305 39.391 32.8332 38.7623L25.4729 32.1263C28.996 31.6441 31.7445 28.8665 32.2576 25.4165L34.657 25.2922C35.5948 25.2437 36.3156 24.4441 36.2671 23.5064C36.2185 22.5687 35.4191 21.8479 34.4814 21.8965Z" fill="#F8A836"/>
          <defs>
          <linearGradient id="paint0_linear_1871_25233" x1="13.5405" y1="14.9627" x2="47.281" y2="45.3816" gradientUnits="userSpaceOnUse">
          <stop stop-color="#FEE45A"/>
          <stop offset="1" stop-color="#FEA613"/>
          </linearGradient>
          <linearGradient id="paint1_linear_1871_25233" x1="12.8943" y1="-29.9134" x2="54.7057" y2="130.542" gradientUnits="userSpaceOnUse">
          <stop stop-color="#FEA613" stop-opacity="0"/>
          <stop offset="1" stop-color="#E94444"/>
          </linearGradient>
          <linearGradient id="paint2_linear_1871_25233" x1="14.742" y1="16.04" x2="45.6944" y2="43.9454" gradientUnits="userSpaceOnUse">
          <stop stop-color="#FEE45A"/>
          <stop offset="1" stop-color="#FEA613"/>
          </linearGradient>
          <linearGradient id="paint3_linear_1871_25233" x1="42.7997" y1="41.3374" x2="14.1312" y2="15.4912" gradientUnits="userSpaceOnUse">
          <stop stop-color="#FEE45A"/>
          <stop offset="1" stop-color="#FEA613"/>
          </linearGradient>
          <linearGradient id="paint4_linear_1871_25233" x1="28.3092" y1="34.2284" x2="29.6244" y2="59.6325" gradientUnits="userSpaceOnUse">
          <stop stop-color="#FEA613" stop-opacity="0"/>
          <stop offset="1" stop-color="#E94444"/>
          </linearGradient>
          <linearGradient id="paint5_linear_1871_25233" x1="51.483" y1="45.2287" x2="14.3708" y2="12.3742" gradientUnits="userSpaceOnUse">
          <stop stop-color="#FEA613" stop-opacity="0"/>
          <stop offset="1" stop-color="#E94444"/>
          </linearGradient>
          </defs>
          </svg>
          <svg width="20" height="20" viewBox="0 0 70 1" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M29.3574 54.5839C44.0498 53.8233 55.3437 41.2961 54.5831 26.6037C53.8225 11.9113 41.2953 0.617388 26.6029 1.37801C11.9105 2.13864 0.616609 14.6658 1.37724 29.3582C2.13786 44.0506 14.665 55.3445 29.3574 54.5839Z" fill="url(#paint0_linear_1871_25233)"/>
          <path d="M54.5834 26.6033C54.4819 24.6437 54.1692 22.7452 53.6718 20.927L41.4658 21.5589L49.6499 12.4811C48.5518 10.949 47.2751 9.50963 45.8177 8.19568C44.3602 6.88173 42.7967 5.76043 41.1594 4.82646L32.9752 13.9042L32.3433 1.69802C30.4835 1.39108 28.5629 1.27606 26.6032 1.37751C24.6435 1.47896 22.7451 1.7917 20.9269 2.28905L21.5588 14.4951L12.4809 6.31101C10.9487 7.40907 9.50935 8.68583 8.19541 10.1434C6.88146 11.6008 5.76016 13.1643 4.82619 14.8017L13.904 22.9858L1.69775 23.6177C1.39081 25.4776 1.27579 27.3982 1.37724 29.3578C1.47869 31.3175 1.79143 33.2159 2.28878 35.0342L14.4949 34.4023L6.31073 43.48C7.40879 45.0122 8.68555 46.4515 10.143 47.7655C11.6004 49.0794 13.1639 50.2007 14.8013 51.1348L22.9854 42.0571L23.6173 54.2632C25.4772 54.5701 27.3978 54.6851 29.3574 54.5837C31.3171 54.4822 33.2155 54.1695 35.0338 53.6721L34.4019 41.466L43.4796 49.6502C45.0118 48.5521 46.4511 47.2753 47.7651 45.8178C49.079 44.3604 50.2003 42.7968 51.1343 41.1595L42.0565 32.9754L54.2626 32.3435C54.5698 30.4836 54.6848 28.563 54.5834 26.6033Z" fill="url(#paint1_linear_1871_25233)"/>
          <path d="M29.2519 52.3872C42.7303 51.6895 53.091 40.1974 52.3932 26.7191C51.6954 13.2407 40.2034 2.87998 26.725 3.57775C13.2467 4.27553 2.88597 15.7676 3.58375 29.2459C4.28152 42.7243 15.7736 53.085 29.2519 52.3872Z" fill="url(#paint2_linear_1871_25233)"/>
          <path d="M28.9856 47.2282C39.6132 46.678 47.7827 37.6165 47.2325 26.9888C46.6823 16.3612 37.6208 8.19175 26.9931 8.74194C16.3654 9.29214 8.19602 18.3536 8.74622 28.9813C9.29641 39.609 18.3579 47.7784 28.9856 47.2282Z" fill="url(#paint3_linear_1871_25233)"/>
          <path d="M29.363 54.583C44.0554 53.8224 55.3493 41.2952 54.5887 26.6028L1.38281 29.3573C2.14344 44.0497 14.6706 55.3436 29.363 54.583Z" fill="url(#paint4_linear_1871_25233)"/>
          <path d="M54.1284 33.112L35.5108 16.3271L19.2484 19.1054L23.892 23.2919L19.8787 25.5868L24.2551 29.5324L24.4487 33.2722L31.3932 39.5331L30.5536 41.2863L41.3569 51.0262C47.9055 47.2187 52.6427 40.7138 54.1284 33.112Z" fill="url(#paint5_linear_1871_25233)"/>
          <path d="M34.4814 21.8965L32.0275 22.0235C31.7419 21.0405 31.273 20.1392 30.6611 19.3561L34.3401 19.1657C35.2779 19.1171 35.9987 18.3175 35.9502 17.3798C35.9016 16.4421 35.1021 15.7212 34.1643 15.7698L23.9768 16.2972L20.5809 16.473C19.6432 16.5215 18.9223 17.3211 18.9709 18.2588C19.0194 19.1966 19.819 19.9174 20.7567 19.8689L24.1526 19.6931C26.015 19.5967 27.677 20.6387 28.4636 22.208L20.8981 22.5997C19.9604 22.6482 19.2395 23.4478 19.2881 24.3855C19.3366 25.3233 20.1362 26.0441 21.0739 25.9956L28.7383 25.5988C28.1855 27.3665 26.5789 28.6928 24.6236 28.794L21.2278 28.9698C20.541 29.0053 19.9434 29.4511 19.7133 30.0992C19.4834 30.7473 19.6665 31.47 20.1772 31.9305L30.5562 41.2878C30.9049 41.6021 31.3479 41.7454 31.7826 41.7229C32.2172 41.7004 32.6431 41.5122 32.9575 41.1635C33.5862 40.4661 33.5305 39.391 32.8332 38.7623L25.4729 32.1263C28.996 31.6441 31.7445 28.8665 32.2576 25.4165L34.657 25.2922C35.5948 25.2437 36.3156 24.4441 36.2671 23.5064C36.2185 22.5687 35.4191 21.8479 34.4814 21.8965Z" fill="#F8A836"/>
          <defs>
          <linearGradient id="paint0_linear_1871_25233" x1="13.5405" y1="14.9627" x2="47.281" y2="45.3816" gradientUnits="userSpaceOnUse">
          <stop stop-color="#FEE45A"/>
          <stop offset="1" stop-color="#FEA613"/>
          </linearGradient>
          <linearGradient id="paint1_linear_1871_25233" x1="12.8943" y1="-29.9134" x2="54.7057" y2="130.542" gradientUnits="userSpaceOnUse">
          <stop stop-color="#FEA613" stop-opacity="0"/>
          <stop offset="1" stop-color="#E94444"/>
          </linearGradient>
          <linearGradient id="paint2_linear_1871_25233" x1="14.742" y1="16.04" x2="45.6944" y2="43.9454" gradientUnits="userSpaceOnUse">
          <stop stop-color="#FEE45A"/>
          <stop offset="1" stop-color="#FEA613"/>
          </linearGradient>
          <linearGradient id="paint3_linear_1871_25233" x1="42.7997" y1="41.3374" x2="14.1312" y2="15.4912" gradientUnits="userSpaceOnUse">
          <stop stop-color="#FEE45A"/>
          <stop offset="1" stop-color="#FEA613"/>
          </linearGradient>
          <linearGradient id="paint4_linear_1871_25233" x1="28.3092" y1="34.2284" x2="29.6244" y2="59.6325" gradientUnits="userSpaceOnUse">
          <stop stop-color="#FEA613" stop-opacity="0"/>
          <stop offset="1" stop-color="#E94444"/>
          </linearGradient>
          <linearGradient id="paint5_linear_1871_25233" x1="51.483" y1="45.2287" x2="14.3708" y2="12.3742" gradientUnits="userSpaceOnUse">
          <stop stop-color="#FEA613" stop-opacity="0"/>
          <stop offset="1" stop-color="#E94444"/>
          </linearGradient>
          </defs>
          </svg>
          <div className="image-button">
         <svg width="150" height="100" viewBox="0 0 452 297" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M59.4338 129.038C80.5891 129.038 97.7388 111.888 97.7388 90.7327C97.7388 69.5774 80.5891 52.4277 59.4338 52.4277C38.2786 52.4277 21.1289 69.5774 21.1289 90.7327C21.1289 111.888 38.2786 129.038 59.4338 129.038Z" fill="url(#paint0_linear_1871_25123)"/>
          <path d="M97.7392 90.7319C97.7392 87.9102 97.4312 85.1607 96.8522 82.5127H79.2769L91.7044 70.0852C90.2415 67.8034 88.5151 65.6415 86.5198 63.6463C84.5246 61.6511 82.3627 59.9246 80.0809 58.4617L67.6534 70.8892V53.3138C65.0054 52.7347 62.2559 52.4268 59.4342 52.4268C56.6126 52.4268 53.8631 52.7347 51.2151 53.3138V70.889L38.7874 58.4615C36.5056 59.9244 34.3437 61.6509 32.3484 63.6463C30.3532 65.6415 28.6268 67.8034 27.1638 70.0852L39.5913 82.5127H22.0159C21.4369 85.1607 21.1289 87.9102 21.1289 90.7319C21.1289 93.5536 21.4369 96.303 22.0159 98.951H39.5911L27.1636 111.379C28.6266 113.66 30.353 115.822 32.3483 117.817C34.3435 119.813 36.5054 121.539 38.7872 123.002L51.2147 110.575V128.15C53.8627 128.729 56.6122 129.037 59.4339 129.037C62.2555 129.037 65.005 128.729 67.653 128.15V110.575L80.0805 123.002C82.3623 121.539 84.5242 119.813 86.5194 117.817C88.5147 115.822 90.2411 113.66 91.7041 111.379L79.2766 98.951H96.8518C97.4312 96.303 97.7392 93.5536 97.7392 90.7319Z" fill="url(#paint1_linear_1871_25123)"/>
          <path d="M59.4406 125.872C78.8478 125.872 94.5804 110.139 94.5804 90.7321C94.5804 71.3249 78.8478 55.5923 59.4406 55.5923C40.0334 55.5923 24.3008 71.3249 24.3008 90.7321C24.3008 110.139 40.0334 125.872 59.4406 125.872Z" fill="url(#paint2_linear_1871_25123)"/>
          <path d="M59.4382 118.44C74.7407 118.44 87.1459 106.035 87.1459 90.7326C87.1459 75.4301 74.7407 63.0249 59.4382 63.0249C44.1356 63.0249 31.7305 75.4301 31.7305 90.7326C31.7305 106.035 44.1356 118.44 59.4382 118.44Z" fill="url(#paint3_linear_1871_25123)"/>
          <path d="M59.4338 129.037C80.5891 129.037 97.7388 111.887 97.7388 90.7319H21.1289C21.1289 111.887 38.2786 129.037 59.4338 129.037Z" fill="url(#paint4_linear_1871_25123)"/>
          <path d="M96.6059 100.043L71.1183 74.5552L47.5586 77.3359L53.9156 83.693L47.9818 86.6902L53.9731 92.6815V98.0664L63.4801 107.573L62.1441 110.029L76.934 124.819C86.6209 119.838 93.9073 110.849 96.6059 100.043Z" fill="url(#paint5_linear_1871_25123)"/>
          <path d="M69.2182 82.474H65.6849C65.3478 81.0412 64.7414 79.7119 63.921 78.542H69.2184C70.5686 78.542 71.6632 77.4474 71.6632 76.0972C71.6632 74.747 70.5686 73.6523 69.2184 73.6523H54.5496H49.6599C48.3097 73.6523 47.2151 74.747 47.2151 76.0972C47.2151 77.4474 48.3097 78.542 49.6599 78.542H54.5496C57.2312 78.542 59.5403 80.1619 60.5533 82.474H49.6599C48.3097 82.474 47.2151 83.5687 47.2151 84.9188C47.2151 86.269 48.3097 87.3637 49.6599 87.3637H60.6957C59.7705 89.8611 57.3647 91.6461 54.5494 91.6461H49.6597C48.6709 91.6461 47.7796 92.2419 47.401 93.1555C47.0226 94.069 47.2318 95.1204 47.9309 95.8198L62.1398 110.029C62.6172 110.506 63.2428 110.745 63.8686 110.745C64.4944 110.745 65.12 110.506 65.5974 110.029C66.5521 109.074 66.5521 107.526 65.5974 106.571L55.5212 96.4947C60.6163 96.0641 64.7698 92.2797 65.7631 87.3635H69.218C70.5682 87.3635 71.6628 86.2688 71.6628 84.9187C71.6628 83.5685 70.5684 82.474 69.2182 82.474Z" fill="#F8A836"/>
          <path d="M81.875 75.9404C93.2378 75.9404 102.449 66.729 102.449 55.3662C102.449 44.0034 93.2378 34.792 81.875 34.792C70.5122 34.792 61.3008 44.0034 61.3008 55.3662C61.3008 66.729 70.5122 75.9404 81.875 75.9404Z" fill="url(#paint6_linear_1871_25123)"/>
          <path d="M102.449 55.3653C102.449 53.8498 102.284 52.373 101.973 50.9507H92.5331L99.2081 44.2757C98.4223 43.0501 97.495 41.8889 96.4233 40.8172C95.3517 39.7456 94.1905 38.8182 92.9649 38.0325L86.2899 44.7075V35.2674C84.8676 34.9564 83.3908 34.791 81.8752 34.791C80.3596 34.791 78.8829 34.9564 77.4606 35.2674V44.7074L70.7854 38.0324C69.5598 38.8181 68.3986 39.7455 67.327 40.8172C66.2553 41.8889 65.328 43.0501 64.5422 44.2757L71.2173 50.9507H61.7772C61.4662 52.373 61.3008 53.8498 61.3008 55.3653C61.3008 56.8809 61.4662 58.3577 61.7772 59.78H71.2172L64.5421 66.455C65.3279 67.6806 66.2552 68.8418 67.3269 69.9135C68.3985 70.9851 69.5597 71.9124 70.7853 72.6983L77.4604 66.0233V75.4632C78.8826 75.7743 80.3594 75.9397 81.875 75.9397C83.3906 75.9397 84.8674 75.7743 86.2896 75.4632V66.0233L92.9647 72.6983C94.1903 71.9125 95.3515 70.9852 96.4231 69.9135C97.4948 68.8418 98.4221 67.6806 99.2079 66.455L92.5329 59.78H101.973C102.284 58.3577 102.449 56.8809 102.449 55.3653Z" fill="url(#paint7_linear_1871_25123)"/>
          <path d="M81.8859 74.24C92.3098 74.24 100.76 65.7898 100.76 55.3659C100.76 44.942 92.3098 36.4917 81.8859 36.4917C71.462 36.4917 63.0117 44.942 63.0117 55.3659C63.0117 65.7898 71.462 74.24 81.8859 74.24Z" fill="url(#paint8_linear_1871_25123)"/>
          <path d="M81.8784 70.2489C90.0976 70.2489 96.7606 63.5859 96.7606 55.3666C96.7606 47.1474 90.0976 40.4844 81.8784 40.4844C73.6591 40.4844 66.9961 47.1474 66.9961 55.3666C66.9961 63.5859 73.6591 70.2489 81.8784 70.2489Z" fill="url(#paint9_linear_1871_25123)"/>
          <path d="M81.875 75.9404C93.2378 75.9404 102.449 66.729 102.449 55.3662H61.3008C61.3008 66.729 70.5122 75.9404 81.875 75.9404Z" fill="url(#paint10_linear_1871_25123)"/>
          <path d="M101.84 60.3666L88.1504 46.6768L75.4961 48.1703L78.9106 51.5848L75.7234 53.1947L78.9414 56.4127V59.305L84.0478 64.4114L83.3302 65.7302L91.2741 73.6741C96.4771 70.9988 100.391 66.1707 101.84 60.3666Z" fill="url(#paint11_linear_1871_25123)"/>
          <path d="M87.1269 50.9302H85.2292C85.0481 50.1606 84.7224 49.4466 84.2817 48.8182H87.127C87.8523 48.8182 88.4402 48.2303 88.4402 47.5051C88.4402 46.7798 87.8523 46.1919 87.127 46.1919H79.2482H76.6219C75.8967 46.1919 75.3087 46.7798 75.3087 47.5051C75.3087 48.2303 75.8967 48.8182 76.6219 48.8182H79.2482C80.6885 48.8182 81.9288 49.6883 82.4729 50.9302H76.6219C75.8967 50.9302 75.3087 51.5181 75.3087 52.2433C75.3087 52.9685 75.8967 53.5565 76.6219 53.5565H82.5494C82.0524 54.8979 80.7602 55.8567 79.2481 55.8567H76.6218C76.0906 55.8567 75.6119 56.1766 75.4086 56.6673C75.2053 57.158 75.3177 57.7227 75.6932 58.0984L83.325 65.7302C83.5814 65.9866 83.9175 66.1148 84.2536 66.1148C84.5897 66.1148 84.9258 65.9866 85.1822 65.7302C85.695 65.2174 85.695 64.386 85.1822 63.8732L79.7701 58.4609C82.5068 58.2296 84.7376 56.197 85.2712 53.5564H87.1268C87.852 53.5564 88.44 52.9684 88.44 52.2432C88.44 51.518 87.8522 50.9302 87.1269 50.9302Z" fill="#F8A836"/>
          <path d="M372.949 129.038C394.105 129.038 411.254 111.888 411.254 90.7327C411.254 69.5774 394.105 52.4277 372.949 52.4277C351.794 52.4277 334.645 69.5774 334.645 90.7327C334.645 111.888 351.794 129.038 372.949 129.038Z" fill="url(#paint12_linear_1871_25123)"/>
          <path d="M411.255 90.7319C411.255 87.9102 410.947 85.1607 410.368 82.5127H392.793L405.22 70.0852C403.757 67.8034 402.031 65.6415 400.035 63.6463C398.04 61.6511 395.878 59.9246 393.597 58.4617L381.169 70.8892V53.3138C378.521 52.7347 375.772 52.4268 372.95 52.4268C370.128 52.4268 367.379 52.7347 364.731 53.3138V70.889L352.303 58.4615C350.021 59.9244 347.859 61.6509 345.864 63.6463C343.869 65.6415 342.142 67.8034 340.679 70.0852L353.107 82.5127H335.532C334.952 85.1607 334.645 87.9102 334.645 90.7319C334.645 93.5536 334.952 96.303 335.532 98.951H353.107L340.679 111.379C342.142 113.66 343.869 115.822 345.864 117.817C347.859 119.813 350.021 121.539 352.303 123.002L364.73 110.575V128.15C367.378 128.729 370.128 129.037 372.949 129.037C375.771 129.037 378.521 128.729 381.169 128.15V110.575L393.596 123.002C395.878 121.539 398.04 119.813 400.035 117.817C402.03 115.822 403.757 113.66 405.22 111.379L392.792 98.951H410.367C410.947 96.303 411.255 93.5536 411.255 90.7319Z" fill="url(#paint13_linear_1871_25123)"/>
          <path d="M372.956 125.872C392.363 125.872 408.096 110.139 408.096 90.7321C408.096 71.3249 392.363 55.5923 372.956 55.5923C353.549 55.5923 337.816 71.3249 337.816 90.7321C337.816 110.139 353.549 125.872 372.956 125.872Z" fill="url(#paint14_linear_1871_25123)"/>
          <path d="M372.946 118.44C388.249 118.44 400.654 106.035 400.654 90.7326C400.654 75.4301 388.249 63.0249 372.946 63.0249C357.643 63.0249 345.238 75.4301 345.238 90.7326C345.238 106.035 357.643 118.44 372.946 118.44Z" fill="url(#paint15_linear_1871_25123)"/>
          <path d="M372.949 129.037C394.105 129.037 411.254 111.887 411.254 90.7319H334.645C334.645 111.887 351.794 129.037 372.949 129.037Z" fill="url(#paint16_linear_1871_25123)"/>
          <path d="M410.122 100.043L384.634 74.5552L361.074 77.3359L367.431 83.693L361.497 86.6902L367.489 92.6815V98.0664L376.996 107.573L375.66 110.029L390.45 124.819C400.137 119.838 407.423 110.849 410.122 100.043Z" fill="url(#paint17_linear_1871_25123)"/>
          <path d="M382.734 82.474H379.201C378.863 81.0412 378.257 79.7119 377.437 78.542H382.734C384.084 78.542 385.179 77.4474 385.179 76.0972C385.179 74.747 384.084 73.6523 382.734 73.6523H368.065H363.176C361.825 73.6523 360.731 74.747 360.731 76.0972C360.731 77.4474 361.825 78.542 363.176 78.542H368.065C370.747 78.542 373.056 80.1619 374.069 82.474H363.176C361.825 82.474 360.731 83.5687 360.731 84.9188C360.731 86.269 361.825 87.3637 363.176 87.3637H374.211C373.286 89.8611 370.88 91.6461 368.065 91.6461H363.175C362.186 91.6461 361.295 92.2419 360.917 93.1555C360.538 94.069 360.747 95.1204 361.447 95.8198L375.655 110.029C376.133 110.506 376.758 110.745 377.384 110.745C378.01 110.745 378.636 110.506 379.113 110.029C380.068 109.074 380.068 107.526 379.113 106.571L369.037 96.4947C374.132 96.0641 378.285 92.2797 379.279 87.3635H382.734C384.084 87.3635 385.178 86.2688 385.178 84.9187C385.178 83.5685 384.084 82.474 382.734 82.474Z" fill="#F8A836"/>
          <path d="M354.242 75.9404C365.605 75.9404 374.816 66.729 374.816 55.3662C374.816 44.0034 365.605 34.792 354.242 34.792C342.879 34.792 333.668 44.0034 333.668 55.3662C333.668 66.729 342.879 75.9404 354.242 75.9404Z" fill="url(#paint18_linear_1871_25123)"/>
          <path d="M374.817 55.3653C374.817 53.8498 374.651 52.373 374.34 50.9507H364.9L371.575 44.2757C370.789 43.0501 369.862 41.8889 368.791 40.8172C367.719 39.7456 366.558 38.8182 365.332 38.0325L358.657 44.7075V35.2674C357.235 34.9564 355.758 34.791 354.242 34.791C352.727 34.791 351.25 34.9564 349.828 35.2674V44.7074L343.153 38.0324C341.927 38.8181 340.766 39.7455 339.694 40.8172C338.623 41.8889 337.695 43.0501 336.909 44.2757L343.584 50.9507H334.144C333.833 52.373 333.668 53.8498 333.668 55.3653C333.668 56.8809 333.833 58.3577 334.144 59.78H343.584L336.909 66.455C337.695 67.6806 338.622 68.8418 339.694 69.9135C340.766 70.9851 341.927 71.9124 343.153 72.6983L349.828 66.0233V75.4632C351.25 75.7743 352.727 75.9397 354.242 75.9397C355.758 75.9397 357.235 75.7743 358.657 75.4632V66.0233L365.332 72.6983C366.557 71.9125 367.719 70.9852 368.79 69.9135C369.862 68.8418 370.789 67.6806 371.575 66.455L364.9 59.78H374.34C374.651 58.3577 374.817 56.8809 374.817 55.3653Z" fill="url(#paint19_linear_1871_25123)"/>
          <path d="M354.245 74.24C364.669 74.24 373.119 65.7898 373.119 55.3659C373.119 44.942 364.669 36.4917 354.245 36.4917C343.821 36.4917 335.371 44.942 335.371 55.3659C335.371 65.7898 343.821 74.24 354.245 74.24Z" fill="url(#paint20_linear_1871_25123)"/>
          <path d="M354.246 70.2489C362.465 70.2489 369.128 63.5859 369.128 55.3666C369.128 47.1474 362.465 40.4844 354.246 40.4844C346.026 40.4844 339.363 47.1474 339.363 55.3666C339.363 63.5859 346.026 70.2489 354.246 70.2489Z" fill="url(#paint21_linear_1871_25123)"/>
          <path d="M354.242 75.9404C365.605 75.9404 374.816 66.729 374.816 55.3662H333.668C333.668 66.729 342.879 75.9404 354.242 75.9404Z" fill="url(#paint22_linear_1871_25123)"/>
          <path d="M374.2 60.3666L360.51 46.6768L347.855 48.1703L351.27 51.5848L348.083 53.1947L351.301 56.4127V59.305L356.407 64.4114L355.69 65.7302L363.633 73.6741C368.836 70.9988 372.75 66.1707 374.2 60.3666Z" fill="url(#paint23_linear_1871_25123)"/>
          <path d="M359.494 50.9302H357.596C357.415 50.1606 357.09 49.4466 356.649 48.8182H359.494C360.219 48.8182 360.807 48.2303 360.807 47.5051C360.807 46.7798 360.219 46.1919 359.494 46.1919H351.615H348.989C348.264 46.1919 347.676 46.7798 347.676 47.5051C347.676 48.2303 348.264 48.8182 348.989 48.8182H351.615C353.056 48.8182 354.296 49.6883 354.84 50.9302H348.989C348.264 50.9302 347.676 51.5181 347.676 52.2433C347.676 52.9685 348.264 53.5565 348.989 53.5565H354.917C354.42 54.8979 353.127 55.8567 351.615 55.8567H348.989C348.458 55.8567 347.979 56.1766 347.776 56.6673C347.573 57.158 347.685 57.7227 348.06 58.0984L355.692 65.7302C355.949 65.9866 356.285 66.1148 356.621 66.1148C356.957 66.1148 357.293 65.9866 357.549 65.7302C358.062 65.2174 358.062 64.386 357.549 63.8732L352.137 58.4609C354.874 58.2296 357.105 56.197 357.638 53.5564H359.494C360.219 53.5564 360.807 52.9684 360.807 52.2432C360.807 51.518 360.219 50.9302 359.494 50.9302Z" fill="#F8A836"/>
          <path d="M18.168 186.379H418.168C418.168 186.379 397.436 218.419 397.436 241.379C397.436 264.34 418.168 296.379 418.168 296.379H18.168C18.168 296.379 33.5138 265.259 34.0216 243.824C34.5729 220.555 18.168 186.379 18.168 186.379Z" fill="url(#paint24_linear_1871_25123)"/>
          <g filter="url(#filter0_d_1871_25123)">
          <path d="M434.089 170.484L409.106 150.889L404.207 230.247L435.069 203.795C437.518 193.507 438.987 184.69 434.089 170.484Z" fill="url(#paint25_linear_1871_25123)"/>
          </g>
          <g filter="url(#filter1_d_1871_25123)">
          <ellipse cx="218.057" cy="132.765" rx="146.959" ry="118.547" fill="url(#paint26_linear_1871_25123)"/>
          </g>
          <g filter="url(#filter2_i_1871_25123)">
          <ellipse cx="218.556" cy="135.214" rx="130.794" ry="105.321" fill="#763DD2"/>
          </g>
          <path d="M141.264 85.7361L135.276 73.7961H139.128L141.276 78.7521L142.812 82.2801H142.992L144.552 78.7641L146.7 73.7961H150.552L144.576 85.7361H141.264ZM141.216 91.2441V83.7681H144.612V91.2441H141.216ZM155.723 91.4241C154.483 91.4241 153.403 91.1641 152.483 90.6441C151.563 90.1241 150.851 89.3601 150.347 88.3521C149.843 87.3361 149.591 86.0921 149.591 84.6201C149.591 83.2281 149.855 82.0281 150.383 81.0201C150.919 80.0121 151.655 79.2401 152.591 78.7041C153.527 78.1601 154.587 77.8881 155.771 77.8881C157.051 77.8881 158.147 78.1601 159.059 78.7041C159.979 79.2401 160.683 80.0121 161.171 81.0201C161.659 82.0281 161.903 83.2281 161.903 84.6201C161.903 86.0921 161.631 87.3361 161.087 88.3521C160.543 89.3601 159.803 90.1241 158.867 90.6441C157.939 91.1641 156.891 91.4241 155.723 91.4241ZM155.771 88.6521C156.587 88.6521 157.259 88.3481 157.787 87.7401C158.323 87.1321 158.591 86.0921 158.591 84.6201C158.591 83.2521 158.323 82.2521 157.787 81.6201C157.251 80.9801 156.563 80.6601 155.723 80.6601C154.907 80.6601 154.235 80.9761 153.707 81.6081C153.179 82.2401 152.915 83.2441 152.915 84.6201C152.915 86.0281 153.187 87.0521 153.731 87.6921C154.275 88.3321 154.955 88.6521 155.771 88.6521ZM168.105 91.5081C166.945 91.5081 166.029 91.1161 165.357 90.3321C164.685 89.5401 164.349 88.3721 164.349 86.8281V78.1401H167.673V85.8081C167.673 86.5361 167.741 87.1121 167.877 87.5361C168.013 87.9521 168.217 88.2481 168.489 88.4241C168.769 88.6001 169.113 88.6881 169.521 88.6881C170.065 88.6881 170.557 88.5201 170.997 88.1841C171.445 87.8481 171.769 87.4601 171.969 87.0201V78.1401H175.281V91.2441H172.389L172.065 86.3001L172.233 87.2961C172.137 88.0161 171.945 88.6961 171.657 89.3361C171.377 89.9761 170.953 90.5001 170.385 90.9081C169.817 91.3081 169.057 91.5081 168.105 91.5081ZM182.856 91.2441V72.5361H186.108V78.1521L185.904 81.8841L186.024 82.9401L185.88 82.0881C185.976 81.3681 186.168 80.6881 186.456 80.0481C186.744 79.4001 187.172 78.8761 187.74 78.4761C188.308 78.0761 189.06 77.8761 189.996 77.8761C191.212 77.8761 192.168 78.2641 192.864 79.0401C193.568 79.8081 193.92 80.9841 193.92 82.5681V91.2441H190.596V83.7681C190.596 82.6641 190.444 81.8761 190.14 81.4041C189.844 80.9321 189.328 80.6961 188.592 80.6961C188.072 80.6961 187.596 80.8721 187.164 81.2241C186.74 81.5681 186.408 81.9801 186.168 82.4601V91.2441H182.856ZM200.44 91.3881C199.672 91.3881 198.98 91.2441 198.364 90.9561C197.756 90.6681 197.276 90.2521 196.924 89.7081C196.58 89.1641 196.408 88.5201 196.408 87.7761C196.408 86.9921 196.56 86.3481 196.864 85.8441C197.168 85.3321 197.592 84.9281 198.136 84.6321C198.68 84.3281 199.308 84.1041 200.02 83.9601C200.516 83.8561 201.028 83.7721 201.556 83.7081C202.092 83.6361 202.592 83.5801 203.056 83.5401C203.52 83.5001 203.896 83.4681 204.184 83.4441V83.0001C204.184 82.1441 204.028 81.5241 203.716 81.1401C203.404 80.7481 202.868 80.5521 202.108 80.5521C201.62 80.5521 201.208 80.6161 200.872 80.7441C200.544 80.8721 200.296 81.1041 200.128 81.4401C199.96 81.7761 199.876 82.2601 199.876 82.8921H196.78C196.692 81.7481 196.864 80.8081 197.296 80.0721C197.736 79.3361 198.38 78.7921 199.228 78.4401C200.084 78.0801 201.088 77.9001 202.24 77.9001C202.92 77.9001 203.568 77.9761 204.184 78.1281C204.808 78.2721 205.36 78.5241 205.84 78.8841C206.328 79.2361 206.712 79.7201 206.992 80.3361C207.28 80.9521 207.424 81.7321 207.424 82.6761V91.2441H204.16L204.184 88.2441C204.04 89.1241 203.672 89.8681 203.08 90.4761C202.488 91.0841 201.608 91.3881 200.44 91.3881ZM201.448 89.0721C201.856 89.0721 202.252 89.0001 202.636 88.8561C203.028 88.7041 203.364 88.4961 203.644 88.2321C203.932 87.9681 204.112 87.6641 204.184 87.3201V85.1001C203.864 85.1481 203.516 85.2041 203.14 85.2681C202.764 85.3321 202.436 85.3961 202.156 85.4601C201.308 85.6361 200.712 85.8801 200.368 86.1921C200.032 86.4961 199.864 86.9241 199.864 87.4761C199.864 87.8041 199.928 88.0881 200.056 88.3281C200.192 88.5681 200.38 88.7521 200.62 88.8801C200.868 89.0081 201.144 89.0721 201.448 89.0721ZM213.328 91.2441L208.84 78.1521H212.488L214.204 84.7161L215.044 88.0641H215.152L215.992 84.7281L217.708 78.1521H221.344L216.88 91.2441H213.328ZM228.484 91.4241C227.188 91.4241 226.076 91.1641 225.148 90.6441C224.22 90.1161 223.508 89.3521 223.012 88.3521C222.516 87.3441 222.268 86.1201 222.268 84.6801C222.268 83.2241 222.528 81.9921 223.048 80.9841C223.576 79.9761 224.308 79.2081 225.244 78.6801C226.188 78.1521 227.284 77.8881 228.532 77.8881C229.748 77.8881 230.776 78.1241 231.616 78.5961C232.464 79.0601 233.108 79.7521 233.548 80.6721C233.988 81.5841 234.208 82.7041 234.208 84.0321C234.208 84.2481 234.2 84.4521 234.184 84.6441C234.176 84.8361 234.164 85.0641 234.148 85.3281H225.532C225.612 86.5281 225.904 87.4081 226.408 87.9681C226.92 88.5281 227.584 88.8081 228.4 88.8081C229.12 88.8081 229.668 88.6521 230.044 88.3401C230.42 88.0281 230.656 87.6481 230.752 87.2001H233.932C233.86 88.0721 233.588 88.8281 233.116 89.4681C232.652 90.1001 232.024 90.5841 231.232 90.9201C230.448 91.2561 229.532 91.4241 228.484 91.4241ZM226.948 83.3001H230.98C230.948 82.4041 230.728 81.7241 230.32 81.2601C229.92 80.7961 229.28 80.5641 228.4 80.5641C227.432 80.5641 226.716 80.9001 226.252 81.5721C225.796 82.2361 225.548 83.1721 225.508 84.3801C225.572 83.9641 225.72 83.6801 225.952 83.5281C226.184 83.3761 226.516 83.3001 226.948 83.3001ZM243.747 91.2441L239.343 73.7961H242.967L244.767 82.7841L245.763 88.5201H245.859L246.795 82.7841L248.463 73.7961H252.723L254.415 82.7841L255.339 88.5201H255.435L256.491 82.7841L258.351 73.7961H261.987L257.439 91.2441H253.155L251.307 81.9801L250.635 77.5281H250.563L249.891 81.9801L248.055 91.2441H243.747ZM268.363 91.4241C267.123 91.4241 266.043 91.1641 265.123 90.6441C264.203 90.1241 263.491 89.3601 262.987 88.3521C262.483 87.3361 262.231 86.0921 262.231 84.6201C262.231 83.2281 262.495 82.0281 263.023 81.0201C263.559 80.0121 264.295 79.2401 265.231 78.7041C266.167 78.1601 267.227 77.8881 268.411 77.8881C269.691 77.8881 270.787 78.1601 271.699 78.7041C272.619 79.2401 273.323 80.0121 273.811 81.0201C274.299 82.0281 274.543 83.2281 274.543 84.6201C274.543 86.0921 274.271 87.3361 273.727 88.3521C273.183 89.3601 272.443 90.1241 271.507 90.6441C270.579 91.1641 269.531 91.4241 268.363 91.4241ZM268.411 88.6521C269.227 88.6521 269.899 88.3481 270.427 87.7401C270.963 87.1321 271.231 86.0921 271.231 84.6201C271.231 83.2521 270.963 82.2521 270.427 81.6201C269.891 80.9801 269.203 80.6601 268.363 80.6601C267.547 80.6601 266.875 80.9761 266.347 81.6081C265.819 82.2401 265.555 83.2441 265.555 84.6201C265.555 86.0281 265.827 87.0521 266.371 87.6921C266.915 88.3321 267.595 88.6521 268.411 88.6521ZM277.087 91.2441V78.1521H280.003L280.315 83.0841L280.147 82.0881C280.243 81.3681 280.431 80.6881 280.711 80.0481C280.991 79.4001 281.411 78.8761 281.971 78.4761C282.539 78.0761 283.287 77.8761 284.215 77.8761C285.431 77.8761 286.391 78.2641 287.095 79.0401C287.799 79.8081 288.151 80.9841 288.151 82.5681V91.2441H284.839V83.7681C284.839 82.9761 284.763 82.3601 284.611 81.9201C284.467 81.4721 284.247 81.1561 283.951 80.9721C283.663 80.7881 283.295 80.6961 282.847 80.6961C282.303 80.6961 281.811 80.8641 281.371 81.2001C280.939 81.5361 280.619 81.9241 280.411 82.3641V91.2441H277.087ZM296.227 85.7721L295.783 78.7041L295.531 73.4841H298.987L298.735 78.7041L298.291 85.7721H296.227ZM297.259 91.4241C296.723 91.4241 296.263 91.2361 295.879 90.8601C295.503 90.4841 295.315 89.9921 295.315 89.3841C295.315 88.8001 295.503 88.3201 295.879 87.9441C296.263 87.5601 296.723 87.3681 297.259 87.3681C297.795 87.3681 298.251 87.5601 298.627 87.9441C299.011 88.3201 299.203 88.8001 299.203 89.3841C299.203 89.9921 299.011 90.4841 298.627 90.8601C298.243 91.2361 297.787 91.4241 297.259 91.4241Z" fill="white"/>
          <g filter="url(#filter3_d_1871_25123)">
          <path d="M402.723 132.765H29.6985C-1.82731 172.444 12.8813 219.961 29.6985 240.535H402.723C434.09 199.876 421.843 154.319 402.723 132.765Z" fill="url(#paint27_linear_1871_25123)"/>
          </g>
          <g filter="url(#filter4_d_1871_25123)">
          <path d="M362.082 120.028H71.5929C24.5659 167.055 50.0478 229.104 69.6424 254.251H365.511C414.495 200.366 382.653 136.193 362.082 120.028Z" fill="url(#paint28_linear_1871_25123)"/>
          </g>
          <path d="M398.328 132.765C409.922 149.91 426.152 195.467 398.328 240.535C408.125 223.716 421.841 178.616 398.328 132.765Z" fill="#946700"/>
          <path d="M392.445 134.724C404.039 151.869 420.27 197.426 392.445 242.494C402.242 225.675 415.958 180.575 392.445 134.724Z" fill="#946700"/>
          <path d="M376.773 134.724C388.367 151.869 404.598 197.426 376.773 242.494C386.57 225.675 400.286 180.575 376.773 134.724Z" fill="#946700"/>
          <path d="M33.5625 132.765C21.969 149.91 5.73814 195.467 33.5625 240.535C23.7656 223.716 10.0501 178.616 33.5625 132.765Z" fill="#946700"/>
          <path d="M39.4453 132.765C27.8518 149.91 11.621 195.467 39.4453 240.535C29.6484 223.716 15.9329 178.616 39.4453 132.765Z" fill="#946700"/>
          <path d="M59.0234 132.765C47.4299 149.91 31.1991 195.467 59.0234 240.535C49.2266 223.716 35.511 178.616 59.0234 132.765Z" fill="#946700"/>
          <g filter="url(#filter5_i_1871_25123)">
          <path d="M81.8819 245.434C50.5211 198.897 61.7969 156.768 81.8831 131.785H354.238C386.373 163.92 381.189 221.43 354.238 245.434H81.8819Z" fill="white"/>
          </g>
          <path d="M353.622 133.255C369.04 148.948 375.558 170.727 374.926 191.614C374.293 212.496 366.524 232.249 353.671 243.964H82.668C52.4723 198.618 63.2307 157.744 82.5947 133.255H353.622Z" stroke="#6A2DC6" stroke-width="2.93919"/>
          <text x="140" y="212" fill="#270659" fontSize="60"  fontWeight="bold" fontFamily="Arial, sans-serif" >₹{winningData[0].win_amount}</text>
          <path d="M435.072 49.9771L421.355 168.034C421.355 168.034 423.315 172.552 425.274 173.423C429.683 175.382 430.663 173.423 430.663 173.423L438.991 49.9771H435.072Z" fill="url(#paint30_linear_1871_25123)"/>
          <path d="M421.848 167.545C422.338 173.423 426.746 176.362 430.665 173.423C428.35 174.428 424.297 173.913 421.848 167.545Z" fill="#905603"/>
          <circle cx="437.03" cy="52.916" r="14.2061" fill="url(#paint31_radial_1871_25123)"/>
          <path d="M81.8718 131.785C68.1566 164.606 63.0624 205.461 81.8733 245.434C66.8507 227.309 45.8175 178.028 81.8718 131.785Z" fill="url(#paint32_linear_1871_25123)"/>
          <path d="M81.8718 131.785C68.1566 164.606 63.0624 205.461 81.8733 245.434C66.8507 227.309 45.8175 178.028 81.8718 131.785Z" fill="url(#paint33_linear_1871_25123)" fill-opacity="0.2"/>
          <path d="M354.256 131.785C373.034 163.626 376.778 208.694 354.251 245.434C374.329 229.268 392.956 173.424 354.256 131.785Z" fill="url(#paint34_linear_1871_25123)"/>
          <path d="M354.256 131.785C373.034 163.626 376.778 208.694 354.251 245.434C374.329 229.268 392.956 173.424 354.256 131.785Z" fill="url(#paint35_linear_1871_25123)" fill-opacity="0.2"/>
          <path d="M221.492 151.38C213.168 134.839 189.651 132.438 177.895 131.785H269.009C234.523 131.785 227.861 141.093 221.492 151.38Z" fill="#D9D9D9"/>
          <path d="M221.492 151.38C213.168 134.839 189.651 132.438 177.895 131.785H269.009C234.523 131.785 227.861 141.093 221.492 151.38Z" fill="url(#paint36_linear_1871_25123)"/>
          <path d="M221.492 225.839C213.168 242.379 189.651 244.78 177.895 245.433H269.009C234.523 245.433 227.861 236.126 221.492 225.839Z" fill="#D9D9D9"/>
          <path d="M221.492 225.839C213.168 242.379 189.651 244.78 177.895 245.433H269.009C234.523 245.433 227.861 236.126 221.492 225.839Z" fill="url(#paint37_linear_1871_25123)"/>
          <g filter="url(#filter6_d_1871_25123)">
          <circle cx="97.3919" cy="72.8431" r="11.5989" fill="url(#paint38_linear_1871_25123)"/>
          <circle cx="97.3919" cy="72.8431" r="11.1847" stroke="#FFF7A4" stroke-width="0.828496"/>
          </g>
          <g filter="url(#filter7_f_1871_25123)">
          <circle cx="97.3897" cy="72.8433" r="6.62797" fill="url(#paint39_linear_1871_25123)"/>
          </g>
          <g filter="url(#filter8_d_1871_25123)">
          <circle cx="127.767" cy="44.431" r="11.5989" fill="url(#paint40_linear_1871_25123)"/>
          <circle cx="127.767" cy="44.431" r="11.1847" stroke="#FFF7A4" stroke-width="0.828496"/>
          </g>
          <g filter="url(#filter9_f_1871_25123)">
          <circle cx="127.765" cy="44.4312" r="6.62797" fill="url(#paint41_linear_1871_25123)"/>
          </g>
          <g filter="url(#filter10_d_1871_25123)">
          <circle cx="78.7825" cy="111.053" r="11.5989" fill="url(#paint42_linear_1871_25123)"/>
          <circle cx="78.7825" cy="111.053" r="11.1847" stroke="#FFF7A4" stroke-width="0.828496"/>
          </g>
          <g filter="url(#filter11_f_1871_25123)">
          <circle cx="78.7803" cy="111.053" r="6.62797" fill="url(#paint43_linear_1871_25123)"/>
          </g>
          <g filter="url(#filter12_d_1871_25123)">
          <circle cx="172.829" cy="23.8573" r="11.5989" fill="url(#paint44_linear_1871_25123)"/>
          <circle cx="172.829" cy="23.8573" r="11.1847" stroke="#FFF7A4" stroke-width="0.828496"/>
          </g>
          <g filter="url(#filter13_f_1871_25123)">
          <circle cx="172.843" cy="23.8565" r="6.62797" fill="url(#paint45_linear_1871_25123)"/>
          </g>
          <g filter="url(#filter14_d_1871_25123)">
          <circle cx="218.884" cy="17.9783" r="11.5989" fill="url(#paint46_linear_1871_25123)"/>
          <circle cx="218.884" cy="17.9783" r="11.1847" stroke="#FFF7A4" stroke-width="0.828496"/>
          </g>
          <g filter="url(#filter15_f_1871_25123)">
          <circle cx="218.882" cy="17.9786" r="6.62797" fill="url(#paint47_linear_1871_25123)"/>
          </g>
          <g filter="url(#filter16_d_1871_25123)">
          <circle cx="268.845" cy="25.8162" r="11.5989" fill="url(#paint48_linear_1871_25123)"/>
          <circle cx="268.845" cy="25.8162" r="11.1847" stroke="#FFF7A4" stroke-width="0.828496"/>
          </g>
          <g filter="url(#filter17_f_1871_25123)">
          <circle cx="268.858" cy="25.8164" r="6.62797" fill="url(#paint49_linear_1871_25123)"/>
          </g>
          <g filter="url(#filter18_d_1871_25123)">
          <circle cx="310.97" cy="46.39" r="11.5989" fill="url(#paint50_linear_1871_25123)"/>
          <circle cx="310.97" cy="46.39" r="11.1847" stroke="#FFF7A4" stroke-width="0.828496"/>
          </g>
          <g filter="url(#filter19_f_1871_25123)">
          <circle cx="310.983" cy="46.3902" r="6.62797" fill="url(#paint51_linear_1871_25123)"/>
          </g>
          <g filter="url(#filter20_d_1871_25123)">
          <circle cx="357.025" cy="111.053" r="11.5989" fill="url(#paint52_linear_1871_25123)"/>
          <circle cx="357.025" cy="111.053" r="11.1847" stroke="#FFF7A4" stroke-width="0.828496"/>
          </g>
          <g filter="url(#filter21_f_1871_25123)">
          <circle cx="357.022" cy="111.053" r="6.62797" fill="url(#paint53_linear_1871_25123)"/>
          </g>
          <g filter="url(#filter22_d_1871_25123)">
          <circle cx="338.408" cy="72.8431" r="11.5989" fill="url(#paint54_linear_1871_25123)"/>
          <circle cx="338.408" cy="72.8431" r="11.1847" stroke="#FFF7A4" stroke-width="0.828496"/>
          </g>
          <g filter="url(#filter23_f_1871_25123)">
          <circle cx="338.421" cy="72.8433" r="6.62797" fill="url(#paint55_linear_1871_25123)"/>
          </g>
          <defs>
          <filter id="filter0_d_1871_25123" x="393.038" y="139.72" width="55.4667" height="101.696" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset/>
          <feGaussianBlur stdDeviation="5.58446"/>
          <feComposite in2="hardAlpha" operator="out"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1871_25123"/>
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1871_25123" result="shape"/>
          </filter>
          <filter id="filter1_d_1871_25123" x="59.9287" y="3.04837" width="316.256" height="259.433" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset/>
          <feGaussianBlur stdDeviation="5.58446"/>
          <feComposite in2="hardAlpha" operator="out"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1871_25123"/>
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1871_25123" result="shape"/>
          </filter>
          <filter id="filter2_i_1871_25123" x="87.7617" y="29.8931" width="261.586" height="210.642" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix"/>
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset/>
          <feGaussianBlur stdDeviation="29.7"/>
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0"/>
          <feBlend mode="normal" in2="shape" result="effect1_innerShadow_1871_25123"/>
          </filter>
          <filter id="filter3_d_1871_25123" x="-0.00094986" y="121.596" width="433.096" height="130.108" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset/>
          <feGaussianBlur stdDeviation="5.58446"/>
          <feComposite in2="hardAlpha" operator="out"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1871_25123"/>
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1871_25123" result="shape"/>
          </filter>
          <filter id="filter4_d_1871_25123" x="33.7334" y="108.859" width="368.842" height="156.561" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset/>
          <feGaussianBlur stdDeviation="5.58446"/>
          <feComposite in2="hardAlpha" operator="out"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1871_25123"/>
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1871_25123" result="shape"/>
          </filter>
          <filter id="filter5_i_1871_25123" x="62.3633" y="130.805" width="315.054" height="114.628" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix"/>
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dx="0.97973" dy="-0.97973"/>
          <feGaussianBlur stdDeviation="11.1199"/>
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0.236073 0 0 0 0 0.171245 0 0 0 0 0 0 0 0 1 0"/>
          <feBlend mode="normal" in2="shape" result="effect1_innerShadow_1871_25123"/>
          </filter>
          <filter id="filter6_d_1871_25123" x="78.5851" y="54.8647" width="37.6151" height="37.6138" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dy="0.828496"/>
          <feGaussianBlur stdDeviation="3.60396"/>
          <feComposite in2="hardAlpha" operator="out"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0.936561 0 0 0 0 0.834941 0 0 0 0 0.256485 0 0 0 1 0"/>
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1871_25123"/>
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1871_25123" result="shape"/>
          </filter>
          <filter id="filter7_f_1871_25123" x="89.1876" y="64.6412" width="16.4061" height="16.4041" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix"/>
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
          <feGaussianBlur stdDeviation="0.787071" result="effect1_foregroundBlur_1871_25123"/>
          </filter>
          <filter id="filter8_d_1871_25123" x="108.96" y="26.4526" width="37.6151" height="37.6138" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dy="0.828496"/>
          <feGaussianBlur stdDeviation="3.60396"/>
          <feComposite in2="hardAlpha" operator="out"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0.936561 0 0 0 0 0.834941 0 0 0 0 0.256485 0 0 0 1 0"/>
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1871_25123"/>
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1871_25123" result="shape"/>
          </filter>
          <filter id="filter9_f_1871_25123" x="119.563" y="36.2291" width="16.4061" height="16.4041" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix"/>
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
          <feGaussianBlur stdDeviation="0.787071" result="effect1_foregroundBlur_1871_25123"/>
          </filter>
          <filter id="filter10_d_1871_25123" x="59.9757" y="93.0742" width="37.6151" height="37.6138" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dy="0.828496"/>
          <feGaussianBlur stdDeviation="3.60396"/>
          <feComposite in2="hardAlpha" operator="out"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0.936561 0 0 0 0 0.834941 0 0 0 0 0.256485 0 0 0 1 0"/>
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1871_25123"/>
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1871_25123" result="shape"/>
          </filter>
          <filter id="filter11_f_1871_25123" x="70.5782" y="102.851" width="16.4061" height="16.4041" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix"/>
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
          <feGaussianBlur stdDeviation="0.787071" result="effect1_foregroundBlur_1871_25123"/>
          </filter>
          <filter id="filter12_d_1871_25123" x="154.023" y="5.87888" width="37.6151" height="37.6138" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dy="0.828496"/>
          <feGaussianBlur stdDeviation="3.60396"/>
          <feComposite in2="hardAlpha" operator="out"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0.936561 0 0 0 0 0.834941 0 0 0 0 0.256485 0 0 0 1 0"/>
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1871_25123"/>
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1871_25123" result="shape"/>
          </filter>
          <filter id="filter13_f_1871_25123" x="164.641" y="15.6544" width="16.4061" height="16.4041" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix"/>
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
          <feGaussianBlur stdDeviation="0.787071" result="effect1_foregroundBlur_1871_25123"/>
          </filter>
          <filter id="filter14_d_1871_25123" x="200.077" y="-2.64645e-05" width="37.6151" height="37.6138" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dy="0.828496"/>
          <feGaussianBlur stdDeviation="3.60396"/>
          <feComposite in2="hardAlpha" operator="out"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0.936561 0 0 0 0 0.834941 0 0 0 0 0.256485 0 0 0 1 0"/>
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1871_25123"/>
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1871_25123" result="shape"/>
          </filter>
          <filter id="filter15_f_1871_25123" x="210.68" y="9.77644" width="16.4061" height="16.4041" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix"/>
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
          <feGaussianBlur stdDeviation="0.787071" result="effect1_foregroundBlur_1871_25123"/>
          </filter>
          <filter id="filter16_d_1871_25123" x="250.038" y="7.83786" width="37.6151" height="37.6138" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dy="0.828496"/>
          <feGaussianBlur stdDeviation="3.60396"/>
          <feComposite in2="hardAlpha" operator="out"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0.936561 0 0 0 0 0.834941 0 0 0 0 0.256485 0 0 0 1 0"/>
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1871_25123"/>
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1871_25123" result="shape"/>
          </filter>
          <filter id="filter17_f_1871_25123" x="260.656" y="17.6143" width="16.4061" height="16.4041" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix"/>
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
          <feGaussianBlur stdDeviation="0.787071" result="effect1_foregroundBlur_1871_25123"/>
          </filter>
          <filter id="filter18_d_1871_25123" x="292.163" y="28.4116" width="37.6151" height="37.6138" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dy="0.828496"/>
          <feGaussianBlur stdDeviation="3.60396"/>
          <feComposite in2="hardAlpha" operator="out"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0.936561 0 0 0 0 0.834941 0 0 0 0 0.256485 0 0 0 1 0"/>
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1871_25123"/>
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1871_25123" result="shape"/>
          </filter>
          <filter id="filter19_f_1871_25123" x="302.781" y="38.1881" width="16.4061" height="16.4041" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix"/>
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
          <feGaussianBlur stdDeviation="0.787071" result="effect1_foregroundBlur_1871_25123"/>
          </filter>
          <filter id="filter20_d_1871_25123" x="338.218" y="93.0742" width="37.6151" height="37.6138" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dy="0.828496"/>
          <feGaussianBlur stdDeviation="3.60396"/>
          <feComposite in2="hardAlpha" operator="out"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0.936561 0 0 0 0 0.834941 0 0 0 0 0.256485 0 0 0 1 0"/>
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1871_25123"/>
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1871_25123" result="shape"/>
          </filter>
          <filter id="filter21_f_1871_25123" x="348.82" y="102.851" width="16.4061" height="16.4041" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix"/>
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
          <feGaussianBlur stdDeviation="0.787071" result="effect1_foregroundBlur_1871_25123"/>
          </filter>
          <filter id="filter22_d_1871_25123" x="319.601" y="54.8647" width="37.6151" height="37.6138" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dy="0.828496"/>
          <feGaussianBlur stdDeviation="3.60396"/>
          <feComposite in2="hardAlpha" operator="out"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0.936561 0 0 0 0 0.834941 0 0 0 0 0.256485 0 0 0 1 0"/>
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1871_25123"/>
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1871_25123" result="shape"/>
          </filter>
          <filter id="filter23_f_1871_25123" x="330.219" y="64.6412" width="16.4061" height="16.4041" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix"/>
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
          <feGaussianBlur stdDeviation="0.787071" result="effect1_foregroundBlur_1871_25123"/>
          </filter>
          <linearGradient id="paint0_linear_1871_25123" x1="39.6659" y1="70.9647" x2="85.8568" y2="117.155" gradientUnits="userSpaceOnUse">
          <stop stop-color="#FEE45A"/>
          <stop offset="1" stop-color="#FEA613"/>
          </linearGradient>
          <linearGradient id="paint1_linear_1871_25123" x1="42.0742" y1="6.47298" x2="90.1877" y2="239.999" gradientUnits="userSpaceOnUse">
          <stop stop-color="#FEA613" stop-opacity="0"/>
          <stop offset="1" stop-color="#E94444"/>
          </linearGradient>
          <linearGradient id="paint2_linear_1871_25123" x1="41.3061" y1="72.5976" x2="83.6801" y2="114.972" gradientUnits="userSpaceOnUse">
          <stop stop-color="#FEE45A"/>
          <stop offset="1" stop-color="#FEA613"/>
          </linearGradient>
          <linearGradient id="paint3_linear_1871_25123" x1="79.7136" y1="111.008" x2="40.4664" y2="71.7608" gradientUnits="userSpaceOnUse">
          <stop stop-color="#FEE45A"/>
          <stop offset="1" stop-color="#FEA613"/>
          </linearGradient>
          <linearGradient id="paint4_linear_1871_25123" x1="59.4338" y1="99.7288" x2="59.4338" y2="136.308" gradientUnits="userSpaceOnUse">
          <stop stop-color="#FEA613" stop-opacity="0"/>
          <stop offset="1" stop-color="#E94444"/>
          </linearGradient>
          <linearGradient id="paint5_linear_1871_25123" x1="91.9062" y1="117.246" x2="41.0546" y2="67.307" gradientUnits="userSpaceOnUse">
          <stop stop-color="#FEA613" stop-opacity="0"/>
          <stop offset="1" stop-color="#E94444"/>
          </linearGradient>
          <linearGradient id="paint6_linear_1871_25123" x1="71.2573" y1="44.7485" x2="96.0672" y2="69.5583" gradientUnits="userSpaceOnUse">
          <stop stop-color="#FEE45A"/>
          <stop offset="1" stop-color="#FEA613"/>
          </linearGradient>
          <linearGradient id="paint7_linear_1871_25123" x1="72.5508" y1="10.1085" x2="98.3934" y2="135.539" gradientUnits="userSpaceOnUse">
          <stop stop-color="#FEA613" stop-opacity="0"/>
          <stop offset="1" stop-color="#E94444"/>
          </linearGradient>
          <linearGradient id="paint8_linear_1871_25123" x1="72.1456" y1="45.6255" x2="94.9053" y2="68.3853" gradientUnits="userSpaceOnUse">
          <stop stop-color="#FEE45A"/>
          <stop offset="1" stop-color="#FEA613"/>
          </linearGradient>
          <linearGradient id="paint9_linear_1871_25123" x1="92.7686" y1="66.2569" x2="71.6883" y2="45.1766" gradientUnits="userSpaceOnUse">
          <stop stop-color="#FEE45A"/>
          <stop offset="1" stop-color="#FEA613"/>
          </linearGradient>
          <linearGradient id="paint10_linear_1871_25123" x1="81.875" y1="60.1986" x2="81.875" y2="79.8456" gradientUnits="userSpaceOnUse">
          <stop stop-color="#FEA613" stop-opacity="0"/>
          <stop offset="1" stop-color="#E94444"/>
          </linearGradient>
          <linearGradient id="paint11_linear_1871_25123" x1="99.3159" y1="69.6067" x2="72.0027" y2="42.7837" gradientUnits="userSpaceOnUse">
          <stop stop-color="#FEA613" stop-opacity="0"/>
          <stop offset="1" stop-color="#E94444"/>
          </linearGradient>
          <linearGradient id="paint12_linear_1871_25123" x1="353.181" y1="70.9647" x2="399.372" y2="117.155" gradientUnits="userSpaceOnUse">
          <stop stop-color="#FEE45A"/>
          <stop offset="1" stop-color="#FEA613"/>
          </linearGradient>
          <linearGradient id="paint13_linear_1871_25123" x1="355.59" y1="6.47298" x2="403.703" y2="239.999" gradientUnits="userSpaceOnUse">
          <stop stop-color="#FEA613" stop-opacity="0"/>
          <stop offset="1" stop-color="#E94444"/>
          </linearGradient>
          <linearGradient id="paint14_linear_1871_25123" x1="354.822" y1="72.5976" x2="397.196" y2="114.972" gradientUnits="userSpaceOnUse">
          <stop stop-color="#FEE45A"/>
          <stop offset="1" stop-color="#FEA613"/>
          </linearGradient>
          <linearGradient id="paint15_linear_1871_25123" x1="393.221" y1="111.008" x2="353.974" y2="71.7608" gradientUnits="userSpaceOnUse">
          <stop stop-color="#FEE45A"/>
          <stop offset="1" stop-color="#FEA613"/>
          </linearGradient>
          <linearGradient id="paint16_linear_1871_25123" x1="372.949" y1="99.7288" x2="372.949" y2="136.308" gradientUnits="userSpaceOnUse">
          <stop stop-color="#FEA613" stop-opacity="0"/>
          <stop offset="1" stop-color="#E94444"/>
          </linearGradient>
          <linearGradient id="paint17_linear_1871_25123" x1="405.422" y1="117.246" x2="354.57" y2="67.307" gradientUnits="userSpaceOnUse">
          <stop stop-color="#FEA613" stop-opacity="0"/>
          <stop offset="1" stop-color="#E94444"/>
          </linearGradient>
          <linearGradient id="paint18_linear_1871_25123" x1="343.624" y1="44.7485" x2="368.434" y2="69.5583" gradientUnits="userSpaceOnUse">
          <stop stop-color="#FEE45A"/>
          <stop offset="1" stop-color="#FEA613"/>
          </linearGradient>
          <linearGradient id="paint19_linear_1871_25123" x1="344.918" y1="10.1085" x2="370.761" y2="135.539" gradientUnits="userSpaceOnUse">
          <stop stop-color="#FEA613" stop-opacity="0"/>
          <stop offset="1" stop-color="#E94444"/>
          </linearGradient>
          <linearGradient id="paint20_linear_1871_25123" x1="344.505" y1="45.6255" x2="367.265" y2="68.3853" gradientUnits="userSpaceOnUse">
          <stop stop-color="#FEE45A"/>
          <stop offset="1" stop-color="#FEA613"/>
          </linearGradient>
          <linearGradient id="paint21_linear_1871_25123" x1="365.136" y1="66.2569" x2="344.055" y2="45.1766" gradientUnits="userSpaceOnUse">
          <stop stop-color="#FEE45A"/>
          <stop offset="1" stop-color="#FEA613"/>
          </linearGradient>
          <linearGradient id="paint22_linear_1871_25123" x1="354.242" y1="60.1986" x2="354.242" y2="79.8456" gradientUnits="userSpaceOnUse">
          <stop stop-color="#FEA613" stop-opacity="0"/>
          <stop offset="1" stop-color="#E94444"/>
          </linearGradient>
          <linearGradient id="paint23_linear_1871_25123" x1="371.675" y1="69.6067" x2="344.362" y2="42.7837" gradientUnits="userSpaceOnUse">
          <stop stop-color="#FEA613" stop-opacity="0"/>
          <stop offset="1" stop-color="#E94444"/>
          </linearGradient>
          <linearGradient id="paint24_linear_1871_25123" x1="214.881" y1="190.394" x2="214.698" y2="316.515" gradientUnits="userSpaceOnUse">
          <stop offset="0.00961536" stop-color="#581500"/>
          <stop offset="0.173077" stop-color="#B4963F"/>
          <stop offset="0.467131" stop-color="#A45F12"/>
          <stop offset="0.788155" stop-color="#FFFAB1"/>
          <stop offset="0.922575" stop-color="#C17C34"/>
          <stop offset="1" stop-color="#E5A24B"/>
          </linearGradient>
          <linearGradient id="paint25_linear_1871_25123" x1="420.904" y1="153.785" x2="415.887" y2="229.925" gradientUnits="userSpaceOnUse">
          <stop stop-color="#E5A24B"/>
          <stop offset="0.255189" stop-color="#C17C34"/>
          <stop offset="0.414374" stop-color="#FFFAB1"/>
          <stop offset="0.665702" stop-color="#A45F12"/>
          <stop offset="0.770773" stop-color="#B4963F"/>
          <stop offset="0.990385" stop-color="#581500"/>
          </linearGradient>
          <linearGradient id="paint26_linear_1871_25123" x1="219.226" y1="22.8704" x2="214.159" y2="251.225" gradientUnits="userSpaceOnUse">
          <stop stop-color="#E5A24B"/>
          <stop offset="0.0774252" stop-color="#C17C34"/>
          <stop offset="0.211845" stop-color="#FFFAB1"/>
          <stop offset="0.677885" stop-color="#A45F12"/>
          <stop offset="0.826923" stop-color="#B4963F"/>
          <stop offset="0.990385" stop-color="#581500"/>
          </linearGradient>
          <linearGradient id="paint27_linear_1871_25123" x1="218.181" y1="136.698" x2="217.431" y2="240.541" gradientUnits="userSpaceOnUse">
          <stop stop-color="#E5A24B"/>
          <stop offset="0.0774252" stop-color="#C17C34"/>
          <stop offset="0.211845" stop-color="#FFFAB1"/>
          <stop offset="0.677885" stop-color="#A45F12"/>
          <stop offset="0.826923" stop-color="#B4963F"/>
          <stop offset="0.990385" stop-color="#581500"/>
          </linearGradient>
          <linearGradient id="paint28_linear_1871_25123" x1="219.532" y1="124.926" x2="218.153" y2="254.251" gradientUnits="userSpaceOnUse">
          <stop stop-color="#E5A24B"/>
          <stop offset="0.0774252" stop-color="#C17C34"/>
          <stop offset="0.211845" stop-color="#FFFAB1"/>
          <stop offset="0.677885" stop-color="#A45F12"/>
          <stop offset="0.826923" stop-color="#B4963F"/>
          <stop offset="0.990385" stop-color="#581500"/>
          </linearGradient>
          <linearGradient id="paint29_linear_1871_25123" x1="227.767" y1="177.494" x2="227.767" y2="200.313" gradientUnits="userSpaceOnUse">
          <stop stop-color="#461099"/>
          <stop offset="1" stop-color="#270659"/>
          </linearGradient>
          <linearGradient id="paint30_linear_1871_25123" x1="423.498" y1="124.355" x2="441.327" y2="126.342" gradientUnits="userSpaceOnUse">
          <stop offset="0.194227" stop-color="#DA8207"/>
          <stop offset="0.316406" stop-color="#FFB748"/>
          <stop offset="0.411819" stop-color="#FFC96E"/>
          <stop offset="0.486203" stop-color="#E39C1E"/>
          <stop offset="0.579874" stop-color="#976100"/>
          </linearGradient>
          <radialGradient id="paint31_radial_1871_25123" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(437.52 45.5681) rotate(90) scale(16.1655)">
          <stop stop-color="#FFD0C1"/>
          <stop offset="0.420905" stop-color="#DA4D41"/>
          <stop offset="1" stop-color="#A50202"/>
          </radialGradient>
          <linearGradient id="paint32_linear_1871_25123" x1="69.1368" y1="217.022" x2="72.076" y2="142.072" gradientUnits="userSpaceOnUse">
          <stop stop-color="#100D0E"/>
          <stop offset="0.415923" stop-color="#5C6264"/>
          <stop offset="1" stop-color="#100D0E"/>
          </linearGradient>
          <linearGradient id="paint33_linear_1871_25123" x1="70.1165" y1="188.609" x2="61.9648" y2="188.609" gradientUnits="userSpaceOnUse">
          <stop/>
          <stop offset="1"/>
          </linearGradient>
          <linearGradient id="paint34_linear_1871_25123" x1="369.92" y1="218.001" x2="366.981" y2="143.052" gradientUnits="userSpaceOnUse">
          <stop stop-color="#100D0E"/>
          <stop offset="0.415923" stop-color="#5C6264"/>
          <stop offset="1" stop-color="#100D0E"/>
          </linearGradient>
          <linearGradient id="paint35_linear_1871_25123" x1="368.94" y1="189.589" x2="377.092" y2="189.589" gradientUnits="userSpaceOnUse">
          <stop/>
          <stop offset="1"/>
          </linearGradient>
          <linearGradient id="paint36_linear_1871_25123" x1="223.452" y1="132.275" x2="223.452" y2="149.91" gradientUnits="userSpaceOnUse">
          <stop stop-color="#5E1DBB"/>
          <stop offset="1" stop-color="#9364ED"/>
          </linearGradient>
          <linearGradient id="paint37_linear_1871_25123" x1="223.452" y1="244.943" x2="223.452" y2="227.308" gradientUnits="userSpaceOnUse">
          <stop stop-color="#5E1DBB"/>
          <stop offset="1" stop-color="#9364ED"/>
          </linearGradient>
          <linearGradient id="paint38_linear_1871_25123" x1="97.3919" y1="61.2441" x2="97.3919" y2="84.442" gradientUnits="userSpaceOnUse">
          <stop stop-color="#FBF25E"/>
          <stop offset="0.483653" stop-color="#C7A55E"/>
          <stop offset="1" stop-color="#F9EF4B"/>
          </linearGradient>
          <linearGradient id="paint39_linear_1871_25123" x1="97.3897" y1="66.2153" x2="97.3897" y2="79.4713" gradientUnits="userSpaceOnUse">
          <stop stop-color="#FFFAA8"/>
          <stop offset="0.510316" stop-color="#FFFAA8"/>
          </linearGradient>
          <linearGradient id="paint40_linear_1871_25123" x1="127.767" y1="32.832" x2="127.767" y2="56.0299" gradientUnits="userSpaceOnUse">
          <stop stop-color="#FBF25E"/>
          <stop offset="0.483653" stop-color="#C7A55E"/>
          <stop offset="1" stop-color="#F9EF4B"/>
          </linearGradient>
          <linearGradient id="paint41_linear_1871_25123" x1="127.765" y1="37.8032" x2="127.765" y2="51.0592" gradientUnits="userSpaceOnUse">
          <stop stop-color="#FFFAA8"/>
          <stop offset="0.510316" stop-color="#FFFAA8"/>
          </linearGradient>
          <linearGradient id="paint42_linear_1871_25123" x1="78.7825" y1="99.4536" x2="78.7825" y2="122.652" gradientUnits="userSpaceOnUse">
          <stop stop-color="#FBF25E"/>
          <stop offset="0.483653" stop-color="#C7A55E"/>
          <stop offset="1" stop-color="#F9EF4B"/>
          </linearGradient>
          <linearGradient id="paint43_linear_1871_25123" x1="78.7803" y1="104.425" x2="78.7803" y2="117.681" gradientUnits="userSpaceOnUse">
          <stop stop-color="#FFFAA8"/>
          <stop offset="0.510316" stop-color="#FFFAA8"/>
          </linearGradient>
          <linearGradient id="paint44_linear_1871_25123" x1="172.829" y1="12.2583" x2="172.829" y2="35.4562" gradientUnits="userSpaceOnUse">
          <stop stop-color="#FBF25E"/>
          <stop offset="0.483653" stop-color="#C7A55E"/>
          <stop offset="1" stop-color="#F9EF4B"/>
          </linearGradient>
          <linearGradient id="paint45_linear_1871_25123" x1="172.843" y1="17.2285" x2="172.843" y2="30.4845" gradientUnits="userSpaceOnUse">
          <stop stop-color="#FFFAA8"/>
          <stop offset="0.510316" stop-color="#FFFAA8"/>
          </linearGradient>
          <linearGradient id="paint46_linear_1871_25123" x1="218.884" y1="6.3794" x2="218.884" y2="29.5773" gradientUnits="userSpaceOnUse">
          <stop stop-color="#FBF25E"/>
          <stop offset="0.483653" stop-color="#C7A55E"/>
          <stop offset="1" stop-color="#F9EF4B"/>
          </linearGradient>
          <linearGradient id="paint47_linear_1871_25123" x1="218.882" y1="11.3506" x2="218.882" y2="24.6065" gradientUnits="userSpaceOnUse">
          <stop stop-color="#FFFAA8"/>
          <stop offset="0.510316" stop-color="#FFFAA8"/>
          </linearGradient>
          <linearGradient id="paint48_linear_1871_25123" x1="268.845" y1="14.2173" x2="268.845" y2="37.4152" gradientUnits="userSpaceOnUse">
          <stop stop-color="#FBF25E"/>
          <stop offset="0.483653" stop-color="#C7A55E"/>
          <stop offset="1" stop-color="#F9EF4B"/>
          </linearGradient>
          <linearGradient id="paint49_linear_1871_25123" x1="268.858" y1="19.1885" x2="268.858" y2="32.4444" gradientUnits="userSpaceOnUse">
          <stop stop-color="#FFFAA8"/>
          <stop offset="0.510316" stop-color="#FFFAA8"/>
          </linearGradient>
          <linearGradient id="paint50_linear_1871_25123" x1="310.97" y1="34.791" x2="310.97" y2="57.9889" gradientUnits="userSpaceOnUse">
          <stop stop-color="#FBF25E"/>
          <stop offset="0.483653" stop-color="#C7A55E"/>
          <stop offset="1" stop-color="#F9EF4B"/>
          </linearGradient>
          <linearGradient id="paint51_linear_1871_25123" x1="310.983" y1="39.7622" x2="310.983" y2="53.0181" gradientUnits="userSpaceOnUse">
          <stop stop-color="#FFFAA8"/>
          <stop offset="0.510316" stop-color="#FFFAA8"/>
          </linearGradient>
          <linearGradient id="paint52_linear_1871_25123" x1="357.025" y1="99.4536" x2="357.025" y2="122.652" gradientUnits="userSpaceOnUse">
          <stop stop-color="#FBF25E"/>
          <stop offset="0.483653" stop-color="#C7A55E"/>
          <stop offset="1" stop-color="#F9EF4B"/>
          </linearGradient>
          <linearGradient id="paint53_linear_1871_25123" x1="357.023" y1="104.425" x2="357.023" y2="117.681" gradientUnits="userSpaceOnUse">
          <stop stop-color="#FFFAA8"/>
          <stop offset="0.510316" stop-color="#FFFAA8"/>
          </linearGradient>
          <linearGradient id="paint54_linear_1871_25123" x1="338.408" y1="61.2441" x2="338.408" y2="84.442" gradientUnits="userSpaceOnUse">
          <stop stop-color="#FBF25E"/>
          <stop offset="0.483653" stop-color="#C7A55E"/>
          <stop offset="1" stop-color="#F9EF4B"/>
          </linearGradient>
          <linearGradient id="paint55_linear_1871_25123" x1="338.421" y1="66.2153" x2="338.421" y2="79.4713" gradientUnits="userSpaceOnUse">
          <stop stop-color="#FFFAA8"/>
          <stop offset="0.510316" stop-color="#FFFAA8"/>
          </linearGradient>
          </defs>
          </svg>
          <button className="winning-claim-btn" onClick= {() => navigate("/mywins")} >Go to Winnings Claim</button>
          </div>

         <svg width="20" height="20" viewBox="0 0 70 1" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M29.3574 54.5839C44.0498 53.8233 55.3437 41.2961 54.5831 26.6037C53.8225 11.9113 41.2953 0.617388 26.6029 1.37801C11.9105 2.13864 0.616609 14.6658 1.37724 29.3582C2.13786 44.0506 14.665 55.3445 29.3574 54.5839Z" fill="url(#paint0_linear_1871_25233)"/>
          <path d="M54.5834 26.6033C54.4819 24.6437 54.1692 22.7452 53.6718 20.927L41.4658 21.5589L49.6499 12.4811C48.5518 10.949 47.2751 9.50963 45.8177 8.19568C44.3602 6.88173 42.7967 5.76043 41.1594 4.82646L32.9752 13.9042L32.3433 1.69802C30.4835 1.39108 28.5629 1.27606 26.6032 1.37751C24.6435 1.47896 22.7451 1.7917 20.9269 2.28905L21.5588 14.4951L12.4809 6.31101C10.9487 7.40907 9.50935 8.68583 8.19541 10.1434C6.88146 11.6008 5.76016 13.1643 4.82619 14.8017L13.904 22.9858L1.69775 23.6177C1.39081 25.4776 1.27579 27.3982 1.37724 29.3578C1.47869 31.3175 1.79143 33.2159 2.28878 35.0342L14.4949 34.4023L6.31073 43.48C7.40879 45.0122 8.68555 46.4515 10.143 47.7655C11.6004 49.0794 13.1639 50.2007 14.8013 51.1348L22.9854 42.0571L23.6173 54.2632C25.4772 54.5701 27.3978 54.6851 29.3574 54.5837C31.3171 54.4822 33.2155 54.1695 35.0338 53.6721L34.4019 41.466L43.4796 49.6502C45.0118 48.5521 46.4511 47.2753 47.7651 45.8178C49.079 44.3604 50.2003 42.7968 51.1343 41.1595L42.0565 32.9754L54.2626 32.3435C54.5698 30.4836 54.6848 28.563 54.5834 26.6033Z" fill="url(#paint1_linear_1871_25233)"/>
          <path d="M29.2519 52.3872C42.7303 51.6895 53.091 40.1974 52.3932 26.7191C51.6954 13.2407 40.2034 2.87998 26.725 3.57775C13.2467 4.27553 2.88597 15.7676 3.58375 29.2459C4.28152 42.7243 15.7736 53.085 29.2519 52.3872Z" fill="url(#paint2_linear_1871_25233)"/>
          <path d="M28.9856 47.2282C39.6132 46.678 47.7827 37.6165 47.2325 26.9888C46.6823 16.3612 37.6208 8.19175 26.9931 8.74194C16.3654 9.29214 8.19602 18.3536 8.74622 28.9813C9.29641 39.609 18.3579 47.7784 28.9856 47.2282Z" fill="url(#paint3_linear_1871_25233)"/>
          <path d="M29.363 54.583C44.0554 53.8224 55.3493 41.2952 54.5887 26.6028L1.38281 29.3573C2.14344 44.0497 14.6706 55.3436 29.363 54.583Z" fill="url(#paint4_linear_1871_25233)"/>
          <path d="M54.1284 33.112L35.5108 16.3271L19.2484 19.1054L23.892 23.2919L19.8787 25.5868L24.2551 29.5324L24.4487 33.2722L31.3932 39.5331L30.5536 41.2863L41.3569 51.0262C47.9055 47.2187 52.6427 40.7138 54.1284 33.112Z" fill="url(#paint5_linear_1871_25233)"/>
          <path d="M34.4814 21.8965L32.0275 22.0235C31.7419 21.0405 31.273 20.1392 30.6611 19.3561L34.3401 19.1657C35.2779 19.1171 35.9987 18.3175 35.9502 17.3798C35.9016 16.4421 35.1021 15.7212 34.1643 15.7698L23.9768 16.2972L20.5809 16.473C19.6432 16.5215 18.9223 17.3211 18.9709 18.2588C19.0194 19.1966 19.819 19.9174 20.7567 19.8689L24.1526 19.6931C26.015 19.5967 27.677 20.6387 28.4636 22.208L20.8981 22.5997C19.9604 22.6482 19.2395 23.4478 19.2881 24.3855C19.3366 25.3233 20.1362 26.0441 21.0739 25.9956L28.7383 25.5988C28.1855 27.3665 26.5789 28.6928 24.6236 28.794L21.2278 28.9698C20.541 29.0053 19.9434 29.4511 19.7133 30.0992C19.4834 30.7473 19.6665 31.47 20.1772 31.9305L30.5562 41.2878C30.9049 41.6021 31.3479 41.7454 31.7826 41.7229C32.2172 41.7004 32.6431 41.5122 32.9575 41.1635C33.5862 40.4661 33.5305 39.391 32.8332 38.7623L25.4729 32.1263C28.996 31.6441 31.7445 28.8665 32.2576 25.4165L34.657 25.2922C35.5948 25.2437 36.3156 24.4441 36.2671 23.5064C36.2185 22.5687 35.4191 21.8479 34.4814 21.8965Z" fill="#F8A836"/>
          <defs>
          <linearGradient id="paint0_linear_1871_25233" x1="13.5405" y1="14.9627" x2="47.281" y2="45.3816" gradientUnits="userSpaceOnUse">
          <stop stop-color="#FEE45A"/>
          <stop offset="1" stop-color="#FEA613"/>
          </linearGradient>
          <linearGradient id="paint1_linear_1871_25233" x1="12.8943" y1="-29.9134" x2="54.7057" y2="130.542" gradientUnits="userSpaceOnUse">
          <stop stop-color="#FEA613" stop-opacity="0"/>
          <stop offset="1" stop-color="#E94444"/>
          </linearGradient>
          <linearGradient id="paint2_linear_1871_25233" x1="14.742" y1="16.04" x2="45.6944" y2="43.9454" gradientUnits="userSpaceOnUse">
          <stop stop-color="#FEE45A"/>
          <stop offset="1" stop-color="#FEA613"/>
          </linearGradient>
          <linearGradient id="paint3_linear_1871_25233" x1="42.7997" y1="41.3374" x2="14.1312" y2="15.4912" gradientUnits="userSpaceOnUse">
          <stop stop-color="#FEE45A"/>
          <stop offset="1" stop-color="#FEA613"/>
          </linearGradient>
          <linearGradient id="paint4_linear_1871_25233" x1="28.3092" y1="34.2284" x2="29.6244" y2="59.6325" gradientUnits="userSpaceOnUse">
          <stop stop-color="#FEA613" stop-opacity="0"/>
          <stop offset="1" stop-color="#E94444"/>
          </linearGradient>
          <linearGradient id="paint5_linear_1871_25233" x1="51.483" y1="45.2287" x2="14.3708" y2="12.3742" gradientUnits="userSpaceOnUse">
          <stop stop-color="#FEA613" stop-opacity="0"/>
          <stop offset="1" stop-color="#E94444"/>
          </linearGradient>
          </defs>
          </svg>
          <svg width="35" height="35" viewBox="0 0 70 109" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M29.3574 54.5839C44.0498 53.8233 55.3437 41.2961 54.5831 26.6037C53.8225 11.9113 41.2953 0.617388 26.6029 1.37801C11.9105 2.13864 0.616609 14.6658 1.37724 29.3582C2.13786 44.0506 14.665 55.3445 29.3574 54.5839Z" fill="url(#paint0_linear_1871_25233)"/>
          <path d="M54.5834 26.6033C54.4819 24.6437 54.1692 22.7452 53.6718 20.927L41.4658 21.5589L49.6499 12.4811C48.5518 10.949 47.2751 9.50963 45.8177 8.19568C44.3602 6.88173 42.7967 5.76043 41.1594 4.82646L32.9752 13.9042L32.3433 1.69802C30.4835 1.39108 28.5629 1.27606 26.6032 1.37751C24.6435 1.47896 22.7451 1.7917 20.9269 2.28905L21.5588 14.4951L12.4809 6.31101C10.9487 7.40907 9.50935 8.68583 8.19541 10.1434C6.88146 11.6008 5.76016 13.1643 4.82619 14.8017L13.904 22.9858L1.69775 23.6177C1.39081 25.4776 1.27579 27.3982 1.37724 29.3578C1.47869 31.3175 1.79143 33.2159 2.28878 35.0342L14.4949 34.4023L6.31073 43.48C7.40879 45.0122 8.68555 46.4515 10.143 47.7655C11.6004 49.0794 13.1639 50.2007 14.8013 51.1348L22.9854 42.0571L23.6173 54.2632C25.4772 54.5701 27.3978 54.6851 29.3574 54.5837C31.3171 54.4822 33.2155 54.1695 35.0338 53.6721L34.4019 41.466L43.4796 49.6502C45.0118 48.5521 46.4511 47.2753 47.7651 45.8178C49.079 44.3604 50.2003 42.7968 51.1343 41.1595L42.0565 32.9754L54.2626 32.3435C54.5698 30.4836 54.6848 28.563 54.5834 26.6033Z" fill="url(#paint1_linear_1871_25233)"/>
          <path d="M29.2519 52.3872C42.7303 51.6895 53.091 40.1974 52.3932 26.7191C51.6954 13.2407 40.2034 2.87998 26.725 3.57775C13.2467 4.27553 2.88597 15.7676 3.58375 29.2459C4.28152 42.7243 15.7736 53.085 29.2519 52.3872Z" fill="url(#paint2_linear_1871_25233)"/>
          <path d="M28.9856 47.2282C39.6132 46.678 47.7827 37.6165 47.2325 26.9888C46.6823 16.3612 37.6208 8.19175 26.9931 8.74194C16.3654 9.29214 8.19602 18.3536 8.74622 28.9813C9.29641 39.609 18.3579 47.7784 28.9856 47.2282Z" fill="url(#paint3_linear_1871_25233)"/>
          <path d="M29.363 54.583C44.0554 53.8224 55.3493 41.2952 54.5887 26.6028L1.38281 29.3573C2.14344 44.0497 14.6706 55.3436 29.363 54.583Z" fill="url(#paint4_linear_1871_25233)"/>
          <path d="M54.1284 33.112L35.5108 16.3271L19.2484 19.1054L23.892 23.2919L19.8787 25.5868L24.2551 29.5324L24.4487 33.2722L31.3932 39.5331L30.5536 41.2863L41.3569 51.0262C47.9055 47.2187 52.6427 40.7138 54.1284 33.112Z" fill="url(#paint5_linear_1871_25233)"/>
          <path d="M34.4814 21.8965L32.0275 22.0235C31.7419 21.0405 31.273 20.1392 30.6611 19.3561L34.3401 19.1657C35.2779 19.1171 35.9987 18.3175 35.9502 17.3798C35.9016 16.4421 35.1021 15.7212 34.1643 15.7698L23.9768 16.2972L20.5809 16.473C19.6432 16.5215 18.9223 17.3211 18.9709 18.2588C19.0194 19.1966 19.819 19.9174 20.7567 19.8689L24.1526 19.6931C26.015 19.5967 27.677 20.6387 28.4636 22.208L20.8981 22.5997C19.9604 22.6482 19.2395 23.4478 19.2881 24.3855C19.3366 25.3233 20.1362 26.0441 21.0739 25.9956L28.7383 25.5988C28.1855 27.3665 26.5789 28.6928 24.6236 28.794L21.2278 28.9698C20.541 29.0053 19.9434 29.4511 19.7133 30.0992C19.4834 30.7473 19.6665 31.47 20.1772 31.9305L30.5562 41.2878C30.9049 41.6021 31.3479 41.7454 31.7826 41.7229C32.2172 41.7004 32.6431 41.5122 32.9575 41.1635C33.5862 40.4661 33.5305 39.391 32.8332 38.7623L25.4729 32.1263C28.996 31.6441 31.7445 28.8665 32.2576 25.4165L34.657 25.2922C35.5948 25.2437 36.3156 24.4441 36.2671 23.5064C36.2185 22.5687 35.4191 21.8479 34.4814 21.8965Z" fill="#F8A836"/>
          <defs>
          <linearGradient id="paint0_linear_1871_25233" x1="13.5405" y1="14.9627" x2="47.281" y2="45.3816" gradientUnits="userSpaceOnUse">
          <stop stop-color="#FEE45A"/>
          <stop offset="1" stop-color="#FEA613"/>
          </linearGradient>
          <linearGradient id="paint1_linear_1871_25233" x1="12.8943" y1="-29.9134" x2="54.7057" y2="130.542" gradientUnits="userSpaceOnUse">
          <stop stop-color="#FEA613" stop-opacity="0"/>
          <stop offset="1" stop-color="#E94444"/>
          </linearGradient>
          <linearGradient id="paint2_linear_1871_25233" x1="14.742" y1="16.04" x2="45.6944" y2="43.9454" gradientUnits="userSpaceOnUse">
          <stop stop-color="#FEE45A"/>
          <stop offset="1" stop-color="#FEA613"/>
          </linearGradient>
          <linearGradient id="paint3_linear_1871_25233" x1="42.7997" y1="41.3374" x2="14.1312" y2="15.4912" gradientUnits="userSpaceOnUse">
          <stop stop-color="#FEE45A"/>
          <stop offset="1" stop-color="#FEA613"/>
          </linearGradient>
          <linearGradient id="paint4_linear_1871_25233" x1="28.3092" y1="34.2284" x2="29.6244" y2="59.6325" gradientUnits="userSpaceOnUse">
          <stop stop-color="#FEA613" stop-opacity="0"/>
          <stop offset="1" stop-color="#E94444"/>
          </linearGradient>
          <linearGradient id="paint5_linear_1871_25233" x1="51.483" y1="45.2287" x2="14.3708" y2="12.3742" gradientUnits="userSpaceOnUse">
          <stop stop-color="#FEA613" stop-opacity="0"/>
          <stop offset="1" stop-color="#E94444"/>
          </linearGradient>
          </defs>
          </svg>
          <svg width="53" height="53" viewBox="0 0 70 1" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M29.3574 54.5839C44.0498 53.8233 55.3437 41.2961 54.5831 26.6037C53.8225 11.9113 41.2953 0.617388 26.6029 1.37801C11.9105 2.13864 0.616609 14.6658 1.37724 29.3582C2.13786 44.0506 14.665 55.3445 29.3574 54.5839Z" fill="url(#paint0_linear_1871_25233)"/>
          <path d="M54.5834 26.6033C54.4819 24.6437 54.1692 22.7452 53.6718 20.927L41.4658 21.5589L49.6499 12.4811C48.5518 10.949 47.2751 9.50963 45.8177 8.19568C44.3602 6.88173 42.7967 5.76043 41.1594 4.82646L32.9752 13.9042L32.3433 1.69802C30.4835 1.39108 28.5629 1.27606 26.6032 1.37751C24.6435 1.47896 22.7451 1.7917 20.9269 2.28905L21.5588 14.4951L12.4809 6.31101C10.9487 7.40907 9.50935 8.68583 8.19541 10.1434C6.88146 11.6008 5.76016 13.1643 4.82619 14.8017L13.904 22.9858L1.69775 23.6177C1.39081 25.4776 1.27579 27.3982 1.37724 29.3578C1.47869 31.3175 1.79143 33.2159 2.28878 35.0342L14.4949 34.4023L6.31073 43.48C7.40879 45.0122 8.68555 46.4515 10.143 47.7655C11.6004 49.0794 13.1639 50.2007 14.8013 51.1348L22.9854 42.0571L23.6173 54.2632C25.4772 54.5701 27.3978 54.6851 29.3574 54.5837C31.3171 54.4822 33.2155 54.1695 35.0338 53.6721L34.4019 41.466L43.4796 49.6502C45.0118 48.5521 46.4511 47.2753 47.7651 45.8178C49.079 44.3604 50.2003 42.7968 51.1343 41.1595L42.0565 32.9754L54.2626 32.3435C54.5698 30.4836 54.6848 28.563 54.5834 26.6033Z" fill="url(#paint1_linear_1871_25233)"/>
          <path d="M29.2519 52.3872C42.7303 51.6895 53.091 40.1974 52.3932 26.7191C51.6954 13.2407 40.2034 2.87998 26.725 3.57775C13.2467 4.27553 2.88597 15.7676 3.58375 29.2459C4.28152 42.7243 15.7736 53.085 29.2519 52.3872Z" fill="url(#paint2_linear_1871_25233)"/>
          <path d="M28.9856 47.2282C39.6132 46.678 47.7827 37.6165 47.2325 26.9888C46.6823 16.3612 37.6208 8.19175 26.9931 8.74194C16.3654 9.29214 8.19602 18.3536 8.74622 28.9813C9.29641 39.609 18.3579 47.7784 28.9856 47.2282Z" fill="url(#paint3_linear_1871_25233)"/>
          <path d="M29.363 54.583C44.0554 53.8224 55.3493 41.2952 54.5887 26.6028L1.38281 29.3573C2.14344 44.0497 14.6706 55.3436 29.363 54.583Z" fill="url(#paint4_linear_1871_25233)"/>
          <path d="M54.1284 33.112L35.5108 16.3271L19.2484 19.1054L23.892 23.2919L19.8787 25.5868L24.2551 29.5324L24.4487 33.2722L31.3932 39.5331L30.5536 41.2863L41.3569 51.0262C47.9055 47.2187 52.6427 40.7138 54.1284 33.112Z" fill="url(#paint5_linear_1871_25233)"/>
          <path d="M34.4814 21.8965L32.0275 22.0235C31.7419 21.0405 31.273 20.1392 30.6611 19.3561L34.3401 19.1657C35.2779 19.1171 35.9987 18.3175 35.9502 17.3798C35.9016 16.4421 35.1021 15.7212 34.1643 15.7698L23.9768 16.2972L20.5809 16.473C19.6432 16.5215 18.9223 17.3211 18.9709 18.2588C19.0194 19.1966 19.819 19.9174 20.7567 19.8689L24.1526 19.6931C26.015 19.5967 27.677 20.6387 28.4636 22.208L20.8981 22.5997C19.9604 22.6482 19.2395 23.4478 19.2881 24.3855C19.3366 25.3233 20.1362 26.0441 21.0739 25.9956L28.7383 25.5988C28.1855 27.3665 26.5789 28.6928 24.6236 28.794L21.2278 28.9698C20.541 29.0053 19.9434 29.4511 19.7133 30.0992C19.4834 30.7473 19.6665 31.47 20.1772 31.9305L30.5562 41.2878C30.9049 41.6021 31.3479 41.7454 31.7826 41.7229C32.2172 41.7004 32.6431 41.5122 32.9575 41.1635C33.5862 40.4661 33.5305 39.391 32.8332 38.7623L25.4729 32.1263C28.996 31.6441 31.7445 28.8665 32.2576 25.4165L34.657 25.2922C35.5948 25.2437 36.3156 24.4441 36.2671 23.5064C36.2185 22.5687 35.4191 21.8479 34.4814 21.8965Z" fill="#F8A836"/>
          <defs>
          <linearGradient id="paint0_linear_1871_25233" x1="13.5405" y1="14.9627" x2="47.281" y2="45.3816" gradientUnits="userSpaceOnUse">
          <stop stop-color="#FEE45A"/>
          <stop offset="1" stop-color="#FEA613"/>
          </linearGradient>
          <linearGradient id="paint1_linear_1871_25233" x1="12.8943" y1="-29.9134" x2="54.7057" y2="130.542" gradientUnits="userSpaceOnUse">
          <stop stop-color="#FEA613" stop-opacity="0"/>
          <stop offset="1" stop-color="#E94444"/>
          </linearGradient>
          <linearGradient id="paint2_linear_1871_25233" x1="14.742" y1="16.04" x2="45.6944" y2="43.9454" gradientUnits="userSpaceOnUse">
          <stop stop-color="#FEE45A"/>
          <stop offset="1" stop-color="#FEA613"/>
          </linearGradient>
          <linearGradient id="paint3_linear_1871_25233" x1="42.7997" y1="41.3374" x2="14.1312" y2="15.4912" gradientUnits="userSpaceOnUse">
          <stop stop-color="#FEE45A"/>
          <stop offset="1" stop-color="#FEA613"/>
          </linearGradient>
          <linearGradient id="paint4_linear_1871_25233" x1="28.3092" y1="34.2284" x2="29.6244" y2="59.6325" gradientUnits="userSpaceOnUse">
          <stop stop-color="#FEA613" stop-opacity="0"/>
          <stop offset="1" stop-color="#E94444"/>
          </linearGradient>
          <linearGradient id="paint5_linear_1871_25233" x1="51.483" y1="45.2287" x2="14.3708" y2="12.3742" gradientUnits="userSpaceOnUse">
          <stop stop-color="#FEA613" stop-opacity="0"/>
          <stop offset="1" stop-color="#E94444"/>
          </linearGradient>
          </defs>
          </svg>
          <svg width="76" height="76" viewBox="0 0 109 109" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M80.4881 81.9664C95.8495 67.4209 96.511 43.1766 81.9656 27.8151C67.4201 12.4537 43.1758 11.7922 27.8144 26.3376C12.4529 40.8831 11.7914 65.1274 26.3369 80.4889C40.8823 95.8503 65.1266 96.5118 80.4881 81.9664Z" fill="url(#paint0_linear_1871_25222)"/>
              <path d="M81.966 27.8145C80.0259 25.7656 77.9119 23.9809 75.6708 22.4562L62.9089 34.5402L63.3882 16.9716C60.7571 16.3206 58.017 15.9378 55.1964 15.8608C52.3758 15.7839 49.6189 16.0167 46.9562 16.5233L46.4768 34.0919L34.3927 21.3298C32.0718 22.73 29.8635 24.3968 27.8146 26.3369C25.7657 28.2769 23.981 30.391 22.4563 32.6321L34.5403 45.394L16.9716 44.9148C16.3205 47.546 15.9378 50.286 15.8609 53.1068C15.784 55.9274 16.0168 58.6842 16.5234 61.347L34.092 61.8263L21.3299 73.9105C22.7301 76.2314 24.3969 78.4396 26.337 80.4885C28.2771 82.5374 30.3911 84.3221 32.6322 85.8468L45.3941 73.7628L44.9148 91.3314C47.5459 91.9825 50.286 92.3653 53.1066 92.4422C55.9272 92.5192 58.6841 92.2864 61.347 91.7799L61.8263 74.2113L73.9103 86.9732C76.2312 85.573 78.4394 83.9062 80.4883 81.9661C82.5372 80.0261 84.322 77.912 85.8467 75.6709L73.7627 62.909L91.3313 63.3884C91.9823 60.7572 92.3651 58.0171 92.4419 55.1964C92.5189 52.3758 92.2861 49.6189 91.7795 46.9562L74.2109 46.4768L86.9728 34.3928C85.5729 32.0716 83.9061 29.8634 81.966 27.8145Z" fill="url(#paint1_linear_1871_25222)"/>
              <path d="M78.3217 79.6622C92.4139 66.3186 93.0207 44.0776 79.6771 29.9855C66.3336 15.8933 44.0926 15.2865 30.0004 28.6301C15.9083 41.9736 15.3015 64.2146 28.645 78.3068C41.9886 92.3989 64.2296 93.0057 78.3217 79.6622Z" fill="url(#paint2_linear_1871_25222)"/>
              <path d="M73.2129 74.2694C84.3245 63.748 84.803 46.211 74.2816 35.0993C63.7603 23.9877 46.2232 23.5092 35.1116 34.0306C23.9999 44.552 23.5215 62.089 34.0428 73.2006C44.5642 84.3123 62.1013 84.7908 73.2129 74.2694Z" fill="url(#paint3_linear_1871_25222)"/>
              <path d="M80.4872 81.966C95.8486 67.4205 96.5101 43.1762 81.9647 27.8147L26.3359 80.4885C40.8814 95.8499 65.1257 96.5114 80.4872 81.966Z" fill="url(#paint4_linear_1871_25222)"/>
              <path d="M87.5452 35.3574L51.5137 34.3743L36.3182 52.5921L45.3051 52.8373L43.0571 59.0936L51.5269 59.3247L55.2293 63.2348L68.6693 63.6015L69.3874 66.303L90.2956 66.8734C93.9049 56.5964 93.0154 45.0594 87.5452 35.3574Z" fill="url(#paint5_linear_1871_25222)"/>
              <path d="M55.5817 41.4306L53.0161 43.8599C51.7862 43.0513 50.432 42.503 49.0318 42.2176L52.8784 38.5753C53.8588 37.647 53.901 36.0995 52.9727 35.1191C52.0444 34.1387 50.4969 34.0965 49.5165 35.0248L38.865 45.1104L35.3145 48.4724C34.3341 49.4007 34.2919 50.9482 35.2202 51.9286C36.1485 52.909 37.696 52.9512 38.6764 52.0229L42.227 48.661C44.1741 46.8172 46.9647 46.4058 49.2899 47.3882L41.3799 54.878C40.3995 55.8064 40.3573 57.3539 41.2856 58.3343C42.214 59.3147 43.7614 59.3569 44.7418 58.4286L52.7553 50.8408C53.8005 53.2904 53.2809 56.2408 51.2367 58.1764L47.6862 61.5383C46.9681 62.2182 46.7305 63.2636 47.0838 64.1873C47.4371 65.1109 48.3119 65.7304 49.3004 65.7576L69.3873 66.3056C70.0622 66.324 70.6806 66.0672 71.135 65.6369C71.5894 65.2066 71.8796 64.6032 71.898 63.9283C71.9348 62.5787 70.8705 61.4547 69.5208 61.4178L55.276 61.0289C58.6796 57.213 59.0936 51.6094 56.4347 47.3566L58.9434 44.9812C59.9238 44.0528 59.966 42.5053 59.0377 41.5249C58.1093 40.5445 56.5622 40.5023 55.5817 41.4306Z" fill="#F8A836"/>
              <defs>
              <linearGradient id="paint0_linear_1871_25222" x1="26.2055" y1="53.3895" x2="91.5048" y2="55.171" gradientUnits="userSpaceOnUse">
              <stop stop-color="#FEE45A"/>
              <stop offset="1" stop-color="#FEA613"/>
              </linearGradient>
              <linearGradient id="paint1_linear_1871_25222" x1="-16.3869" y1="4.9045" x2="179.113" y2="141.394" gradientUnits="userSpaceOnUse">
              <stop stop-color="#FEA613" stop-opacity="0"/>
              <stop offset="1" stop-color="#E94444"/>
              </linearGradient>
              <linearGradient id="paint2_linear_1871_25222" x1="28.5246" y1="53.4466" x2="88.4281" y2="55.0811" gradientUnits="userSpaceOnUse">
              <stop stop-color="#FEE45A"/>
              <stop offset="1" stop-color="#FEA613"/>
              </linearGradient>
              <linearGradient id="paint3_linear_1871_25222" x1="82.8254" y1="54.932" x2="27.342" y2="53.4182" gradientUnits="userSpaceOnUse">
              <stop stop-color="#FEE45A"/>
              <stop offset="1" stop-color="#FEA613"/>
              </linearGradient>
              <linearGradient id="paint4_linear_1871_25222" x1="60.3362" y1="60.6845" x2="85.4861" y2="87.2454" gradientUnits="userSpaceOnUse">
              <stop stop-color="#FEA613" stop-opacity="0"/>
              <stop offset="1" stop-color="#E94444"/>
              </linearGradient>
              <linearGradient id="paint5_linear_1871_25222" x1="95.9608" y1="51.0805" x2="24.7" y2="49.7817" gradientUnits="userSpaceOnUse">
              <stop stop-color="#FEA613" stop-opacity="0"/>
              <stop offset="1" stop-color="#E94444"/>
              </linearGradient>
              </defs>
          </svg>
          <svg width="232" height="100" viewBox="0 0 232 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M144.349 134.529C144.349 134.529 158.402 118.558 171.209 121.654L252.703 141.357C253.891 141.643 255.086 140.914 255.373 139.726C255.659 138.538 254.93 137.343 253.742 137.056L172.248 117.353C159.441 114.257 154.236 93.6302 154.236 93.6302L144.349 134.529Z" fill="#78A9EF"/>
            <path d="M147.1 123.117C150.912 119.993 156.49 119.2 161.232 120.202C156.488 121.166 151.746 121.771 147.1 123.117Z" fill="white"/>
            <path d="M151.488 105.048C155.007 108.369 158.947 111.072 162.728 114.097C158.053 112.823 153.451 109.567 151.488 105.048Z" fill="white"/>
            <path d="M149.699 114.188C154.905 114.459 159.911 115.662 164.664 117.806C159.457 117.543 154.454 116.326 149.699 114.188Z" fill="white"/>
            <path d="M132.513 102.349C119.905 99.6477 108.301 92.6577 100.084 82.6756C98.5462 80.8079 97.2998 78.9975 96.339 77.2298C88.0367 73.1803 81.9646 66.375 79.8742 58.6406C77.2096 48.777 81.7693 38.0372 90.2554 34.1907L91.4129 36.7445C84.2639 39.9846 80.302 49.4795 82.581 57.9094C84.2026 63.9147 88.542 69.3164 94.573 73.0594C94.1589 71.671 93.9298 70.3015 93.8832 68.9471C93.7058 63.8029 97.0387 57.6869 102.735 56.7761C106.35 56.1971 110.204 57.8687 112.556 61.0337C114.6 63.782 115.454 67.5312 114.9 71.321C114.527 73.8872 113.546 75.9961 112.067 77.4213C109.519 79.8699 105.48 80.4243 100.795 79.0223C101.242 79.6372 101.725 80.2614 102.248 80.8951C111.15 91.7087 124.23 98.8358 138.144 100.439L137.821 103.225C136.038 103.016 134.266 102.724 132.513 102.349ZM98.3888 75.0968C98.8412 75.3025 99.3018 75.5002 99.7672 75.6894C101.896 76.5476 107.165 78.2433 110.124 75.3992C111.422 74.1517 111.93 72.272 112.126 70.9151C112.573 67.8546 111.911 64.8624 110.307 62.705C108.596 60.4048 105.727 59.1363 103.179 59.5435C98.9926 60.2124 96.5493 64.8939 96.6847 68.848C96.7546 70.8549 97.3172 72.9248 98.3888 75.0968Z" fill="#FCC145"/>
            <path d="M7.97771 88.1736C15.2324 75.5275 27.5208 66.7964 40.8465 64.817C48.1338 63.7368 56.4784 65.8626 61.6089 70.0912C63.7748 71.8782 65.3499 73.9796 66.2942 76.3162C68.0544 76.3005 69.7664 76.5009 71.3603 76.933C77.8094 78.6926 81.0927 83.1168 82.3111 87.9209C88.5453 87.3205 96.4889 89.9712 100.813 94.505L98.9728 95.9073C95.2649 92.0231 88.1225 89.7375 82.7582 90.3843C82.9116 91.7421 82.9199 93.0995 82.8042 94.4057C82.1404 101.96 77.3737 109.211 70.8284 107.755C67.371 106.978 66.3184 104.91 65.9986 103.745C64.6736 98.927 70.5495 91.9335 78.5724 88.7765C78.9692 88.6213 79.3813 88.4852 79.8076 88.37C79.0094 84.8467 76.7979 80.8286 71.0821 79.2723C69.7566 78.9107 68.3963 78.734 67.029 78.7159C67.2649 79.8282 67.3713 80.9824 67.3459 82.1702C67.1736 90.3969 62.7385 99.6249 54.599 101.345C52.158 101.86 49.5852 101.152 47.5433 99.4218C45.3083 97.5227 44.1829 94.7687 44.5348 92.0587C45.6292 83.628 54.8513 77.5595 63.7189 76.4855C62.9503 74.7202 61.7297 73.1423 60.0627 71.7677C55.6124 68.0976 48.2477 66.2674 41.7455 67.2338C29.0653 69.1149 17.3405 77.4838 10.379 89.6192L7.97771 88.1736ZM64.4578 78.8623C56.0228 79.9209 47.991 86.4698 47.1687 92.7994C46.9276 94.6688 47.657 96.5316 49.1261 97.7791C50.3911 98.8547 52.004 99.2818 53.5522 98.9557C60.5835 97.4708 64.5388 88.9352 64.6918 81.6583C64.7125 80.6865 64.6338 79.7556 64.4578 78.8623ZM80.1829 90.9831C80.1166 91.0066 80.0524 91.0325 79.9878 91.0569C72.5543 93.9812 67.6608 100.306 68.5653 103.592C68.7234 104.168 69.146 104.98 70.9646 105.384C75.2348 106.335 79.5303 100.901 80.1591 93.7536C80.2143 93.1178 80.2597 92.1408 80.1829 90.9831Z" fill="#FFBA81"/>
            <path d="M58.8728 123.754C62.7088 115.652 71.8782 110.441 80.7949 111.242C80.9251 111.11 81.0601 110.979 81.1979 110.854C83.7543 108.526 87.3246 107.16 92.109 106.672C97.3018 106.144 102.604 106.688 107.436 108.243L106.578 110.913C102.109 109.475 97.2024 108.974 92.3909 109.463C89.0104 109.806 86.3684 110.617 84.3713 111.931C86.3163 112.542 87.9277 113.502 89.1177 114.775C91.51 117.329 91.9468 121.183 90.1431 123.738C88.9644 125.405 86.9853 126.286 84.7086 126.155C82.1473 126.007 79.7605 124.572 78.6282 122.499C77.2661 119.994 77.4111 116.743 78.8279 113.962C71.61 114.014 64.5084 118.399 61.4051 124.951L58.8728 123.754ZM81.9469 114.221C80.5429 116.196 79.855 118.924 81.089 121.156C81.7569 122.381 83.2757 123.265 84.87 123.357C86.1579 123.431 87.2468 122.982 87.8527 122.121C88.9969 120.504 88.3354 118.047 87.0706 116.69C85.6918 115.215 83.6753 114.531 81.9469 114.221Z" fill="#FCC145"/>
          </svg>
        </div>
)}
        {/* Lottery Tickets Section */}
        <div className="tickets-section">
          <div className="tickets-header">
            <h2>Try your Luck, Buy a Ticket</h2>

          <div className="tickets-tabs">
              <button key="all"
              className={`tab ${selectedScheme === "All" ? "active" : ""}`}
            onClick={() => setSelectedScheme("All")}> All</button>
            {latestSchemeDetails.map((scheme, index) => (
              <button
                key={scheme.json.id || index}
            onClick={() => setSelectedScheme(scheme.json.scheme_name)}
            className={`tab ${selectedScheme === scheme.json.scheme_name ? "active" : ""}`}
              >
                {scheme.json.scheme_name} ({scheme.json.count})
              </button>
            
            ))}

          </div>
          </div>
          <div className="tickets-grid">
  {filteredSchemes && filteredSchemes.length > 0 ? (
    filteredSchemes.map((scheme) => (
      <div key={scheme.id} className="ticket-card-dash">
        <img src={scheme.json.image_url} alt="Lottery Ticket" className="ticket-image" />
        <div className="ticket-prize-banner">
          <span>{scheme.json.prize || "Prize Info"}</span>
        </div>
        <div className="ticket-draw-date">
          <span> Draw Date : <strong>{scheme.json.draw_date}</strong> </span>
          {scheme.json.is_in_days=== "No"? <CountdownTimer milliseconds={Number(scheme.json.time_left)} /> : null }
          
        </div>
        <div className="ticket-actions">
          <button className="prize-details-btn"   
          onClick={() => {
          setSelectedId(scheme.json.id);
           setShowPrizes(true);
           }}>Prize Details</button>
          <button className="buy-now-btn"   onClick={() => handleBuyNow(scheme)}>Buy Now</button>
        </div>
        {/* {scheme.json.highlights === "NA" ? null :<div className="highlights-container"><button className="highlight-btn"   onClick={() => (setIsBottomSheetOpen(true), setHighlights(scheme.json.highlights))}>Highlights</button></div> } */}
        <div className="highlights-container">
          {scheme.json.highlights === "NA" ? (
            <button className="highlight-btn disabled" disabled title="No highlights available"> Highlights </button>
          ) : (
            <button className="highlight-btn" onClick={() => { setIsBottomSheetOpen(true); setHighlights(scheme.json.highlights); }} >
              Highlights
            </button>
          )}
        </div>
      </div>
    ))
  ) : (
    <p className="text-center text-gray-500">No schemes to show</p>
  )}
</div>

          <button className="view-all-btn">
            <span>View All Tickets</span>
            <svg width="20" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4.67188 10H16.3385" stroke="#AD1E24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10.5 4.16602L16.3333 9.99935L10.5 15.8327" stroke="#AD1E24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Refer Friends Section */}
        <div className="refer-section" onClick={() => navigate("/settings", { state: { type: "refer" } })}>
          <img src={Refer}></img>
        </div>
      </div>

      <button className="phone-btn phone-btn-right" onClick={() => (window.location.href = "tel:18002966868")}>
        
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M13.832 16.568C14.0385 16.6628 14.2712 16.6845 14.4917 16.6294C14.7122 16.5744 14.9073 16.4458 15.045 16.265L15.4 15.8C15.5863 15.5516 15.8279 15.35 16.1056 15.2111C16.3833 15.0723 16.6895 15 17 15H20C20.5304 15 21.0391 15.2107 21.4142 15.5858C21.7893 15.9609 22 16.4696 22 17V20C22 20.5304 21.7893 21.0391 21.4142 21.4142C21.0391 21.7893 20.5304 22 20 22C15.2261 22 10.6477 20.1036 7.27208 16.7279C3.89642 13.3523 2 8.7739 2 4C2 3.46957 2.21071 2.96086 2.58579 2.58579C2.96086 2.21071 3.46957 2 4 2H7C7.53043 2 8.03914 2.21071 8.41421 2.58579C8.78929 2.96086 9 3.46957 9 4V7C9 7.31049 8.92771 7.61672 8.78885 7.89443C8.65 8.17214 8.44839 8.41371 8.2 8.6L7.732 8.951C7.54842 9.09118 7.41902 9.29059 7.36579 9.51535C7.31256 9.74012 7.33878 9.97638 7.44 10.184C8.80668 12.9599 11.0544 15.2048 13.832 16.568Z" stroke="#181823" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
            {isBottomSheetOpen && (
              <div
                className="bottom-sheet-overlay"
                onClick={() => setIsBottomSheetOpen(false)}
              >
                <div className="bottom-sheet" onClick={(e) => e.stopPropagation()}>
                  {/* <div className="bottom-sheet-header">
                    <h2>Highlights </h2><h2 onClick={() => setIsBottomSheetOpen(false)}>X </h2>
                  </div> */}

                    <>
                      <div className="bottom-sheet-content"  dangerouslySetInnerHTML={{ __html: highlights }}>
                        
                        
                      </div>
                    </>

                </div>
              </div>
            )} 
{showPrizes && (
  <PrizeDetails
    selectedId={selectedId}
    refreshToken={refreshToken}
    onClose={() => setShowPrizes(false)}
  />
)}

{showAlert && (
  <AlertPopup
    message={alertMessage}
    onClose={() => setShowAlert(false)}
  />
)}
    </div>
  );
}
