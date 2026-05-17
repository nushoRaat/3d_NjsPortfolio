import { useState, useEffect } from 'react';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { fetchContact } from '../api/portfolio';

const FALLBACK = {
  phone: '+880 1980784503',
  email: 'nushrat.j01@gmail.com',
  address: 'Dhaka, Bangladesh',
};

export default function ContactInfo() {
  const [contact, setContact] = useState(FALLBACK);

  useEffect(() => {
    fetchContact().then(data => setContact(data)).catch(() => {});
  }, []);

  const infoItems = [
    { icon: <FaPhoneAlt style={iconStyle} />, label: 'Phone', value: contact.phone },
    { icon: <FaEnvelope style={iconStyle} />, label: 'Email', value: contact.email },
    { icon: <FaMapMarkerAlt style={iconStyle} />, label: 'Address', value: contact.address },
  ];

  return (
    <div>
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

const infoBox = { display: 'flex', alignItems: 'center', gap: '1rem' };
const iconStyle = { fontSize: '1.5rem', color: '#E4D4C8', minWidth: '24px' };
const labelStyle = { fontSize: '0.9rem', color: '#E4D4C8' };
const valueStyle = { fontSize: '1.1rem' };
