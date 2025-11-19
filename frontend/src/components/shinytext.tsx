import React from 'react';

interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
}

const ShinyText: React.FC<ShinyTextProps> = ({
  text,
  disabled = false,
  speed = 5,
  className = '',
}) => {
  const animationDuration = `${speed}s`;

  return (
    <div
      className={`relative inline-block bg-clip-text text-transparent ${
        disabled ? '' : 'animate-shine'
      } ${className}`}
      style={{
        backgroundImage:
          'linear-gradient(120deg, #999 30%, #fff 45%, #999 60%)',
        backgroundSize: '250% 100%',
        animationDuration,
      }}
    >
      {text}
    </div>
  );
};

export default ShinyText;
