import React, { useEffect,useState } from 'react';
import "./NewsAndMedia.css"; // Optional: For component-specific styles
import axios from 'axios';
import { useSelector } from 'react-redux';
const News = () => {
    const user = useSelector((state) => state.auth.user.user);
    const refreshToken = user?.refreshToken;
    const [loading, setLoading] = useState(false);
    const [newsData, setNewsData] = useState([]);

      useEffect(() => {
        fetchNews();
      }, []);
      const fetchNews = async () => {
        setLoading(true);
        try { 
          const requestData = {
            refreshToken,
            formstep: "getNewsData",
          };
    
          const response = await axios.post(
            "https://api.easylotto.in/el_news_media",
            requestData,
            {
                headers: {
                    Authorization: `Bearer ${refreshToken}`,
                    "lang-policies-mode": "max-age=0",
                },
            },
          );
            if (response.data) {
            setNewsData(response.data); 
            }
        } catch (error) {
          console.error("Error fetching schemes:", error);
        }finally{
        setLoading(false);
        }
      };
return (
  <div className="News-container">
    {loading ? (
        <div className="loader-container">
            <div className="spinner"></div>
            <p>Loading News & media...</p>
        </div>
    ) : newsData.length > 0 ? (
        <div className="news-list">
         {newsData.map((item, index) => (
            <div key={index} className="news-card">
                <img src={item.json.brand_image || "fallback.jpg"} alt="News logo" className="news-logo" />
                <div className="news-content">
                    <h3 className="news-title">{item.json.brand_name}</h3>
                    <p className="news-description">{item.json.description}</p>
                    <a href={item.json.link} target="_blank" rel="noopener noreferrer" className="news-link">
                    Continue Reading
                    </a>
                </div>
            </div>
            ))}
      </div>
    ) : (
      <p>No news available.</p>
    )}
  </div>
);

};

export default News;
