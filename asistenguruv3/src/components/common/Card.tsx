
import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ title, children, className = '', onClick }) => {
  const cardClasses = `bg-white rounded-lg shadow-md p-6 ${className} ${onClick ? 'cursor-pointer transition-all duration-200 hover:shadow-xl hover:scale-[1.02]' : ''}`;

  return (
    <div className={cardClasses} onClick={onClick}>
      {title && <h3 className="text-xl font-bold text-text-main mb-4">{title}</h3>}
      {children}
    </div>
  );
};

export default Card;
