import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { XRButton } from "three/examples/jsm/webxr/XRButton.js";

const ARCamera = () => {
  const containerRef = useRef(null);
  const [started, setStarted] = useState(false);
  const [placed, setPlaced] = useState(false);
  const [status, setStatus] = useState("Not Started");
  const rendererRef = useRef(null);

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
    rendererRef.current = renderer;

    containerRef.current.appendChild(renderer.domElement);
    containerRef.current.appendChild(XRButton.createButton(renderer));

    const barGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);

    let bars = [];
    let randomNumbers = [5, 3, 8, 6, 2];
    let objectsPlaced = false;

    // Generate 3D Bars
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
          bars[k].scale.y = L[i] * 0.1;
          i++;
        } else {
          arr[k] = R[j];
          bars[k].scale.y = R[j] * 0.1;
          j++;
        }
        k++;
      }

      while (i < n1) {
        bars[k].scale.y = L[i] * 0.1;
        i++;
        k++;
      }

      while (j < n2) {
        bars[k].scale.y = R[j] * 0.1;
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

    // Render loop
    const animate = () => {
      renderer.setAnimationLoop(() => {
        renderer.render(scene, camera);
      });
    };

    animate();
  }, [started, placed]);

  const captureScreenshot = () => {
    if (rendererRef.current) {
      const image = rendererRef.current.domElement.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = "merge_sort_ar.png";
      link.click();
    }
  };

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
      {placed ? (
        <button
          onClick={captureScreenshot}
          style={{
            padding: "10px 20px",
            fontSize: "18px",
            position: "absolute",
            bottom: "60px",
          }}
        >
          Capture Screenshot
        </button>
      ) : null}
    </div>
  );
};

export default ARCamera;
