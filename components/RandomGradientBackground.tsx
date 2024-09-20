'use client';

import React, { useEffect, useState } from 'react';

const RandomGradientBackground: React.FC = () => {
  const [gradients, setGradients] = useState<JSX.Element[]>([]);

  useEffect(() => {
    const generateRandomPosition = () => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 300 + 100, // Random size between 100 and 400
    });

    const generateGradient = (key: string, classes: string, delay: number = 0) => {
      const { top, left, size } = generateRandomPosition();
      return (
        <div
          key={key}
          className={`absolute rounded-full ${classes}`}
          style={{
            top,
            left,
            width: `${size}px`,
            height: `${size}px`,
            animationDelay: `${delay}s`,
          }}
        />
      );
    };

    const newGradients = [
      generateGradient('large1', 'bg-gradient-to-br from-purple-500/30 via-pink-500/20 to-transparent blur-3xl animate-pulse animate-float'),
      generateGradient('large2', 'bg-gradient-to-tr from-green-500/20 via-emerald-500/10 to-transparent blur-3xl animate-pulse animate-float', 1),
      generateGradient('large3', 'bg-gradient-to-bl from-blue-500/20 via-cyan-500/10 to-transparent blur-2xl animate-pulse animate-float', 2),
      generateGradient('large4', 'bg-gradient-to-r from-yellow-500/20 via-orange-500/10 to-transparent blur-2xl animate-pulse animate-float', 3),
      generateGradient('large5', 'bg-gradient-to-l from-indigo-500/30 via-violet-500/20 to-transparent blur-2xl animate-pulse animate-float', 4),
    ];

    // Generate smaller elements
    for (let i = 0; i < 10; i++) {
      const { top, left, size } = generateRandomPosition();
      newGradients.push(
        <div
          key={`small${i}`}
          className="absolute rounded-full blur-xl animate-float"
          style={{
            top,
            left,
            width: `${size / 3}px`,
            height: `${size / 3}px`,
            background: `radial-gradient(circle, rgba(${Math.random()*255},${Math.random()*255},${Math.random()*255},0.3), transparent)`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      );
    }

    // Add parabolic shapes
    newGradients.push(
      <div key="parabolic1" className="absolute -top-40 left-0 right-0 h-80 bg-gradient-to-b from-teal-500/10 to-transparent blur-3xl transform rotate-6 animate-pulse" />,
      <div key="parabolic2" className="absolute -bottom-40 left-0 right-0 h-80 bg-gradient-to-t from-fuchsia-500/10 to-transparent blur-3xl transform -rotate-6 animate-pulse" />
    );

    setGradients(newGradients);
  }, []); // Empty dependency array ensures this effect runs only once on mount

  return (
    <div className="fixed inset-0 w-full min-h-screen overflow-hidden -z-10 bg-black">
      {gradients}
    </div>
  );
};

export default RandomGradientBackground;