import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { ThemeContext } from '../ThemeContext';

const GradientWaveBackground = () => {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      <svg
        className="absolute bottom-0 left-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        viewBox="0 24 150 28"
        preserveAspectRatio="none"
      >
        <defs>
          <path
            id="wave"
            d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
          />
        </defs>
        <g className="waves">
          <use
            xlinkHref="#wave"
            x="48"
            y="0"
            fill={isDarkMode ? 'rgba(76, 29, 149, 0.7)' : 'rgba(59, 130, 246, 0.7)'}
          >
            <animateTransform
              attributeName="transform"
              attributeType="XML"
              type="translate"
              dur="10s"
              calcMode="spline"
              values="0 0; 40 0; 0 0"
              keyTimes="0; 0.5; 1"
              keySplines="0.5 0 0.5 1; 0.5 0 0.5 1"
              repeatCount="indefinite"
            />
          </use>
          <use
            xlinkHref="#wave"
            x="48"
            y="3"
            fill={isDarkMode ? 'rgba(124, 58, 237, 0.5)' : 'rgba(96, 165, 250, 0.5)'}
          >
            <animateTransform
              attributeName="transform"
              attributeType="XML"
              type="translate"
              dur="8s"
              calcMode="spline"
              values="0 0; -40 0; 0 0"
              keyTimes="0; 0.5; 1"
              keySplines="0.5 0 0.5 1; 0.5 0 0.5 1"
              repeatCount="indefinite"
            />
          </use>
          <use
            xlinkHref="#wave"
            x="48"
            y="5"
            fill={isDarkMode ? 'rgba(167, 139, 250, 0.3)' : 'rgba(147, 197, 253, 0.3)'}
          >
            <animateTransform
              attributeName="transform"
              attributeType="XML"
              type="translate"
              dur="6s"
              calcMode="spline"
              values="0 0; 120 0; 0 0"
              keyTimes="0; 0.5; 1"
              keySplines="0.5 0 0.5 1; 0.5 0 0.5 1"
              repeatCount="indefinite"
            />
          </use>
        </g>
      </svg>
    </div>
  );
};

export default GradientWaveBackground;