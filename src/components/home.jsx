import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // ✅ ADDED useNavigate
import { useScroll, useTransform, motion } from "framer-motion";
import farming3 from "../assets/images/farming3.jpg";
import home from "../assets/video/home.mp4";
import Friendly from "../assets/images/Friendly.jpeg";
import anishImg from "../assets/images/anish.jpg";
import priantuImg from "../assets/images/priantu.jpg";
import nitalImg from "../assets/images/nital.jpg";
import biswajitImg from "../assets/images/biswajit.jpg";
import aritraImg from "../assets/images/aritra.jpg";
import Innovative from "../assets/images/Innovative.webp";
import plant_disease from "../assets/images/plant_disease.webp";
import "../css/home.css";

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const { scrollY } = useScroll();

  const navigate = useNavigate(); // ✅ ADDED

  // ✅ ADDED logout handler
  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("userEmail"); // optional
    navigate("/login");
  };

  useEffect(() => {
    const handleScroll = () => {
      const header = document.querySelector(".header");
      if (window.scrollY > 50) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }

      if (window.scrollY > 200) {
        setShowScrollBtn(true);
      } else {
        setShowScrollBtn(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 880 && menuOpen) setMenuOpen(false);
    };
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
  }, [menuOpen]);

  const handleMenuClick = () => setMenuOpen((prev) => !prev);

  const fadeUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  const yParallax = useTransform(scrollY, [0, 800], [0, -40]);

  const features = [
    {
      title: "Plant Disease Identification",
      desc: `Keeping crops healthy is the key to a successful harvest. Our AI-powered Plant Disease Identification system helps farmers detect crop problems early — just by uploading a photo of the affected plant.`,
      img: plant_disease,
    },
    {
      title: "Smart Farming, Simple Guidance",
      desc: "Discover how technology can make farming easier.",
      img: farming3,
    },
    {
      title: "Innovations for Modern Farms",
      desc: "Farming today is more than hard work — it’s about working smart.",
      img: Innovative,
    },
    {
      title: "User-Friendly Interface",
      desc: "Our platform is designed with farmers in mind.",
      img: Friendly,
    },
  ];

  return (
    <div>
    <button
    className={`scroll-to-home-btn ${showScrollBtn ? "show" : ""}`}
    onClick={() =>
      document.getElementById("home").scrollIntoView({ behavior: "smooth" })
    }
    >
    ▲
    </button>

    {/* Header */}
    <header className="header">
    <div className="logo">
    <h1>🌿 Plant Pulse</h1>
    </div>

    <nav className={`navbar${menuOpen ? " active" : ""}`}>
    <a href="#home" className="nav-link">Home</a>
    <a href="#features" className="nav-link">Features</a>
    <a href="#about" className="nav-link">About</a>
    <a href="#footer" className="nav-link">Contact</a>
    <Link to="/upload" className="btn nav-link">Model</Link>
    </nav>

    {/* ✅ ADDED Logout Button */}
    <button
    onClick={handleLogout}
    style={{
      marginLeft: "1rem",
      padding: "0.4rem 0.9rem",
      background: "#e74c3c",
      color: "#fff",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontWeight: "600",
    }}
    >
    Logout
    </button>

    <button
    id="menu-btn"
    className={`menu-icon ${menuOpen ? "open" : ""}`}
    onClick={handleMenuClick}
    >
    <span className="bar bar1" />
    <span className="bar bar2" />
    <span className="bar bar3" />
    </button>
    </header>

    {/* Hero Section */}
    <section className="home" id="home">
    <video className="video" src={home} autoPlay loop muted />
    <motion.div className="content" initial="hidden" animate="visible" variants={fadeUp}>
    <motion.h1>YOUR SMART FARMING ASSISTANT</motion.h1>
    <motion.p>Smart Crops, Smart Choices with Plant Pulse!</motion.p>
    <Link to="/guidepage" className="home-btn">
    Smart Farming Guide
    </Link>
    </motion.div>
    </section>
    </div>
  );
}

export default Home;
