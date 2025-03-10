import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { XRButton } from "three/examples/jsm/webxr/XRButton.js";

const ARCamera = () => {
  const containerRef = useRef(null);
  const [started, setStarted] = useState(false);
  const [placed, setPlaced] = useState(false);
  const [status, setStatus] = useState("Not Started");

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

    const barGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
    const fontLoader = new THREE.FontLoader();

    let bars = [];
    let texts = [];
    let randomNumbers = [5, 3, 8, 6, 2];
    let objectsPlaced = false;

    // Generate 3D Bars with Numbers
    randomNumbers.forEach((num, index) => {
      const material = new THREE.MeshBasicMaterial({
        color: Math.random() * 0xffffff,
      });
      const bar = new THREE.Mesh(barGeometry, material);
      bar.position.set(index * 0.2 - 0.5, num * 0.05 - 0.3, -1);
      bar.scale.y = num * 0.1;
      bar.scale.x = 0.05;
      scene.add(bar);
      bars.push(bar);

      // Add Numbers
      const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const textGeometry = new THREE.TextGeometry(`${num}`, {
        font: new THREE.FontLoader().parse(
          require("three/examples/fonts/helvetiker_regular.typeface.json")
        ),
        size: 0.05,
        height: 0.01,
      });
      const textMesh = new THREE.Mesh(textGeometry, textMaterial);
      textMesh.position.set(index * 0.2 - 0.5, num * 0.1 - 0.15, -1);
      scene.add(textMesh);
      texts.push(textMesh);
    });

    // Click event to place object
    window.addEventListener("click", () => {
      if (!objectsPlaced) {
        setPlaced(true);
        objectsPlaced = true;
        setStatus("Sorting in progress...");

        // Start Merge Sort
        mergeSort(randomNumbers, 0, randomNumbers.length - 1);
      }
    });

    // Merge Sort Algorithm
    const merge = (arr, l, m, r) => {
      let n1 = m - l + 1;
      let n2 = r - m;

      let L = arr.slice(l, m + 1);
      let R = arr.slice(m + 1, r + 1);

      let i = 0,
        j = 0,
        k = l;
      while (i < n1 && j < n2) {
        setStatus(`Comparing ${L[i]} and ${R[j]}`);
        if (L[i] <= R[j]) {
          arr[k] = L[i];
          animateBar(bars[k], texts[k], L[i]);
          i++;
        } else {
          arr[k] = R[j];
          animateBar(bars[k], texts[k], R[j]);
          j++;
        }
        k++;
      }

      while (i < n1) {
        animateBar(bars[k], texts[k], L[i]);
        i++;
        k++;
      }

      while (j < n2) {
        animateBar(bars[k], texts[k], R[j]);
        j++;
        k++;
      }
    };

    const mergeSort = (arr, l, r) => {
      if (l >= r) return;

      let m = l + Math.floor((r - l) / 2);

      mergeSort(arr, l, m);
      mergeSort(arr, m + 1, r);
      merge(arr, l, m, r);

      if (l === 0 && r === arr.length - 1) {
        setStatus("Sorted Successfully!");
      }
    };

    const animateBar = (bar, text, value) => {
      bar.scale.y = value * 0.1;
      bar.position.y = value * 0.05 - 0.3;
      text.position.y = value * 0.1 - 0.15;
      text.geometry = new THREE.TextGeometry(`${value}`, {
        font: new THREE.FontLoader().parse(
          require("three/examples/fonts/helvetiker_regular.typeface.json")
        ),
        size: 0.05,
        height: 0.01,
      });
    };

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
      <p
        style={{
          position: "absolute",
          top: "10px",
          color: "white",
          fontSize: "18px",
        }}
      >
        {status}
      </p>
      {!started ? (
        <button
          onClick={() => setStarted(true)}
          style={{ padding: "10px 20px", fontSize: "18px" }}
        >
          Merge Sort
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
