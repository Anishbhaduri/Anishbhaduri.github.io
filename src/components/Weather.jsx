import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Weather.css";

import sunnyVideo from "../assets/video/sunny.mp4";
import rainVideo from "../assets/video/rain.mp4";
import cloudsVideo from "../assets/video/cloud.mp4";

/* 🌾 Crop Images */
import riceImg from "../assets/images/Crops/rice.jpg";
import maizeImg from "../assets/images/Crops/maize.jpg";
import cottonImg from "../assets/images/Crops/cotton.jpg";
import chickpeaImg from "../assets/images/Crops/chickpea.jpg";
import lentilImg from "../assets/images/Crops/lentil.jpg";
import watermelonImg from "../assets/images/Crops/watermelon.jpg";
import coconutImg from "../assets/images/Crops/coconut.jpg";

const cropImages = {
  Rice: riceImg,
  Maize: maizeImg,
  Cotton: cottonImg,
  Chickpea: chickpeaImg,
  Lentil: lentilImg,
  Watermelon: watermelonImg,
  Coconut: coconutImg,
};

/* 🗺️ State Capitals (for state search) */
const STATE_CAPITALS = {
  kerala: { lat: 8.5241, lon: 76.9366 },
  maharashtra: { lat: 19.076, lon: 72.8777 },
  "west bengal": { lat: 22.5726, lon: 88.3639 },
  "tamil nadu": { lat: 13.0827, lon: 80.2707 },
  karnataka: { lat: 12.9716, lon: 77.5946 },
  rajasthan: { lat: 26.9124, lon: 75.7873 },
  punjab: { lat: 30.7333, lon: 76.7794 },
  odisha: { lat: 20.2961, lon: 85.8245 },
};

/* 🌱 AUTO SOIL DETECTION BASED ON MAP */
const detectSoilFromLocation = (lat, lon) => {
  if (lat >= 8 && lat <= 13 && lon >= 74 && lon <= 78) return "Laterite"; // Kerala
  if (lat >= 18 && lat <= 23 && lon >= 72 && lon <= 79) return "Black"; // Maharashtra
  if (lat >= 28 && lat <= 31 && lon >= 73 && lon <= 78) return "Alluvial"; // Punjab/Haryana
  if (lat >= 22 && lat <= 26 && lon >= 82 && lon <= 87) return "Red"; // Odisha
  if (lat >= 24 && lon <= 75) return "Sandy"; // Rajasthan
  return "Alluvial"; // default India
};

