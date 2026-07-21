import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function ThreeBackground() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // --- 1. Basic Setup ---
    const width = window.innerWidth;
    const height = window.innerHeight;

    const scene = new THREE.Scene();
    
    // Setup camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 1, 1000);
    camera.position.z = 250;
    camera.position.y = 150;
    camera.lookAt(0, 0, 0);

    // Setup renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    containerRef.current.appendChild(renderer.domElement);

    // --- 2. Create Glowing Circle Particle Texture ---
    const createCircleTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 32;
      canvas.height = 32;
      const ctx = canvas.getContext('2d');
      const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(0.2, 'rgba(139, 92, 246, 0.8)'); // Violet core
      gradient.addColorStop(0.5, 'rgba(6, 182, 212, 0.4)');  // Cyan outer halo
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 32, 32);
      return new THREE.CanvasTexture(canvas);
    };

    const particleTexture = createCircleTexture();

    // --- 3. Construct Particle Grid ---
    const numParticlesX = 60;
    const numParticlesZ = 60;
    const separation = 15;
    const count = numParticlesX * numParticlesZ;

    const positions = new Float32Array(count * 3);
    const initialY = new Float32Array(count); // Store baseline heights

    let idx = 0;
    for (let x = 0; x < numParticlesX; x++) {
      for (let z = 0; z < numParticlesZ; z++) {
        // Center the grid around (0,0)
        const posX = (x - numParticlesX / 2) * separation;
        const posZ = (z - numParticlesZ / 2) * separation;
        
        positions[idx * 3] = posX;
        positions[idx * 3 + 1] = 0; // Will be animated
        positions[idx * 3 + 2] = posZ;

        initialY[idx] = 0;
        idx++;
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Points Material using custom circular glowing texture
    const material = new THREE.PointsMaterial({
      size: 5,
      map: particleTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // --- 4. Interactive Parallax & Animation variables ---
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;

    const handleMouseMove = (event) => {
      const windowHalfX = window.innerWidth / 2;
      const windowHalfY = window.innerHeight / 2;
      
      // Calculate normalized mouse positions (-1 to 1)
      mouseX = (event.clientX - windowHalfX) / windowHalfX;
      mouseY = (event.clientY - windowHalfY) / windowHalfY;

      // Set target rotation based on cursor location
      targetRotationY = mouseX * 0.25;
      targetRotationX = mouseY * 0.15;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // --- 5. Resize Event Listener ---
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // --- 6. Animation Loop ---
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const time = clock.getElapsedTime() * 0.8;
      const positionAttr = geometry.attributes.position;
      const array = positionAttr.array;

      // Animate particle grid heights dynamically using dual-sine wave calculations
      let pIdx = 0;
      for (let x = 0; x < numParticlesX; x++) {
        for (let z = 0; z < numParticlesZ; z++) {
          const xFactor = x * 0.15;
          const zFactor = z * 0.15;
          
          // Wave height calculation
          const yVal = Math.sin(xFactor + time) * 15 + Math.cos(zFactor + time) * 15;
          
          // Update Y index in the position array
          array[pIdx * 3 + 1] = yVal;
          pIdx++;
        }
      }
      
      positionAttr.needsUpdate = true;

      // Smooth camera/scene rotation parallax (interpolation)
      particles.rotation.y += (targetRotationY - particles.rotation.y) * 0.05;
      particles.rotation.x += (targetRotationX - particles.rotation.x) * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    // --- 7. Cleanup Function ---
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      
      // Dispose resources to prevent GPU memory leaks
      geometry.dispose();
      material.dispose();
      particleTexture.dispose();
      renderer.dispose();
      
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        pointerEvents: 'none',
        overflow: 'hidden',
        background: 'transparent'
      }}
    />
  );
}
