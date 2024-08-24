import React, { useRef, useEffect } from "react";
import * as THREE from "three";

const ThreeScene = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    // Escena
    const scene = new THREE.Scene();

    // Cámara
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    // Renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Geometría y Material (un cubo simple)
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // Función de animación
    const animate = () => {
      renderer.render(scene, camera);
    };

    animate();

    // Limpiar el montaje al desmontar el componente
    return () => {
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} style={{ width: "100%", height: "100vh" }} />;
};

export default ThreeScene;
