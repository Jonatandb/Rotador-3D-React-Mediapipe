// src/Cube.js
import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame , useLoader} from '@react-three/fiber';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader'
import meshUrl from '/models/realistic_human_heart/scene.gltf'

const Cube = ({rotation}) => {
  const meshRef = useRef({ x: 0, y: 0 });
  // Cargar el modelo GLTF
  const scene = useLoader(GLTFLoader, meshUrl)
  // Variables para almacenar las rotaciones suavizadas
  const smoothedRotation = useRef({ x: 0, y: 0 });
  // Variable para almacenar el escalado suavizado
  const smoothedScale = useRef(1);

  // Factor de suavizado (ajustable)
  const smoothingFactor = 0.25;  // Valor entre 0 y 1
  

  useEffect(() => {
    if (rotation && rotation.length > 0) {
      const x = rotation[0].x;
      const y = rotation[0].y;
      const thumbTip = rotation[4]; // Punta del pulgar
      const pinkyTip = rotation[20]; // Punta del meñique
      const distance = Math.sqrt(
        Math.pow(thumbTip.x - pinkyTip.x, 2) +
        Math.pow(thumbTip.y - pinkyTip.y, 2) +
        Math.pow(thumbTip.z - pinkyTip.z, 2)
      );
      const scale = Math.min(Math.max(0.8 / distance, 1), 4); // Limitar el rango de escala
      // Aplicar suavizado exponencial al escalado
      smoothedScale.current += (scale - smoothedScale.current) * 0.2;
      meshRef.current.scale.set(smoothedScale.current, smoothedScale.current, smoothedScale.current);
  
      const targetRotationX = y * Math.PI * 2;
      const targetRotationY = x * Math.PI * 2;
      // Aplicar suavizado exponencial
      if(smoothedRotation.current.x < 1){
        smoothedRotation.current.x = targetRotationX;
        smoothedRotation.current.y = targetRotationY;
      }else{
        smoothedRotation.current.x += (targetRotationX - smoothedRotation.current.x) * smoothingFactor;
        smoothedRotation.current.y += (targetRotationY - smoothedRotation.current.y) * smoothingFactor;
      }
      
      // Aplicar las rotaciones suavizadas al modelo
      meshRef.current.rotation.x = smoothedRotation.current.x+0.3;
      meshRef.current.rotation.y = -smoothedRotation.current.y+3;
    }
  }, [rotation]);

  return (
    <primitive 
      ref={meshRef} 
      object={scene.scene} 
      scale={2} 
    />
  );
};

const Scene = ({rotation}) => {
  const handleCreated = ({ gl }) => {
    // Establecer la proporción de píxeles más baja
    gl.setSize(window.innerWidth, window.innerHeight); // Establecer tamaño del canvas
  };
  return (
    <>
    <Canvas
      style={{ background: 'black' , height: '100vh'}} // Fondo negro
      onCreated={handleCreated}
    >
      <directionalLight
        position={[1.0, 1.0, 5]}
        intensity={Math.PI * 2}
      />
      <Cube rotation={rotation}/>
    </Canvas>
    </>
  );
};

export default Scene;
