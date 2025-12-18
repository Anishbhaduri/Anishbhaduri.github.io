import React, { useState } from "react";
import { Menu, GitCompare, Leaf, ArrowLeft } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { useNavigate } from "react-router-dom";
import "../css/sanagro.css";

/* =======================
   Crop Images
======================= */
import apple from "../assets/images/Crops/apple.jpg";
import banana from "../assets/images/Crops/banana.jpg";
import blackgram from "../assets/images/Crops/blackgram.jpg";
import cabbage from "../assets/images/Crops/cabbage.jpg";
import chickpea from "../assets/images/Crops/chickpea.jpg";
import coconut from "../assets/images/Crops/coconut.jpg";
import coffee from "../assets/images/Crops/coffee.jpg";
import cotton from "../assets/images/Crops/cotton.jpg";
import grapes from "../assets/images/Crops/grapes.jpg";
import jute from "../assets/images/Crops/jute.jpg";
import kidneybeans from "../assets/images/Crops/kidneybeans.jpg";
import lentil from "../assets/images/Crops/lentil.jpg";
import maize from "../assets/images/Crops/maize.jpg";
import mango from "../assets/images/Crops/mango.jpg";
import mothbeans from "../assets/images/Crops/mothbeans.jpg";
import mungbean from "../assets/images/Crops/mungbean.jpg";
import muskmelon from "../assets/images/Crops/muskmelon.jpg";
import orange from "../assets/images/Crops/orange.jpg";
import papaya from "../assets/images/Crops/papaya.jpg";
import pigeonpeas from "../assets/images/Crops/pigeonpeas.jpg";
import pomegranate from "../assets/images/Crops/pomegran.jpg";
import rice from "../assets/images/Crops/rice.jpg";
import watermelon from "../assets/images/Crops/watermelon.jpg";

/* =======================
   Image Map
======================= */
const CROP_IMAGES = {
  Apple: apple,
  Banana: banana,
  Blackgram: blackgram,
  Cabbage: cabbage,
  Chickpea: chickpea,
  Coconut: coconut,
  Coffee: coffee,
  Cotton: cotton,
  Grapes: grapes,
  Jute: jute,
  Kidneybeans: kidneybeans,
  Lentil: lentil,
  Maize: maize,
  Mango: mango,
  Mothbeans: mothbeans,
  Mungbean: mungbean,
  Muskmelon: muskmelon,
  Orange: orange,
  Papaya: papaya,
  Pigeonpeas: pigeonpeas,
  Pomegranate: pomegranate,
  Rice: rice,
  Watermelon: watermelon,
};

/* =======================
   Crop Data (Demo)
======================= */
const CROPS = Object.keys(CROP_IMAGES).map((name) => ({
  name,
  N: Math.floor(Math.random() * 120) + 20,
  P: Math.floor(Math.random() * 140) + 20,
  K: Math.floor(Math.random() * 200) + 20,
  R: Math.floor(Math.random() * 250) + 30,
}));

export default function SanAgroPage() {
  const navigate = useNavigate();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeCrop, setActiveCrop] = useState(null);
  const [isCompareMode, setIsCompareMode] = useState(false);
  const [compareSelection, setCompareSelection] = useState([]);

  /* =======================
     Crop Selection Logic
  ======================= */
  const selectCrop = (crop) => {
    if (!isCompareMode) {
      setActiveCrop(crop);
      return;
    }

    setCompareSelection((prev) => {
      const exists = prev.find((c) => c.name === crop.name);
      if (exists) return prev.filter((c) => c.name !== crop.name);
      if (prev.length < 2) return [...prev, crop];
      return [prev[1], crop];
    });
  };

  const toggleCompareMode = () => {
    setIsCompareMode((v) => !v);
    setActiveCrop(null);
    setCompareSelection([]);
  };

  return (
    <div className="enterprise-layout">
      {/* ================= HEADER ================= */}
      <header className="enterprise-header">
        <div className="header-left">
          <button className="icon-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <Menu />
          </button>
          <h1><Leaf /> Dashboard </h1>
        </div>

        <div className="header-actions">
          <button className="back-btn" onClick={() => navigate("/")}>
            <ArrowLeft /> Home
          </button>

          <button
            className={`compare-toggle ${isCompareMode ? "active" : ""}`}
            onClick={toggleCompareMode}
          >
            <GitCompare /> Compare
          </button>
        </div>
      </header>

      {/* ================= SIDEBAR ================= */}
      <aside className={`enterprise-sidebar ${isSidebarOpen ? "open" : ""}`}>
        <h3>Crop Catalog</h3>

        {CROPS.map((crop) => (
          <div
            key={crop.name}
            className="crop-nav-item"
            onClick={() => selectCrop(crop)}
          >
            <img src={CROP_IMAGES[crop.name]} alt={crop.name} />
            <div>
              <strong>{crop.name}</strong>
              <span>Analytics</span>
            </div>
          </div>
        ))}
      </aside>

      {/* ================= MAIN ================= */}
      <main className="enterprise-main">
        {!activeCrop && !isCompareMode && (
          <div className="enterprise-card hero">
            <h2>Global Crop Intelligence Platform</h2>
            <p>Select a crop to view analytics or enable compare mode.</p>
          </div>
        )}

        {activeCrop && !isCompareMode && (
          <div className="enterprise-card">
            <div className="crop-header">
              <img src={CROP_IMAGES[activeCrop.name]} alt={activeCrop.name} />
              <div>
                <h2>{activeCrop.name}</h2>
                <p>Nutrient & rainfall profile</p>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={320}>
              <BarChart
                data={[
                  { label: "Nitrogen", value: activeCrop.N },
                  { label: "Phosphorus", value: activeCrop.P },
                  { label: "Potassium", value: activeCrop.K },
                  { label: "Rainfall", value: activeCrop.R },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#2f855a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {isCompareMode && (
          <div className="enterprise-card">
            <h2>Crop Comparison</h2>

            {compareSelection.length === 2 ? (
              <ResponsiveContainer width="100%" height={340}>
                <BarChart
                  data={[
                    { label: "Nitrogen", A: compareSelection[0].N, B: compareSelection[1].N },
                    { label: "Phosphorus", A: compareSelection[0].P, B: compareSelection[1].P },
                    { label: "Potassium", A: compareSelection[0].K, B: compareSelection[1].K },
                    { label: "Rainfall", A: compareSelection[0].R, B: compareSelection[1].R },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="A" fill="#2f855a" />
                  <Bar dataKey="B" fill="#3182ce" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="hint">Select exactly two crops to compare.</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
