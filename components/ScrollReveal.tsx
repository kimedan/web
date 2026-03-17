
import React, { useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  width?: 'full' | 'auto'; // Container width
  delay?: number; // Delay in seconds
  mode?: 'fade-up' | 'scale'; // Animation type
  className?: string;
  viewportThreshold?: number; // Percentage of element visible to trigger
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({ 
  children, 
  width = 'full', 
  delay = 0,
  mode = 'fade-up',
  className = '',
  viewportThreshold = 0.15
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Toggle visibility based on intersection state
        // This enables the "fade out naturally when scrolling back up" effect
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: viewportThreshold, 
        // Trigger a bit before it leaves/enters completely for smoothness
        rootMargin: '0px 0px -50px 0px' 
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [viewportThreshold]);

  const baseClass = mode === 'fade-up' ? 'reveal-hidden' : 'scale-hidden';
  const visibleClass = mode === 'fade-up' ? 'reveal-visible' : 'scale-visible';
  const widthClass = width === 'full' ? 'w-full' : 'w-auto inline-block';

  return (
    <div
      ref={ref}
      className={`${widthClass} ${baseClass} ${isVisible ? visibleClass : ''} ${className}`}
      style={{ transitionDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
};

export default ScrollReveal;
