
import React from 'react';
import { useSite } from '../contexts/SiteContext';

interface LogoProps {
  color?: string; // Hex color or 'white'
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ color = '#071D49', className = '' }) => {
  const { config } = useSite();

  // If a custom logo URL exists in config
  if (config.logoUrl) {
    // Check if the logo source is likely a white version based on filename
    // This is a heuristic to support the user's specific request without breaking other potential colored uploads
    const isWhiteSource = config.logoUrl.toLowerCase().includes('white');

    let style: React.CSSProperties = {};

    if (isWhiteSource) {
      // If source is white:
      if (color === 'white') {
        // We want white, it is white.
        style = {};
      } else {
        // We want dark (e.g. #071D49) for white backgrounds (scrolled header, footer).
        // Since we can't easily colorize white to specific hex with simple filters,
        // we invert it to make it black for high visibility.
        // brightness(0) on white makes it black.
        style = { filter: 'brightness(0)' }; 
      }
    } else {
      // Default behavior (assuming source is dark/colored)
      style = color === 'white' 
        ? { filter: 'brightness(0) invert(1) grayscale(1)' } 
        : {};
    }

    return (
      <img 
        src={config.logoUrl} 
        alt={config.siteName} 
        className={`object-contain ${className}`}
        style={style}
      />
    );
  }

  // Fallback SVG Logo
  // Increased viewBox width to 360 to prevent "CO., LTD." from being cut off.
  // Tightened spacing between symbol and text for better ratio.
  return (
    <svg 
      viewBox="0 0 360 64" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={`max-w-full ${className}`}
      aria-label="Daewoo Metal Logo"
      preserveAspectRatio="xMinYMid meet"
    >
      {/* DMC Symbol Group */}
      <g stroke={color} strokeWidth="5" strokeLinecap="square">
        {/* D */}
        <path d="M10 12H35C48 12 55 20 55 32C55 44 48 52 35 52H10V12Z" />
        {/* M */}
        <path d="M75 52V12H88L103 38L118 12H131V52" strokeLinejoin="miter"/>
        {/* C */}
        <path d="M151 52H191" />
        <path d="M191 12H151V52" />
      </g>
      
      {/* Text Group - Moved closer to symbol (x=210) and ensured font sizes fit */}
      <g fill={color} style={{ fontFamily: '"Noto Sans KR", sans-serif' }}>
        <text x="210" y="34" fontWeight="800" fontSize="28" letterSpacing="-0.5px">DAEWOO</text>
        <text x="210" y="54" fontWeight="600" fontSize="13" letterSpacing="0.15em">METAL CO., LTD.</text>
      </g>
    </svg>
  );
};

export default Logo;
