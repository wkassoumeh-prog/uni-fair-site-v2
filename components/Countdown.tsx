import React, { useEffect, useState } from 'react';

const COUNTDOWN_DATE = new Date('2026-04-15T00:00:00+03:00').getTime();

const Countdown: React.FC = () => {
  const calculateTimeLeft = () => {
    const now = new Date().getTime();
    const difference = COUNTDOWN_DATE - now;

    let timeLeft = {
      Days: 0,
      Hours: 0,
      Minutes: 0,
      Seconds: 0,
    };

    if (difference > 0) {
      timeLeft = {
        Days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        Hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        Minutes: Math.floor((difference / 1000 / 60) % 60),
        Seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-blue-900 py-16 md:py-20">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center">
          {/* Title */}
          <h2 className="text-white font-bold tracking-wider uppercase text-4xl md:text-5xl mb-8 text-center leading-tight">
            CAREER EXPO SYRIA
          </h2>
          
          {/* Date */}
          <div className="text-white text-2xl md:text-3xl font-semibold mb-10 text-center">
            April 15-17, 2026
          </div>
          
          {/* Begins in label */}
          <div className="text-blue-100 text-lg md:text-xl font-medium mb-8 tracking-wide">
            Begins in
          </div>
          
          {/* Countdown Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 w-full max-w-4xl">
            {(['Days', 'Hours', 'Minutes', 'Seconds'] as const).map((label, idx) => (
              <div key={label} className="text-center">
                <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-amber-500 mb-3 leading-none">
                  {String(timeLeft[label]).padStart(2, '0')}
                </div>
                <div className="text-blue-100 uppercase tracking-widest text-xs md:text-sm font-semibold">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Countdown;