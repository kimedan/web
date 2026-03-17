
import React from 'react';
import { useSite } from '../contexts/SiteContext';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  rounded?: string; // Optional override
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  className = '',
  rounded,
  ...props 
}) => {
  const { config } = useSite();
  const radiusClass = rounded || config.borderRadius || 'rounded-full';

  const baseStyles = `inline-flex items-center justify-center font-medium transition-all duration-200 ease-spring ${radiusClass} active:scale-95 disabled:opacity-50 disabled:pointer-events-none`;
  
  const variants = {
    primary: "bg-brand-blue text-white hover:bg-blue-600 shadow-lg shadow-blue-900/20 hover:shadow-blue-600/30 hover:-translate-y-0.5",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 hover:-translate-y-0.5",
    outline: "border border-gray-300 bg-transparent hover:bg-gray-50 text-gray-700 hover:border-gray-400",
    ghost: "bg-transparent hover:bg-gray-100 text-gray-700"
  };

  const sizes = {
    sm: "text-sm px-4 py-2",
    md: "text-base px-6 py-3",
    lg: "text-lg px-8 py-4"
  };

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
