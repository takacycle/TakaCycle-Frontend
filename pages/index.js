import React from 'react'
import { useState, useEffect } from "react";
import Image from "next/image";

function Home() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    // Set the date we're counting down to - replace with your target date
    const countDownDate = new Date("Feb 28, 2025 11:59:00").getTime();

    const timer = setInterval(() => {
      // Get current date and time
      const now = new Date().getTime();
      
      // Find the distance between now and the countdown date
      const distance = countDownDate - now;
      
      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      // Time calculations
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timer);
  }, []); 

  return (
    <>
      <div className="relative w-full h-screen flex flex-col items-center justify-center text-white text-center bg-cover bg-center bg-brandDarkGreen">
        <div className="absolute inset-0" />
        
        <div className="relative z-10 flex flex-col items-center bg-white border p-4 rounded-lg w-96 mx-4 md:mx-0">
          <Image src={"/assets/brand-logo.svg"} width={150} height={150} alt="Company Logo" />
          <h1 className="text-4xl md:text-3xl font-alton font-bold mt-4 text-brandDarkGreen">Coming Soon</h1>
          
          <div className="flex space-x-4 mt-6 text-xl md:text-3xl">
            <div className="flex flex-col items-center">
              <span className="font-bold text-brandGreen">{timeLeft.days}</span>
              <span className="text-sm text-brandDarkGreen">Days</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-bold text-brandGreen">{timeLeft.hours}</span>
              <span className="text-sm text-brandDarkGreen">Hours</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-bold text-brandGreen">{timeLeft.minutes}</span>
              <span className="text-sm text-brandDarkGreen">Minutes</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-bold text-brandGreen">{timeLeft.seconds}</span>
              <span className="text-sm text-brandDarkGreen">Seconds</span>
            </div>
          </div>
        </div>
        
        <div>
          <h2 className="text-base font-bold mt-4">
            <span className="text-brandFadedGreen">TakaCycle </span>Innovations
          </h2>
        </div>
      </div>
    </>
  );
}

export default Home