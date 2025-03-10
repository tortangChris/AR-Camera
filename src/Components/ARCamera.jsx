import React, { useRef, useEffect, useState } from "react";

const ARCamera = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" }, // Back camera
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
      }
    };

    startCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const captureImage = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (canvas && video) {
      const context = canvas.getContext("2d");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      setCapturedImage(canvas.toDataURL("image/png")); // Save as Base64
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>AR Camera</h1>

      <div style={styles.cameraContainer}>
        <video ref={videoRef} autoPlay playsInline style={styles.video} />
        <canvas ref={canvasRef} style={{ display: "none" }} />
      </div>

      <button style={styles.captureButton} onClick={captureImage}>
        📸 Capture
      </button>

      {capturedImage && (
        <div style={styles.imagePreview}>
          <h3>Captured Image:</h3>
          <img src={capturedImage} alt="Captured" style={styles.capturedImg} />
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    padding: "20px",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
  },
  cameraContainer: {
    width: "300px",
    height: "300px",
    border: "3px solid black",
    margin: "auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderRadius: "10px",
    backgroundColor: "#000",
  },
  video: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  captureButton: {
    marginTop: "10px",
    padding: "10px 20px",
    fontSize: "18px",
    fontWeight: "bold",
    backgroundColor: "#007BFF",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  imagePreview: {
    marginTop: "20px",
  },
  capturedImg: {
    width: "300px",
    borderRadius: "10px",
    border: "2px solid #000",
  },
};

export default ARCamera;
