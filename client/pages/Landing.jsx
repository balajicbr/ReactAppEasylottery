import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Landing.css';

const Landing = () => {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (phoneNumber) {
      navigate('/otp', { state: { phoneNumber } });
    }
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleRegister = () => {
    navigate('/login');
  };

  return (
    <div className="landing-container" style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header className="header">
        <div className="header-top">
          <span className="go-to-website">Go to Website</span>
          <div className="header-buttons">
            <button className="login-btn" onClick={handleLogin}>Login</button>
            <button className="register-btn" onClick={handleRegister}>Register</button>
          </div>
        </div>
        <div className="header-main">
          <img 
            className="logo" 
            src="https://api.builder.io/api/v1/image/assets/TEMP/d02327740217774d347afba21a08ac579206e61c?width=372" 
            alt="EasyLottery.in" 
          />
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Try your luck, <span className="win-big">Win big</span>
              <br />with eassy lottery!
            </h1>
          </div>
          <div className="hero-form">
            <p className="form-label">To know and win more, share</p>
            <form className="phone-form" onSubmit={handleSubmit}>
              <input
                type="tel"
                placeholder="Enter phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="phone-input"
              />
              <button type="submit" className="submit-btn">Submit</button>
            </form>
          </div>
        </div>
      </section>

      {/* Lottery Card Section */}
      <section className="lottery-section">
        <div className="lottery-card">
          <div className="lottery-header">
            <p className="plan-text">Plan your stress-free retirement with</p>
            <img 
              className="lottery-logo" 
              src="https://api.builder.io/api/v1/image/assets/TEMP/7010c697d4c98e37051df4963a9174c64bba3216?width=268" 
              alt="Lottery logo" 
            />
          </div>
          <h2 className="lottery-title">India's first ₹50 crores online lottery</h2>
          <div className="price-section">
            <p className="price-label">Ticket price starting from</p>
            <div className="price-range">
              <span className="price">₹100</span>
              <span className="upto">Upto</span>
              <span className="price">₹5000</span>
            </div>
          </div>
          <div className="lottery-badge">
            <div className="badge-item">BIG 50</div>
            <div className="badge-name">DAYWIN</div>
            <div className="badge-item mega">MEGA 5</div>
          </div>
          <div className="lottery-image">
            <svg width="186" height="174" viewBox="0 0 186 174" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M76.5259 37.6729C76.5259 42.8536 80.7326 47.0534 85.9219 47.0534H176.312C181.502 47.0534 185.708 51.2532 185.708 56.434V164.31C185.708 169.491 181.502 173.691 176.312 173.691H10.1895C5.00023 173.691 0.793457 169.491 0.793457 164.31V10.1761C0.793457 4.99543 5.00023 0.795624 10.1895 0.795624H67.1298C72.3191 0.795624 76.5259 4.99543 76.5259 10.1761V37.6729Z" fill="url(#pattern0_1_2547)"/>
              <defs>
                <pattern id="pattern0_1_2547" patternContentUnits="objectBoundingBox" width="1" height="1">
                  <use xlinkHref="#image0_1_2547" transform="matrix(0.00178012 0 0 0.00190388 -0.57 -0.00887616)"/>
                </pattern>
              </defs>
            </svg>
          </div>
        </div>
        <div className="carousel-dots">
          <div className="dot active"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
      </section>

      {/* Announcements */}
      <section className="announcements-section">
        <div className="announcement-card live-draw">
          <div className="announcement-icon">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13.2497 20.0571C12.3111 23.4937 12.5433 22.714 11.2369 26.9072L9.36719 26.4148C10.5674 22.263 10.4524 22.5618 11.6256 19.6978L13.2497 20.0571Z" fill="url(#paint0_linear_1_2556)"/>
              <path d="M19.0273 20.3071C20.0608 23.8178 20.0346 23.8178 21.1636 27.0884L22.9884 26.6384C21.8614 22.9797 21.8708 23.0644 20.6514 19.9478L19.0273 20.3071Z" fill="url(#paint1_linear_1_2556)"/>
              <path d="M16.0802 5.11292C10.9839 5.11292 6.84717 9.20749 6.84717 14.2629C6.84717 19.3182 10.9839 23.4218 16.0802 23.4218C21.1765 23.4218 25.3042 19.3182 25.3042 14.2629C25.3042 9.20749 21.1765 5.11292 16.0802 5.11292Z" fill="#8478D4"/>
              <defs>
                <linearGradient id="paint0_linear_1_2556" x1="10.0965" y1="27.6345" x2="12.1765" y2="20.1053" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#B8B8B8"/>
                  <stop offset="1" stopColor="#E6E6E6"/>
                </linearGradient>
                <linearGradient id="paint1_linear_1_2556" x1="22.3485" y1="27.8922" x2="19.7279" y2="19.376" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#B8B8B8"/>
                  <stop offset="1" stopColor="#E6E6E6"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="announcement-content">
            <p className="announcement-text">
              Dear EasyLottery.in members, We are happy to announce our live draw of "DAYWIN" which will be held at 12:15 PM on Saturday
            </p>
            <button className="view-live-btn">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M23 9.45168C23.0495 8.02034 22.7365 6.5997 22.09 5.32168C21.6514 4.79728 21.0427 4.44339 20.37 4.32168C17.5875 4.06921 14.7936 3.96573 12 4.01168C9.21667 3.96364 6.43274 4.06378 3.66003 4.31168C3.11185 4.4114 2.60454 4.66853 2.20003 5.05168C1.30003 5.88168 1.20003 7.30168 1.10003 8.50168C0.954939 10.6592 0.954939 12.8241 1.10003 14.9817C1.12896 15.6571 1.22952 16.3275 1.40003 16.9817C1.5206 17.4867 1.76455 17.954 2.11003 18.3417C2.51729 18.7451 3.03641 19.0169 3.60003 19.1217C5.75594 19.3878 7.92824 19.4981 10.1 19.4517C13.6 19.5017 16.67 19.4517 20.3 19.1717C20.8775 19.0733 21.4112 18.8012 21.83 18.3917C22.11 18.1116 22.3191 17.7688 22.44 17.3917C22.7977 16.2943 22.9733 15.1458 22.96 13.9917C23 13.4317 23 10.0517 23 9.45168ZM9.74003 14.5917V8.40168L15.66 11.5117C14 12.4317 11.81 13.4717 9.74003 14.5917Z" fill="#FFC13A"/>
              </svg>
              View live draw
            </button>
          </div>
        </div>

        <div className="announcement-card kyc-card">
          <div className="kyc-content">
            <div className="kyc-header">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 10H18" stroke="black" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 14H18" stroke="black" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6.16992 15C6.37606 14.414 6.75902 13.9065 7.26594 13.5474C7.77286 13.1884 8.37873 12.9955 8.99992 12.9955C9.62111 12.9955 10.227 13.1884 10.7339 13.5474C11.2408 13.9065 11.6238 14.414 11.8299 15" stroke="black" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 13C10.1046 13 11 12.1046 11 11C11 9.89543 10.1046 9 9 9C7.89543 9 7 9.89543 7 11C7 12.1046 7.89543 13 9 13Z" stroke="black" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M20 5H4C2.89543 5 2 5.89543 2 7V17C2 18.1046 2.89543 19 4 19H20C21.1046 19 22 18.1046 22 17V7C22 5.89543 21.1046 5 20 5Z" stroke="black" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Complete your KYC for Instant transfer of prizes</span>
            </div>
            <button className="complete-kyc-btn">Complete KYC</button>
          </div>
          <div className="carousel-dots">
            <div className="dot active"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="how-it-works-section">
        <div className="section-header">
          <h2 className="section-title">How easy lottery works</h2>
          <p className="section-subtitle">Discover how easy it is to play, win, and claim prizes in just a minute</p>
        </div>
        
        <div className="video-demo">
          <div className="video-container">
            <div className="browser-chrome">
              <div className="traffic-lights">
                <div className="light red"></div>
                <div className="light yellow"></div>
                <div className="light green"></div>
              </div>
              <div className="address-bar">www.easylottery.in</div>
              <div className="mute-icon">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.28732 2.73352C8.17905 2.68668 8.0603 2.66941 7.94318 2.68346C7.82606 2.69751 7.71476 2.74239 7.62065 2.81352L4.43398 5.33352H2.00065C1.82384 5.33352 1.65427 5.40376 1.52925 5.52878C1.40422 5.6538 1.33398 5.82337 1.33398 6.00018V10.0002C1.33398 10.177 1.40422 10.3466 1.52925 10.4716C1.65427 10.5966 1.82384 10.6669 2.00065 10.6669H4.43398L7.58732 13.1869C7.70461 13.281 7.85028 13.3326 8.00065 13.3335C8.10023 13.3352 8.19868 13.3123 8.28732 13.2669C8.40077 13.2128 8.49663 13.1278 8.56387 13.0217C8.6311 12.9155 8.66696 12.7925 8.66732 12.6669V3.33352C8.66696 3.20786 8.6311 3.08486 8.56387 2.9787C8.49663 2.87255 8.40077 2.78755 8.28732 2.73352ZM7.33398 11.2802L5.08065 9.48018C4.96336 9.38608 4.81769 9.33439 4.66732 9.33352H2.66732V6.66685H4.66732C4.81769 6.66598 4.96336 6.61429 5.08065 6.52018L7.33398 4.72018V11.2802ZM13.274 8.00018L14.474 6.80685C14.5361 6.74469 14.5855 6.6709 14.6191 6.58968C14.6527 6.50847 14.67 6.42142 14.67 6.33352C14.67 6.24561 14.6527 6.15857 14.6191 6.07735C14.5855 5.99614 14.5361 5.92234 14.474 5.86018C14.4118 5.79802 14.338 5.74872 14.2568 5.71508C14.1756 5.68144 14.0886 5.66412 14.0007 5.66412C13.9127 5.66412 13.8257 5.68144 13.7445 5.71508C13.6633 5.74872 13.5895 5.79802 13.5273 5.86018L12.334 7.06018L11.1407 5.86018C11.0151 5.73465 10.8449 5.66412 10.6673 5.66412C10.4898 5.66412 10.3195 5.73465 10.194 5.86018C10.0684 5.98572 9.99792 6.15598 9.99792 6.33352C9.99792 6.51105 10.0684 6.68131 10.194 6.80685L11.394 8.00018L10.194 9.19352C10.1315 9.25549 10.0819 9.32923 10.0481 9.41047C10.0142 9.49171 9.99679 9.57884 9.99679 9.66685C9.99679 9.75486 10.0142 9.842 10.0481 9.92323C10.0819 10.0045 10.1315 10.0782 10.194 10.1402C10.256 10.2027 10.3297 10.2523 10.4109 10.2861C10.4922 10.32 10.5793 10.3374 10.6673 10.3374C10.7553 10.3374 10.8425 10.32 10.9237 10.2861C11.0049 10.2523 11.0787 10.2027 11.1407 10.1402L12.334 8.94018L13.5273 10.1402C13.5893 10.2027 13.663 10.2523 13.7443 10.2861C13.8255 10.32 13.9126 10.3374 14.0007 10.3374C14.0887 10.3374 14.1758 10.32 14.257 10.2861C14.3383 10.2523 14.412 10.2027 14.474 10.1402C14.5365 10.0782 14.5861 10.0045 14.6199 9.92323C14.6538 9.842 14.6712 9.75486 14.6712 9.66685C14.6712 9.57884 14.6538 9.49171 14.6199 9.41047C14.5861 9.32923 14.5365 9.25549 14.474 9.19352L13.274 8.00018Z" fill="white"/>
                </svg>
              </div>
            </div>
            <div className="video-content">
              <div className="play-button">
                <svg width="148" height="115" viewBox="0 0 148 115" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="57.28" cy="57.52" r="55.2" transform="rotate(180 57.28 57.52)" fill="url(#paint0_linear_1_2623)" stroke="#131122" strokeWidth="4"/>
                  <path d="M45.0938 39.1483C45.0938 37.9226 46.435 37.1846 47.4756 37.8524L47.4834 37.8573L76.3408 56.1844V56.1854C77.3344 56.8264 77.2969 58.2174 76.3604 58.8065L76.3516 58.8114L47.4814 77.1835L47.4756 77.1874C46.435 77.8552 45.0938 77.1172 45.0938 75.8915V39.1483Z" fill="white" stroke="#131122" strokeWidth="4"/>
                  <path d="M146.907 58.2271C147.298 57.8366 147.298 57.2034 146.907 56.8129L140.543 50.449C140.153 50.0584 139.52 50.0584 139.129 50.449C138.739 50.8395 138.739 51.4726 139.129 51.8632L144.786 57.52L139.129 63.1769C138.739 63.5674 138.739 64.2006 139.129 64.5911C139.52 64.9816 140.153 64.9816 140.543 64.5911L146.907 58.2271ZM108.2 57.52V58.52H146.2V57.52V56.52H108.2V57.52Z" fill="white"/>
                  <circle cx="127.2" cy="57.5201" r="2.28" transform="rotate(-90 127.2 57.5201)" fill="white"/>
                  <path d="M106.54 57.5204C106.54 55.5544 108.134 53.9601 110.1 53.9598C112.066 53.9598 113.66 55.5543 113.66 57.5204C113.66 59.4863 112.066 61.08 110.1 61.08C108.134 61.0797 106.54 59.4862 106.54 57.5204Z" fill="#131122" stroke="white" strokeWidth="2"/>
                  <defs>
                    <linearGradient id="paint0_linear_1_2623" x1="4.07998" y1="57.52" x2="110.48" y2="57.52" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#FFB61A"/>
                      <stop offset="1" stopColor="#FF7D2D"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        <div className="steps-title">
          <h3>Simple steps to win big</h3>
        </div>
      </section>

      {/* Recent Winners */}
      <section className="winners-section">
        <div className="section-header">
          <h2 className="section-title">Meet our recent winners!</h2>
          <p className="section-subtitle">These lucky players turned their tickets into big wins. See who's winning and get inspired to try your luck!</p>
        </div>

        <div className="winners-tabs">
          <div className="tab active">
            <span className="tab-name">DAYWIN</span>
            <span className="tab-date">31 Jul 2025</span>
          </div> 
          <div className="tab">
            <span className="tab-name">DAYWIN</span>
            <span className="tab-date">30 Jul 2025</span>
          </div>
          <div className="tab">
            <span className="tab-name">DAYWIN</span>
            <span className="tab-date">29 Jul 2025</span>
          </div>
          <div className="tab">
            <span className="tab-name">DAYWIN</span>
            <span className="tab-date">28 Jul 2025</span>
          </div>
          <div className="tab">
            <span className="tab-name">DAYWIN</span>
            <span className="tab-date">26 Jul 2025</span>
          </div>
          <div className="tab">
            <span className="tab-name">DAYWIN</span>
            <span className="tab-date">25 Jul 2025</span>
          </div>
          <div className="tab">
            <span className="tab-name">DAYWIN</span>
            <span className="tab-date">23 Jul 2025</span>
          </div>
        </div>

        <div className="winners-list">
          {[
            { name: "Ravi Kaviraj", phone: "9010392***", ticket: "0677", rank: "bronze" },
            { name: "Mahesh Lal", phone: "9010392***", ticket: "0677", rank: "silver" },
            { name: "Mahavir Shah", phone: "9010392***", ticket: "0677", rank: "gold" },
            { name: "Sundar Patel", phone: "9010392***", ticket: "0677", rank: "platinum" },
            { name: "Sara Mahajan", phone: "9010392***", ticket: "0677", rank: "diamond" },
            { name: "Priya Sakariya", phone: "9010392***", ticket: "0677", rank: "champion" }
          ].map((winner, index) => (
            <div key={index} className="winner-card">
              <div className="winner-info">
                <div className="winner-avatar">
                  <div className={`rank-badge ${winner.rank}`}></div>
                </div>
                <div className="winner-details">
                  <h4 className="winner-name">{winner.name}</h4>
                  <div className="winner-contact">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g clipPath="url(#clip0_1_2674)">
                        <path d="M11.5265 13.8066C11.6986 13.8857 11.8925 13.9037 12.0762 13.8578C12.26 13.8119 12.4226 13.7048 12.5373 13.5541L12.8332 13.1666C12.9884 12.9596 13.1897 12.7916 13.4211 12.6759C13.6526 12.5602 13.9078 12.5 14.1665 12.5H16.6665C17.1085 12.5 17.5325 12.6756 17.845 12.9881C18.1576 13.3007 18.3332 13.7246 18.3332 14.1666V16.6666C18.3332 17.1087 18.1576 17.5326 17.845 17.8451C17.5325 18.1577 17.1085 18.3333 16.6665 18.3333C12.6883 18.3333 8.87295 16.7529 6.0599 13.9399C3.24686 11.1268 1.6665 7.31154 1.6665 3.33329C1.6665 2.89126 1.8421 2.46734 2.15466 2.15478C2.46722 1.84222 2.89114 1.66663 3.33317 1.66663H5.83317C6.2752 1.66663 6.69912 1.84222 7.01168 2.15478C7.32424 2.46734 7.49984 2.89126 7.49984 3.33329V5.83329C7.49984 6.09203 7.43959 6.34722 7.32388 6.57865C7.20817 6.81007 7.04016 7.01138 6.83317 7.16663L6.44317 7.45913C6.29018 7.57594 6.18235 7.74211 6.138 7.92942C6.09364 8.11672 6.11549 8.3136 6.19984 8.48662C7.33874 10.7998 9.21186 12.6706 11.5265 13.8066Z" stroke="#716F83" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </g>
                      <defs>
                        <clipPath id="clip0_1_2674">
                          <rect width="20" height="20" fill="white"/>
                        </clipPath>
                      </defs>
                    </svg>
                    <span>{winner.phone}</span>
                  </div>
                </div>
              </div>
              <div className="winner-ticket">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1.6665 7.49996C2.32955 7.49996 2.96543 7.76335 3.43427 8.23219C3.90311 8.70103 4.1665 9.33692 4.1665 9.99996C4.1665 10.663 3.90311 11.2989 3.43427 11.7677C2.96543 12.2366 2.32955 12.5 1.6665 12.5V14.1666C1.6665 14.6087 1.8421 15.0326 2.15466 15.3451C2.46722 15.6577 2.89114 15.8333 3.33317 15.8333H16.6665C17.1085 15.8333 17.5325 15.6577 17.845 15.3451C18.1576 15.0326 18.3332 14.6087 18.3332 14.1666V12.5C17.6701 12.5 17.0342 12.2366 16.5654 11.7677C16.0966 11.2989 15.8332 10.663 15.8332 9.99996C15.8332 9.33692 16.0966 8.70103 16.5654 8.23219C17.0342 7.76335 17.6701 7.49996 18.3332 7.49996V5.83329C18.3332 5.39127 18.1576 4.96734 17.845 4.65478C17.5325 4.34222 17.1085 4.16663 16.6665 4.16663H3.33317C2.89114 4.16663 2.46722 4.34222 2.15466 4.65478C1.8421 4.96734 1.6665 5.39127 1.6665 5.83329V7.49996Z" stroke="#31220B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10.8335 4.16663V5.83329" stroke="#31220B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10.8335 14.1666V15.8333" stroke="#31220B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10.8335 9.16663V10.8333" stroke="#31220B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>{winner.ticket}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Referral Section */}
      <section className="referral-section">
        <div className="referral-content">
          <div className="referral-header">
            <h2 className="referral-title">Refer a friend</h2>
            <p className="referral-subtitle">Refer a friend to EasyLottery.in and earn credits when they buy a ticket!</p>
            <button className="refer-btn">Refer now</button>
          </div>

          <div className="referral-steps">
            <div className="step">
              <div className="step-icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clipPath="url(#clip0_1_2940)">
                    <path d="M8.3335 10.8332C8.69137 11.3117 9.14796 11.7075 9.67229 11.994C10.1966 12.2805 10.7764 12.4508 11.3724 12.4935C11.9683 12.5362 12.5665 12.4502 13.1263 12.2414C13.6861 12.0326 14.1944 11.7058 14.6168 11.2832L17.1168 8.78322C17.8758 7.99738 18.2958 6.94487 18.2863 5.85238C18.2768 4.7599 17.8386 3.71485 17.0661 2.94231C16.2935 2.16978 15.2485 1.73157 14.156 1.72208C13.0635 1.71259 12.011 2.13256 11.2252 2.89156L9.79183 4.31656" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M11.6668 9.16677C11.309 8.68833 10.8524 8.29245 10.328 8.00599C9.80371 7.71953 9.22391 7.54918 8.62796 7.50649C8.03201 7.46381 7.43384 7.5498 6.87405 7.75862C6.31425 7.96744 5.8059 8.29421 5.3835 8.71677L2.8835 11.2168C2.12451 12.0026 1.70453 13.0551 1.71402 14.1476C1.72352 15.2401 2.16172 16.2851 2.93426 17.0577C3.70679 17.8302 4.75184 18.2684 5.84433 18.2779C6.93681 18.2874 7.98932 17.8674 8.77517 17.1084L10.2002 15.6834" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </g>
                  <defs>
                    <clipPath id="clip0_1_2940">
                      <rect width="20" height="20" fill="white"/>
                    </clipPath>
                  </defs>
                </svg>
              </div>
              <div className="step-content">
                <h4>Unique link</h4>
                <p>Go to your referral page to get your unique link</p>
              </div>
            </div>

            <div className="step">
              <div className="step-icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 6.66675C16.3807 6.66675 17.5 5.54746 17.5 4.16675C17.5 2.78604 16.3807 1.66675 15 1.66675C13.6193 1.66675 12.5 2.78604 12.5 4.16675C12.5 5.54746 13.6193 6.66675 15 6.66675Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M5 12.5C6.38071 12.5 7.5 11.3807 7.5 10C7.5 8.61929 6.38071 7.5 5 7.5C3.61929 7.5 2.5 8.61929 2.5 10C2.5 11.3807 3.61929 12.5 5 12.5Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M15 18.3333C16.3807 18.3333 17.5 17.214 17.5 15.8333C17.5 14.4525 16.3807 13.3333 15 13.3333C13.6193 13.3333 12.5 14.4525 12.5 15.8333C12.5 17.214 13.6193 18.3333 15 18.3333Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M7.1582 11.2583L12.8499 14.575" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12.8415 5.42505L7.1582 8.74172" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="step-content">
                <h4>Share link</h4>
                <p>Share the unique link with all your friend who haven't joined.</p>
              </div>
            </div>

            <div className="step">
              <div className="step-icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clipPath="url(#clip0_1_2961)">
                    <path d="M9.16667 12.5001H10.8333C11.2754 12.5001 11.6993 12.3245 12.0118 12.0119C12.3244 11.6994 12.5 11.2754 12.5 10.8334C12.5 10.3914 12.3244 9.96746 12.0118 9.6549C11.6993 9.34234 11.2754 9.16675 10.8333 9.16675H8.33333C7.83333 9.16675 7.41667 9.33342 7.16667 9.66675L2.5 14.1667" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M5.8335 17.5L7.16683 16.3333C7.41683 16 7.8335 15.8333 8.3335 15.8333H11.6668C12.5835 15.8333 13.4168 15.5 14.0002 14.8333L17.8335 11.1666C18.1551 10.8628 18.3428 10.4436 18.3553 10.0013C18.3678 9.55902 18.2041 9.12989 17.9002 8.80832C17.5963 8.48674 17.1771 8.29906 16.7348 8.28656C16.2925 8.27405 15.8634 8.43776 15.5418 8.74165L12.0418 11.9916" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M1.6665 13.3333L6.6665 18.3333" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M13.3332 9.91659C14.6679 9.91659 15.7498 8.83461 15.7498 7.49992C15.7498 6.16523 14.6679 5.08325 13.3332 5.08325C11.9985 5.08325 10.9165 6.16523 10.9165 7.49992C10.9165 8.83461 11.9985 9.91659 13.3332 9.91659Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M5 6.66675C6.38071 6.66675 7.5 5.54746 7.5 4.16675C7.5 2.78604 6.38071 1.66675 5 1.66675C3.61929 1.66675 2.5 2.78604 2.5 4.16675C2.5 5.54746 3.61929 6.66675 5 6.66675Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </g>
                  <defs>
                    <clipPath id="clip0_1_2961">
                      <rect width="20" height="20" fill="white"/>
                    </clipPath>
                  </defs>
                </svg>
              </div>
              <div className="step-content">
                <h4>Get credit</h4>
                <p>Once they've purchased, you will get your credit immidiately</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section">
        <div className="about-content">
          <div className="about-text">
            <h2 className="about-title">About EasyLottery</h2>
            <p className="about-subtitle">Your Secure Source for Online Lottery</p>
            <p className="about-description">
              We are a government approved lottery distribution website which allows secure lottery purchase for all Indian public except from lottery free states. All our lottery is only open to Indian citizens and also subjected to all Indian taxes.
            </p>
            <button className="view-more-btn">View more information</button>
          </div>
          <img
            className="about-image"
            src="https://api.builder.io/api/v1/image/assets/TEMP/ade03edb95be142834361f45425b3cf8effa6835?width=744"
            alt="About illustration"
          />
        </div>
      </section>

      {/* Partners Section */}
      <section className="partners-section">
        <div className="partners-header">
          <h2 className="partners-title">Welcome to EasyLottery.in</h2>
          <p className="partners-subtitle">
            We don't ask for any personal details or OTP over the Phone or Whatsapp etc. Please don't reveal your bank OTP to anyone, and beware of spam or fraud calls
          </p>
        </div>

        <div className="partners-grid">
          {[
            "https://api.builder.io/api/v1/image/assets/TEMP/33068694c720a6e957b3804c92b6297e75569892?width=116",
            "https://api.builder.io/api/v1/image/assets/TEMP/bf4ffefac2d87635e742ac2235b830fd1c269d4c?width=94",
            "https://api.builder.io/api/v1/image/assets/TEMP/26e22ee0b3a10a3de4c75230b3ce561622c4af93?width=251",
            "https://api.builder.io/api/v1/image/assets/TEMP/a0c9876dfed977df1c984618203180ce0656d90e?width=263",
            "https://api.builder.io/api/v1/image/assets/TEMP/6e3731ae9ea702d703886277fdf94a3fa8830449?width=272",
            "https://api.builder.io/api/v1/image/assets/TEMP/b9cdb64d1c4b44b13467954819ff540c4828cae2?width=114",
            "https://api.builder.io/api/v1/image/assets/TEMP/ad5a62b541bfe42fa28718d08451036a177aee61?width=180",
            "https://api.builder.io/api/v1/image/assets/TEMP/580f15036a0821b9a4eb160acf1fa768950bed00?width=173",
            "https://api.builder.io/api/v1/image/assets/TEMP/54a8e723ba5c948df9a6ded8cab4a947ff3499b9?width=191",
            "https://api.builder.io/api/v1/image/assets/TEMP/de0c54ea1bbc68566c10c9723ebbe2244f33461a?width=231",
            "https://api.builder.io/api/v1/image/assets/TEMP/de5f00880623d3c9b2e89c1c29a908b17b927a71?width=101",
            "https://api.builder.io/api/v1/image/assets/TEMP/daf814d2afa71fe46caf25d6f8899128cd7bd3d6?width=334"
          ].map((logo, index) => (
            <div key={index} className="partner-logo">
              <img src={logo} alt={`Partner ${index + 1}`} />
            </div>
          ))}
        </div>
      </section>

      {/* Government Banner */}
      <div className="government-banner">
        <img
          src="https://api.builder.io/api/v1/image/assets/TEMP/3ae23d2a0072d4d096d6674fc0cf36d5dbf6a67b?width=664"
          alt="Government certification"
        />
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-main">
            <img 
              className="footer-logo" 
              src="https://api.builder.io/api/v1/image/assets/TEMP/5536595916792e209c39db158f5555b6cdf4da6f?width=468" 
              alt="EasyLottery.in" 
            />
            <p className="footer-description">
              The official Meghalaya State Lottery platform, committed to providing fair, transparent, and secure lottery services to all residents. Licensed and regulated by the Government of Meghalaya.
            </p>
          </div>
          
          <div className="footer-links">
            <div className="footer-section">
              <h4>Useful links</h4>
              <ul>
                <li><a href="#">Rules</a></li>
                <li><a href="#">Guide</a></li>
                <li><a href="#">FAQ's</a></li>
                <li><a href="#">More info</a></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h4>Policies</h4>
              <ul>
                <li><a href="#">Terms & conditions</a></li>
                <li><a href="#">Cancellation & Refund policy</a></li>
                <li><a href="#">Shipping & Delivery policy</a></li>
                <li><a href="#">Privacy policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="footer-contact">
            <h4>Contact Info</h4>
            <div className="contact-item">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.3332 5.8335L10.8407 10.606C10.5864 10.7537 10.2976 10.8315 10.0036 10.8315C9.70956 10.8315 9.42076 10.7537 9.1665 10.606L1.6665 5.8335" stroke="#C8C7D2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16.6665 3.3335H3.33317C2.4127 3.3335 1.6665 4.07969 1.6665 5.00016V15.0002C1.6665 15.9206 2.4127 16.6668 3.33317 16.6668H16.6665C17.587 16.6668 18.3332 15.9206 18.3332 15.0002V5.00016C18.3332 4.07969 17.587 3.3335 16.6665 3.3335Z" stroke="#C8C7D2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>contact@easylottery.in</span>
            </div>
            <div className="contact-item">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_1_3045)">
                  <path d="M11.5265 13.8065C11.6986 13.8855 11.8925 13.9036 12.0762 13.8577C12.26 13.8118 12.4226 13.7047 12.5373 13.554L12.8332 13.1665C12.9884 12.9595 13.1897 12.7915 13.4211 12.6758C13.6526 12.5601 13.9078 12.4998 14.1665 12.4998H16.6665C17.1085 12.4998 17.5325 12.6754 17.845 12.988C18.1576 13.3006 18.3332 13.7245 18.3332 14.1665V16.6665C18.3332 17.1085 18.1576 17.5325 17.845 17.845C17.5325 18.1576 17.1085 18.3332 16.6665 18.3332C12.6883 18.3332 8.87295 16.7528 6.0599 13.9398C3.24686 11.1267 1.6665 7.31142 1.6665 3.33317C1.6665 2.89114 1.8421 2.46722 2.15466 2.15466C2.46722 1.8421 2.89114 1.6665 3.33317 1.6665H5.83317C6.2752 1.6665 6.69912 1.8421 7.01168 2.15466C7.32424 2.46722 7.49984 2.89114 7.49984 3.33317V5.83317C7.49984 6.09191 7.43959 6.3471 7.32388 6.57853C7.20817 6.80995 7.04016 7.01126 6.83317 7.1665L6.44317 7.459C6.29018 7.57582 6.18235 7.74199 6.138 7.92929C6.09364 8.1166 6.11549 8.31348 6.19984 8.4865C7.33874 10.7997 9.21186 12.6705 11.5265 13.8065Z" stroke="#C8C7D2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </g>
                <defs>
                  <clipPath id="clip0_1_3045">
                    <rect width="20" height="20" fill="white"/>
                  </clipPath>
                </defs>
              </svg>
              <span>18002966868</span>
            </div>
            <div className="contact-item">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.6668 8.33317C16.6668 12.494 12.051 16.8273 10.501 18.1657C10.3566 18.2742 10.1808 18.333 10.0002 18.333C9.8195 18.333 9.64373 18.2742 9.49933 18.1657C7.94933 16.8273 3.3335 12.494 3.3335 8.33317C3.3335 6.56506 4.03588 4.86937 5.28612 3.61913C6.53636 2.36888 8.23205 1.6665 10.0002 1.6665C11.7683 1.6665 13.464 2.36888 14.7142 3.61913C15.9645 4.86937 16.6668 6.56506 16.6668 8.33317Z" stroke="#C8C7D2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10 10.8335C11.3807 10.8335 12.5 9.71421 12.5 8.3335C12.5 6.95278 11.3807 5.8335 10 5.8335C8.61929 5.8335 7.5 6.95278 7.5 8.3335C7.5 9.71421 8.61929 10.8335 10 10.8335Z" stroke="#C8C7D2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div>
                <div>Directorate Meghalaya State Lottery</div>
                <div>Nokrek Building, 3rd Secretariat, Lachumiere, Shillong 793001</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>© 2024 EasyLottery. in - All rights reserved.</p>
          <div className="social-links">
            <a href="#" aria-label="LinkedIn">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.9998 2.6665C13.3628 2.6665 10.7849 3.44849 8.59224 4.91358C6.39958 6.37866 4.69062 8.46104 3.68145 10.8974C2.67228 13.3337 2.40824 16.0146 2.92271 18.601C3.43718 21.1875 4.70705 23.5632 6.57175 25.4279C8.43645 27.2926 10.8122 28.5625 13.3986 29.077C15.985 29.5914 18.6659 29.3274 21.1023 28.3182C23.5386 27.3091 25.621 25.6001 27.0861 23.4074C28.5512 21.2148 29.3332 18.6369 29.3332 15.9998C29.3293 12.4648 27.9233 9.07566 25.4237 6.57601C22.924 4.07637 19.5349 2.67037 15.9998 2.6665Z" fill="white"/>
              </svg>
            </a>
            <a href="#" aria-label="Facebook">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 0.666992C21.3547 0.666992 27.3172 6.62874 27.3174 13.9834C27.3174 20.6302 22.4473 26.1396 16.0811 27.1387V17.833H19.1836L19.7744 13.9834H16.0811V11.4854C16.0812 10.4323 16.5969 9.40625 18.251 9.40625H19.9307V6.12891C19.9307 6.12891 18.4063 5.86816 16.9492 5.86816C13.9074 5.86817 11.919 7.71223 11.9189 11.0498V13.9834H8.53809V17.833H11.9189V27.1387C5.55268 26.1396 0.682617 20.6302 0.682617 13.9834C0.682799 6.62874 6.6453 0.666992 14 0.666992Z" fill="white"/>
              </svg>
            </a>
            <a href="#" aria-label="Instagram">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.9998 2.66699C13.3628 2.66699 10.7849 3.44898 8.59224 4.91406C6.39958 6.37915 4.69062 8.46153 3.68145 10.8979C2.67228 13.3342 2.40824 16.0151 2.92271 18.6015C3.43718 21.1879 4.70705 23.5637 6.57175 25.4284C8.43645 27.2931 10.8122 28.563 13.3986 29.0775C15.9851 29.5919 18.6659 29.3279 21.1023 28.3187C23.5386 27.3096 25.621 25.6006 27.0861 23.4079C28.5512 21.2153 29.3332 18.6374 29.3332 16.0003C29.3332 12.4641 27.9284 9.07272 25.4279 6.57224C22.9275 4.07175 19.5361 2.66699 15.9998 2.66699Z" fill="white"/>
              </svg>
            </a>
          </div>
        </div>
      </footer>

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        <a href="#" className="nav-item">Rules</a>
        <a href="#" className="nav-item">Guide</a>
        <a href="#" className="nav-item">FAQ's</a>
        <div className="nav-item dropdown">
          <span>Lucky color</span>
          <svg width="16" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4.5 6L8.5 10L12.5 6" stroke="#0A0624" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </nav>
    </div>
  );
};

export default Landing;




