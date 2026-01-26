import React from 'react';

interface PhoneNumberProps {
  value: string;
  className?: string;
}

const PhoneNumber: React.FC<PhoneNumberProps> = ({ value, className = '' }) => {
  return (
    <span dir="ltr" style={{ unicodeBidi: 'embed' }} className={className}>
      {value}
    </span>
  );
};

export default PhoneNumber;
