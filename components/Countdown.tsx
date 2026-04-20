import React, { useEffect, useState } from 'react';
import type { Copy } from '@/content/copy.en';

interface CountdownProps {
  copy: Copy;
}

const COUNTDOWN_DATE = new Date('2026-08-04T10:00:00+03:00').getTime();

const Countdown: React.FC<CountdownProps> = ({ copy }) => {
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
    <div className="bg-blue-900 py-10 md:py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center">
          {/* Title */}
          <h2 className="text-white font-bold tracking-wider uppercase text-3xl md:text-4xl mb-4 text-center leading-tight">
            {copy.countdown.title}
          </h2>
          
          {/* Date */}
          <div className="text-white text-xl md:text-2xl font-semibold mb-6 text-center">
            {copy.countdown.date}
          </div>
          
          {/* Begins in label */}
          <div className="text-blue-100/80 text-sm md:text-base font-medium mb-6 tracking-widest uppercase">
            {copy.countdown.beginsIn}
          </div>
          
          {/* Countdown Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 w-full max-w-3xl">
            {(['Days', 'Hours', 'Minutes', 'Seconds'] as const).map((label) => {
              const labelKey = label.toLowerCase() as 'days' | 'hours' | 'minutes' | 'seconds';
              return (
                <div key={label} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 md:p-6 text-center shadow-lg transform transition-transform hover:scale-105">
                  <div className="text-4xl md:text-5xl font-extrabold text-amber-400 mb-1 tabular-nums">
                    {String(timeLeft[label]).padStart(2, '0')}
                  </div>
                  <div className="text-blue-200 uppercase tracking-widest text-[10px] md:text-xs font-bold">
                    {copy.countdown.labels[labelKey]}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Countdown;