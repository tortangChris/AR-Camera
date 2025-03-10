import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { XRButton } from "three/examples/jsm/webxr/XRButton.js";

const ARCamera = () => {
  const containerRef = useRef(null);
  const [started, setStarted] = useState(false);
  const [placed, setPlaced] = useState(false);

  useEffect(() => {
    if (!started) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.1,
      10
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;

    containerRef.current.appendChild(renderer.domElement);
    containerRef.current.appendChild(XRButton.createButton(renderer));

    const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);

    let bars = [];
    let randomNumbers = [5, 3, 8, 6, 2];
    let objectsPlaced = false;

    // Generate 3D Bars
    randomNumbers.forEach((num, index) => {
      const material = new THREE.MeshBasicMaterial({
        color: Math.random() * 0xffffff,
      });
      const cube = new THREE.Mesh(geometry, material);
      cube.position.set(index * 0.15 - 0.3, num * 0.05 - 0.3, -1);
      cube.scale.y = num * 0.1;
      scene.add(cube);
      bars.push(cube);
    });

    // Click event to place object
    window.addEventListener("click", () => {
      if (!objectsPlaced) {
        setPlaced(true);
        objectsPlaced = true;
      }
    });

    // Bubble Sort Animation
    let i = 0;
    let j = 0;

    const sortInterval = setInterval(() => {
      if (placed && i < randomNumbers.length) {
        if (j < randomNumbers.length - i - 1) {
          if (randomNumbers[j] > randomNumbers[j + 1]) {
            // Swap values
            let temp = randomNumbers[j];
            randomNumbers[j] = randomNumbers[j + 1];
            randomNumbers[j + 1] = temp;

            // Animate Bars
            let tempPos = bars[j].position.y;
            bars[j].position.y = bars[j + 1].position.y;
            bars[j + 1].position.y = tempPos;

            let tempScale = bars[j].scale.y;
            bars[j].scale.y = bars[j + 1].scale.y;
            bars[j + 1].scale.y = tempScale;
          }
          j++;
        } else {
          i++;
          j = 0;
        }
      } else if (placed) {
        clearInterval(sortInterval);
      }
    }, 500);

    // Render loop
    const animate = () => {
      renderer.setAnimationLoop(() => {
        renderer.render(scene, camera);
      });
    };

    animate();
  }, [started, placed]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      {!started ? (
        <button
          onClick={() => setStarted(true)}
          style={{ padding: "10px 20px", fontSize: "18px" }}
        >
          Bubble Sort
        </button>
      ) : null}
      {started && !placed ? (
        <button
          onClick={() => setPlaced(true)}
          style={{
            padding: "10px 20px",
            fontSize: "18px",
            position: "absolute",
            bottom: "20px",
          }}
        >
          Start
        </button>
      ) : null}
    </div>
  );
};

export default ARCamera;
