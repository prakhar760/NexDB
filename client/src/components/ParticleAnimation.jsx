import React, { useEffect, useRef, useContext } from 'react';
import { ThemeContext } from '../ThemeContext';

const ParticleAnimation = ({ className }) => {
  const canvasRef = useRef(null);
  const { isDarkMode } = useContext(ThemeContext);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const particles = [];
    const particleCount = 20; // Reduced count for smaller areas
    const connectionDistance = 50;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5 + 0.5,
        vx: Math.random() * 0.2 - 0.1,
        vy: Math.random() * 0.2 - 0.1,
      });
    }

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, i) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = isDarkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)';
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[j].x - particle.x;
          const dy = particles[j].y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = isDarkMode 
              ? `rgba(255, 255, 255, ${0.1 - distance / connectionDistance / 10})`
              : `rgba(0, 0, 0, ${0.1 - distance / connectionDistance / 10})`;
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(drawParticles);
    };

    drawParticles();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDarkMode]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 ${className}`}
    />
  );
};

export default ParticleAnimation;