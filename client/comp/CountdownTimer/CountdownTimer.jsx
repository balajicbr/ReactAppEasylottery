import React, { useState, useEffect } from 'react';
import { FaClock } from "react-icons/fa";
const CountdownTimer = ({ milliseconds }) => {
  const [timeLeft, setTimeLeft] = useState(Math.ceil(Number(milliseconds) / 1000));

  useEffect(() => {
    if (timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const pad = (num) => String(num).padStart(2, '0');
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  };

  return <span className="draw-timer" style={{gap:"5px",alignItems:"center",  color:"#ad1e24"}}><FaClock/>{formatTime(timeLeft)}</span>;
};

export default CountdownTimer;
