
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
        <div className="winning-section"  style={{  backgroundImage: `url(${Im_WinBg_})`, backgroundSize: "contain", backgroundPosition: "center"}} >
          <div className="winning-content">
            {/* <div className="winning-text">You have Won</div> */}
            <div className="winning-amount">₹{winningData[0].win_amount}</div>           
          </div>
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
