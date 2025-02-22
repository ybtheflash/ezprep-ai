"use client";

import { useState, useEffect } from 'react';

type FlightPattern = 'around' | 'across' | 'free';

interface FloatingShipProps {
  shipNumber: number;
  initialX?: number;
  initialY?: number;
  pattern: FlightPattern;
}

export function FloatingShip({ shipNumber, initialX, initialY, pattern }: FloatingShipProps) {
  const [isExploding, setIsExploding] = useState(false);
  const [explosionFrame, setExplosionFrame] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const totalExplosionFrames = 11;
  
  // Handle ship movement
  useEffect(() => {
    let startX = 0, startY = 0;
    let speedX = 0, speedY = 0;
    let angle = 0;

    switch (pattern) {
      case 'around':
        startX = initialX ?? window.innerWidth / 2;
        startY = initialY ?? 200;
        angle = Math.random() * Math.PI * 2;
        speedX = 0; // Not used for circular motion
        speedY = 0; // Not used for circular motion
        break;
      
      case 'across':
        startX = initialX ?? 100;
        startY = initialY ?? 150;
        speedX = 1.2;
        speedY = 0; // Controlled by oscillation
        break;
      
      case 'free':
        startX = initialX ?? Math.random() * (window.innerWidth - 200) + 100;
        startY = initialY ?? Math.random() * 300 + 100;
        speedX = 1.2 * (Math.random() > 0.5 ? 1 : -1);
        speedY = 0.8 * (Math.random() > 0.5 ? 1 : -1);
        break;
    }
    
    setPosition({ x: startX, y: startY });
    setDirection(speedX > 0 ? 'right' : 'left');

    const moveShip = () => {
      setPosition(prev => {
        let newX = prev.x;
        let newY = prev.y;

        switch (pattern) {
          case 'around':
            // Large circular movement at the top
            angle += 0.003;
            newX = window.innerWidth/2 + Math.cos(angle) * 400;
            newY = 200 + Math.sin(angle) * 100;
            setDirection(Math.cos(angle) > 0 ? 'right' : 'left');
            break;

          case 'across':
            // Horizontal movement only
            newX = prev.x + speedX;
            if (newX <= 100 || newX >= window.innerWidth - 180) {
              speedX = -speedX;
              setDirection(speedX > 0 ? 'right' : 'left');
            }
            // Keep it in the upper area with smoother oscillation
            newY = 150 + Math.sin(Date.now() / 1500) * 30;
            break;

          case 'free':
            // Diagonal bouncing movement
            newX = prev.x + speedX;
            newY = prev.y + speedY;
            
            if (newX <= 100 || newX >= window.innerWidth - 180) {
              speedX = -speedX;
              setDirection(speedX > 0 ? 'right' : 'left');
              // Add stronger vertical speed change on horizontal bounce
              speedY += (Math.random() - 0.5) * 0.8;
              // Encourage diagonal movement
              if (Math.abs(speedY) < 0.3) speedY = 0.3 * (speedY >= 0 ? 1 : -1);
            }
            if (newY <= 100 || newY >= 400) {
              speedY = -speedY;
              // Add stronger horizontal speed change on vertical bounce
              speedX += (Math.random() - 0.5) * 0.8;
              // Ensure horizontal movement
              if (Math.abs(speedX) < 0.3) speedX = 0.3 * (speedX >= 0 ? 1 : -1);
            }
            break;
        }

        // Normalize speed after random changes
        const maxSpeed = 1.2;
        speedX = Math.max(-maxSpeed, Math.min(maxSpeed, speedX));
        speedY = Math.max(-maxSpeed, Math.min(maxSpeed, speedY));
        
        return {
          x: Math.max(100, Math.min(window.innerWidth - 180, newX)),
          y: Math.max(100, Math.min(400, newY))
        };
      });
    };
    
    const movementInterval = setInterval(moveShip, 16);  // ~60fps for smoother movement
    
    // Add slight random variations periodically
    const variationInterval = setInterval(() => {
      speedX = (Math.random() * 0.2 + 0.7) * (speedX > 0 ? 1 : -1);
      speedY = (Math.random() * 0.2 + 0.3);
    }, 10000 + Math.random() * 5000);

    return () => {
      clearInterval(movementInterval);
      clearInterval(variationInterval);
    };
  }, []);
  
  // Handle explosion animation
  useEffect(() => {
    if (!isExploding) return;
    
    const frameInterval = setInterval(() => {
      setExplosionFrame(prev => {
        if (prev >= totalExplosionFrames) {
          setIsExploding(false);
          return 1;
        }
        return prev + 1;
      });
    }, 100);
    
    return () => clearInterval(frameInterval);
  }, [isExploding]);
  
  const handleClick = () => {
    if (!isExploding) {
      setIsExploding(true);
      setExplosionFrame(1);
    }
  };
  
  return (
    <div
      className="fixed transition-all duration-700 cursor-pointer"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        animation: `float-${pattern} ${pattern === 'across' ? 4 : pattern === 'around' ? 8 : 6}s ease-in-out infinite`,
        zIndex: 1,
        transform: `scaleX(${direction === 'left' ? -1 : 1})`
      }}
      onClick={handleClick}
    >
      {isExploding ? (
        <img
          src={`/images/Explosion1/Explosion1_${explosionFrame}.png`}
          alt="Explosion"
          width={80}
          height={80}
          className="object-contain drop-shadow-[0_0_2px_rgba(255,255,255,0.6)]"
        />
      ) : (
        <img
          src={`/images/Ship${shipNumber}.png`}
          alt="Floating Ship"
          width={60}
          height={60}
          className="object-contain drop-shadow-[0_0_2px_rgba(255,255,255,0.6)]"
        />
      )}
    </div>
  );
}