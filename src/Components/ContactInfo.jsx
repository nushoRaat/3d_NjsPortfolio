import React from 'react';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

export default function ContactInfo() {
  const infoItems = [
    {
      icon: <FaPhoneAlt style={iconStyle} />,
      label: 'Phone',
      value: '+123 456 7890',
    },
    {
      icon: <FaEnvelope style={iconStyle} />,
      label: 'Email',
      value: 'you@example.com',
    },
    {
      icon: <FaMapMarkerAlt style={iconStyle} />,
      label: 'Address',
      value: '123 Main Street, City, Country',
    },
  ];

  return (
    <div >
      {infoItems.map((item, idx) => (
        <div key={idx} style={infoBox}>
          {item.icon}
          <div>
            <div style={labelStyle}>{item.label}</div>
            <div style={valueStyle}>{item.value}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Styles

const infoBox = {
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
};

const iconStyle = {
  fontSize: '1.5rem',
  color: '#E4D4C8',
  minWidth: '24px',
};

const labelStyle = {
  fontSize: '0.9rem',
  color: '#E4D4C8',
};

const valueStyle = {
  fontSize: '1.1rem',
};
