// src/components/FileUploader.jsx
import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/FileUploader.css";

// ✅ Make sure these files exist in your project
import farmVideo from "../assets/video/farm.mp4";
import leafUpload from "../assets/images/leaf-upload.png";
import farmerHappy from "../assets/images/farmer-happy.png";

const FloatingBackground = ({ count = 8 }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const newItems = Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 90 + 5}%`,
      size: Math.random() * 20 + 12, // 12px to 32px
      delay: `${Math.random() * 8}s`,
      duration: `${Math.random() * 12 + 12}s`, // 12s to 24s
      type: Math.random() > 0.45 ? "leaf" : "particle",
    }));
    setItems(newItems);
  }, [count]);

  return (
    <div className="floating-container">
      {items.map((item) => (
        <div
          key={item.id}
          className={`floating-item ${item.type === "leaf" ? "leaf-item" : "particle"}`}
          style={{
            left: item.left,
            width: `${item.size}px`,
            height: `${item.size}px`,
            animationDelay: item.delay,
            animationDuration: item.duration,
          }}
        >
          {item.type === "leaf" && (
            <svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%">
              <path d="M17 8C8 10 5.9 16.1 5 20C9.1 19.1 15.2 17 17 8M2 2C2 2 11 3 16 10C21 17 22 22 22 22C22 22 17 21 10 16C3 11 2 2 2 2Z" />
            </svg>
          )}
        </div>
      ))}
    </div>
  );
};

const FileUploader = () => {
  const [file, setFile] = useState(null);
  const [diseaseFound, setDisease] = useState("None");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showIntro, setShowIntro] = useState(true);
  const fileInputRef = useRef(null);

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Auto-hide intro after few seconds (8s)
  useEffect(() => {
    const timer = setTimeout(() => setShowIntro(false), 8000);
    return () => clearTimeout(timer);
  }, []);

  // --- Handlers ---
  const handleClick = () => {
    setErrorMsg("");
    fileInputRef.current?.click();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setErrorMsg("");
    const dropped = e.dataTransfer?.files?.[0];
    if (dropped) setFile(dropped);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  const handleFileInputChange = (e) => {
    setErrorMsg("");
    const f = e.target?.files?.[0];
    if (f) setFile(f);
  };

  const handleDeleteFile = () => {
    setFile(null);
    setDisease("None");
    setErrorMsg("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

 const handleSubmit = async () => {
  setErrorMsg("");

  if (!file) {
    setErrorMsg("Please upload a leaf image first.");
    return;
  }

  if (!file.type.startsWith("image/")) {
    setErrorMsg("Please upload an image file (jpg / png).");
    return;
  }

  setLoading(true);
  setDisease("Detecting...");

  try {
    // 1️⃣ Create form data
    const formData = new FormData();
    formData.append("file", file); // ⚠️ backend expects "file"

    // 2️⃣ Call ML API
    const res = await fetch("https://api.biswajr.site/predict", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      throw new Error(`Server error: ${res.status}`);
    }

    // 3️⃣ Read ML response
    const data = await res.json();

    /*
      Expected response:
      {
        class_name: "Apple___Apple_scab",
        confidence: 7
      }
    */

    const diseaseName = data.class_name || "Unknown Disease";
    const confidence = data.confidence;

    // 4️⃣ Update UI
    setDisease(`${diseaseName} (Confidence: ${confidence}%)`);
  } catch (error) {
    console.error("ML Prediction Error:", error);
    setDisease("Error");
    setErrorMsg("Unable to analyze image. Please try again.");
  } finally {
    setLoading(false);
  }
};


  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div
      className={`file-uploader-page ${showIntro ? "no-scroll" : ""}`}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => e.preventDefault()}
    >
      {/* 🌿 Floating Bio-Particles and Leaves Background */}
      <FloatingBackground count={8} />

      {/* 🎥 Background Video */}
      <video className="farm-video" autoPlay loop muted playsInline>
        <source src={farmVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="overlay" />

      {/* 🌿 Intro Popup */}
      {showIntro && (
        <div className="intro-popup">
          <div className="intro-card">
            <h2>🌱 A Greener Tomorrow</h2>
            <p>
              At <strong>Plant Pulse</strong>, we’re on a mission to revolutionize agriculture
              through the power of artificial intelligence.
            </p>
            <p>
              Detect diseases early, save crops, reduce chemical use, and promote sustainable
              farming worldwide.
            </p>
            <p className="subtext">
              🌾 Together, we cultivate innovation, sustainability, and a greener tomorrow.
            </p>
            <img src={farmerHappy} alt="Happy farmer" className="intro-img" />
            <button className="continue-btn" onClick={() => setShowIntro(false)}>
              Continue ↓
            </button>
          </div>
        </div>
      )}

      {/* 🌱 Upload Section */}
      <main className={`UploadFile ${showIntro ? "hidden-section" : "visible-section"}`}>
        <button className="back-home-btn" onClick={handleGoHome}>
          ← Home
        </button>

        {/* Header */}
        <header className="upload-header">
          <h1 className="page-title">🌿 Plant Pulse</h1>
          <p className="subtitle">
            Upload a leaf photo and get instant AI-powered disease detection — protect your harvest.
          </p>
        </header>

        {/* Upload Box */}
        <div
          className="FileUploaderDiv"
          onClick={handleClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") handleClick();
          }}
        >
          <img
            className="uploadIMG"
            src={leafUpload}
            alt="Leaf upload icon"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />

          {!file ? (
            <div className="uploadedDataInfoDiv">
              <p className="big">📸 Upload or Drop a Leaf Image</p>
              <p className="small">JPEG / PNG / JPG — up to 10MB</p>
            </div>
          ) : (
            <div className="uploadedDataInfoDiv">
              <p className="file-name">File: {file.name}</p>
              <p className="file-type">Type: {file.type}</p>
              <p className="delete-text" onClick={handleDeleteFile}>
                ✖ Remove File
              </p>
            </div>
          )}

          {loading && (
            <div className="analysis-scanner-overlay">
              <div className="scanner-line"></div>
              <div className="scanner-spinner"></div>
              <p>AI Neural Scan in progress...</p>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFileInputChange}
          />
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <button
            className="submitButton"
            onClick={handleSubmit}
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? <span className="spinner" /> : "Analyze Leaf"}
          </button>

          <button
            className="secondary-btn"
            onClick={() => {
              if (file) handleDeleteFile();
              else fileInputRef.current?.click();
            }}
          >
            {file ? "Remove" : "Choose File"}
          </button>
        </div>

        {/* Results */}
        <p className="ptagDisease">
          {loading
            ? "🔍 Detecting disease..."
            : `🌾 Disease Found: ${diseaseFound}`}
        </p>

        {errorMsg && <p className="errorMsg">⚠️ {errorMsg}</p>}
      </main>

      {/* 🌱 Info Section */}
      <section className={`info-section ${showIntro ? "hidden-section" : "visible-section"}`}>
        <div className="info-content">
          <img
            src={farmerHappy}
            alt="Smiling farmer holding crops"
            className="info-img"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
          <div className="info-text">
            <h2>🌱 A Greener Tomorrow</h2>
            <p>
              At <strong>Plant Pulse</strong>, we’re on a mission to revolutionize agriculture
              through AI. Our goal is to help farmers detect plant diseases early —
              saving crops, reducing chemical use, and promoting sustainability.
            </p>
            <p>
              Every pixel of data we process brings farmers closer to better yields,
              cleaner soil, and a future where technology and nature grow hand in hand.
            </p>
            <p className="subtext">
              🌾 Together, we cultivate innovation, sustainability, and a greener tomorrow.
            </p>
          </div>
        </div>
      </section>

      {/* 🌍 Footer */}
      <footer className="footer-section">
        <p>
          © {new Date().getFullYear()} <strong>Plant Pulse</strong> — Empowering Smart Farming with AI 🌱
        </p>
      </footer>
    </div>
  );
};

export default FileUploader;
