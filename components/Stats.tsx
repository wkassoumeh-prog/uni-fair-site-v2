
import React from 'react';

const Stats: React.FC = () => {
  const stats = [
    { label: 'Universities', value: '150+' },
    { label: 'Countries', value: '25+' },
    { label: 'Attendees', value: '20,000+' },
    { label: 'Scholarships', value: '$2.5M+' },
  ];

  return (
    <div className="bg-blue-900 py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-amber-500 mb-2">
                {stat.value}
              </div>
              <div className="text-blue-100 uppercase tracking-widest text-sm font-semibold">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Stats;