const Weather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [input, setInput] = useState("");
  const [soilType, setSoilType] = useState("Alluvial");
  const [autoSoil, setAutoSoil] = useState("");
  const [videoBg, setVideoBg] = useState(sunnyVideo);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();

  /* 🎥 Background */
  const updateBackground = (clouds, rain) => {
    if (rain > 0) setVideoBg(rainVideo);
    else if (clouds > 60) setVideoBg(cloudsVideo);
    else setVideoBg(sunnyVideo);
  };

  /* 🌦 Weather fetch (REST API only) */
  const fetchWeather = async (lat, lon) => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&timezone=auto&temperature_unit=celsius&current=temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,cloud_cover`
      );

      const json = await res.json();
      const c = json.current;

      const soil = detectSoilFromLocation(lat, lon);
      setAutoSoil(soil);
      setSoilType(soil);

      const data = {
        temperature: c.temperature_2m,
        feels_like: c.apparent_temperature,
        humidity: c.relative_humidity_2m,
        rainfall: c.precipitation,
        cloud_cover: c.cloud_cover,
      };

      setWeatherData(data);
      updateBackground(data.cloud_cover, data.rainfall);
      setErrorMsg("");
      setLoading(false);
    } catch {
      setErrorMsg("Weather service unavailable.");
      setLoading(false);
    }
  };

  /* 📍 Auto detect location */
  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude),
      () => setErrorMsg("Location access denied")
    );
  }, []);

  /* 🔍 City / State Search */
  const searchLocation = async () => {
    if (!input) return;
    setLoading(true);

    const key = input.trim().toLowerCase();

    if (STATE_CAPITALS[key]) {
      const { lat, lon } = STATE_CAPITALS[key];
      fetchWeather(lat, lon);
      return;
    }

    try {
      const res = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
          input
        )}&count=1`
      );
      const data = await res.json();

      if (data.results?.length) {
        fetchWeather(data.results[0].latitude, data.results[0].longitude);
      } else {
        setErrorMsg("Location not found.");
        setLoading(false);
      }
    } catch {
      setErrorMsg("Search failed.");
      setLoading(false);
    }
  };

  /* 🗓 Season */
  const getSeason = () => {
    const m = new Date().getMonth() + 1;
    if (m >= 6 && m <= 10) return "Kharif";
    if (m >= 11 || m <= 3) return "Rabi";
    return "Zaid";
  };

  /* 🌾 Crop Logic (SOIL PRIORITY) */
  const getCrops = () => {
    if (soilType === "Black") return ["Cotton", "Chickpea"];
    if (soilType === "Laterite") return ["Coconut"];
    if (soilType === "Sandy") return ["Watermelon"];
    if (soilType === "Red") return ["Maize", "Lentil"];

    const season = getSeason();
    if (season === "Kharif") return ["Rice", "Maize"];
    if (season === "Rabi") return ["Chickpea", "Lentil"];
    return ["Maize"];
  };

  /* 🤖 Advisory */
  const getAdvisory = () => {
    if (soilType === "Laterite")
      return "🌱 Laterite soil detected. Coconut and plantation crops are suitable.";
    if (soilType === "Black")
      return "🖤 Black soil retains moisture well. Cotton is ideal.";
    if (soilType === "Sandy")
      return "⚠️ Sandy soil drains fast. Frequent irrigation needed.";
    return "✅ Conditions are suitable for farming.";
  };

  return (
    <div className="weather-container">
      <video autoPlay loop muted className="background-video">
        <source src={videoBg} type="video/mp4" />
      </video>

      <div className="weather-content">
        <h1 className="title">🌦 Smart Weather & Crop Advisory</h1>

        <form
          className="search-bar"
          onSubmit={(e) => {
            e.preventDefault();
            if (!loading) searchLocation();
          }}
        >
          <input
            placeholder="Enter city or state (India)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit">{loading ? "..." : "Search"}</button>
        </form>

        <select
          className="soil-select"
          value={soilType}
          onChange={(e) => setSoilType(e.target.value)}
        >
          <option>Alluvial</option>
          <option>Black</option>
          <option>Red</option>
          <option>Sandy</option>
          <option>Laterite</option>
        </select>

        {autoSoil && (
          <p className="info">
            🌍 Auto-detected soil: <strong>{autoSoil}</strong>
          </p>
        )}

        {errorMsg && <p className="error">{errorMsg}</p>}

        {weatherData && (
          <div className="main-section">
            <div className="weather-card left-card">
              <div className="temp">{weatherData.temperature}°C</div>
              <p>Feels Like: {weatherData.feels_like}°C</p>
              <p>Humidity: {weatherData.humidity}%</p>
              <p>Rainfall: {weatherData.rainfall} mm</p>
              <p>Season: {getSeason()}</p>
            </div>

            <div className="agri-card">
              <h2>🌾 Recommended Crops</h2>
              <div className="crop-grid">
                {getCrops().map((c) => (
                  <div className="crop-item" key={c}>
                    <img src={cropImages[c]} alt={c} />
                    <p>{c}</p>
                  </div>
                ))}
              </div>

              <div className="agri-tips">
                <strong>🤖 Advisory:</strong>
                <p>{getAdvisory()}</p>
              </div>
            </div>
          </div>
        )}

        <button className="back-home" onClick={() => navigate("/")}>
          🏠
        </button>
      </div>
    </div>
  );
};

export default Weather;
