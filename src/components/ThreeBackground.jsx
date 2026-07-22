import React, { useEffect, useRef } from 'react';

export function ThreeBackground() {
  const containerRef = useRef(null);
  const vantaEffect = useRef(null);

  useEffect(() => {
    const initVanta = () => {
      if (window.VANTA && window.VANTA.GLOBE && containerRef.current && !vantaEffect.current) {
        vantaEffect.current = window.VANTA.GLOBE({
          el: containerRef.current,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.00,
          minWidth: 200.00,
          scale: 1.00,
          scaleMobile: 1.00,
          color: 0x8b5cf6,        // Violet core
          color2: 0x06b6d4,       // Cyan highlight
          size: 1.40,             // Expanded size for full page impact
          backgroundColor: 0x0c0e1a // Deep space background matching theme
        });
      }
    };

    if (window.VANTA && window.VANTA.GLOBE) {
      initVanta();
    } else {
      const checkInterval = setInterval(() => {
        if (window.VANTA && window.VANTA.GLOBE) {
          initVanta();
          clearInterval(checkInterval);
        }
      }, 100);

      return () => clearInterval(checkInterval);
    }

    const handleResize = () => {
      if (vantaEffect.current) {
        vantaEffect.current.resize();
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (vantaEffect.current) {
        vantaEffect.current.destroy();
        vantaEffect.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      id="vanta-globe-bg"
      style={{
        position: 'fixed',
        top: '4.5rem',
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: 'calc(100vh - 4.5rem)',
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden'
      }}
    />
  );
}
