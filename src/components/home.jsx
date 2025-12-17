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
          <a href="#home" className="nav-link">
            Home
          </a>
          <a href="#features" className="nav-link">
            Features
          </a>
          <a href="#about" className="nav-link">
            About
          </a>
          <a href="#contact" className="nav-link">
            Contact
          </a>
          <Link to="#upload" className="btn nav-link">
            Model
          </Link>
        </nav>

        {/* ✅ ADDED Logout Button */}
        <button
          onClick={handleLogout}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: "6px",
            display: "flex",
            alignItems: "center",
          }}
          title="Logout"
        >
          <img
            src="https://www.svgrepo.com/show/13695/logout.svg"
            alt="Logout"
            style={{
              width: "24px",
              height: "24px",
              filter: "grayscale(100%) brightness(0)",
            }}
          />
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
        <motion.div
          className="content"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          <motion.h1>YOUR SMART FARMING ASSISTANT</motion.h1>
          <motion.p>Smart Crops, Smart Choices with Plant Pulse!</motion.p>
          <Link to="/guidepage" className="home-btn">
            Smart Farming Guide
          </Link>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="features" id="features" aria-label="Features">
        <motion.div
          className="heading"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ duration: 1 }}
        >
          <h1 align="center" style={{ fontSize: "2rem", fontWeight: "bold" }}>
            Features
          </h1>
          <p>
            PlantPulse empowers farmers with AI-driven crop recommendations,
            disease detection, and climate insights to make smarter, sustainable
            farming decisions.
          </p>
        </motion.div>

        <div
          className="button-container0"
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <Link to="/Weatherforcast" className="buttonn active">
            Weather Forcasting
          </Link>
          <Link to="/upload" className="buttonn">
            Identify Diseases
          </Link>
          <Link to="/guidepage" className="buttonn">
            Smart Farming Guidance
          </Link>
        </div>

        <div
          className="row"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className={`feature-row ${index % 2 !== 0 ? "reverse" : ""}`}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              transition={{ duration: 0.8, delay: index * 0.1 }}
            >
              <div className="image">
                <motion.img
                  src={feature.img}
                  alt={feature.title}
                  className="rounded-corner-image parallax-img"
                  style={{ y: yParallax }}
                  whileHover={{ scale: 1.05 }}
                />
              </div>
              <div className="content">
                <h1>{feature.title}</h1>
                <p>{feature.desc}</p>
                <Link to="#" className="all-btn">
                  More Info
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section className="about" id="about" aria-label="About">
        <div className="responsive-container-block outer-container">
          <div className="responsive-container-block inner-container">
            <h1 className="text-blk section-head-text">Meet Our Team</h1>
            <p className="text-blk section-subhead-text">
              A passionate team of innovators blending agriculture and
              technology to help
            </p>
            <div className="responsive-container-block team-list">
              {[
                {
                  name: "Anish Bhaduri",
                  role: "Web Developer",
                  img: anishImg,
                  linkedin: "https://linkedin.com/in/anish-bhaduri",
                  email: "anish@gmail.com",
                },
                {
                  name: "Priantu Das",
                  role: "ML Engineer",
                  img: priantuImg,
                  linkedin: "https://linkedin.com/in/priantu-das",
                  email: "priantu@gmail.com",
                },
                {
                  name: "Nital Kumari",
                  role: "UX/UI Designer",
                  img: nitalImg,
                  linkedin: "https://linkedin.com/in/nital-kumari",
                  email: "nital@gmail.com",
                },
                {
                  name: "Biswajyoti Ray",
                  role: "ML Engineer",
                  img: biswajitImg,
                  linkedin: "https://linkedin.com/in/biswajyoti-ray",
                  email: "biswajyoti@gmail.com",
                },
                {
                  name: "Aritra Kar",
                  role: "",
                  img: aritraImg,
                  linkedin: "https://linkedin.com/in/aritra-kar",
                  email: "aritra@gmail.com",
                },
              ].map((member) => (
                <div
                  key={member.name}
                  className="responsive-cell-block team-card-container"
                >
                  <div className="team-card">
                    <div className="img-wrapper">
                      <img
                        className="team-img"
                        src={member.img}
                        alt={member.name}
                      />
                    </div>
                    <p className="text-blk name">{member.name}</p>
                    <p className="text-blk position">{member.role}</p>
                    <div className="social-media-links">
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          width: "20px",
                          height: "20px",
                          borderRadius: "50%",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: "transparent",
                          border: "1px solid #e0e0e0",
                        }}
                        title="LinkedIn"
                      >
                        <img
                          src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='none' stroke='%236e6e6e' stroke-width='0.9' stroke-linecap='round' stroke-linejoin='round'><line x1='4' y1='6' x2='4' y2='12'/><circle cx='4' cy='4' r='0.6'/><path d='M7 12V7.8a2 2 0 0 1 4 0V12'/></svg>"
                          alt="LinkedIn"
                          style={{ width: "12px", height: "12px" }}
                        />
                      </a>

                      <a href={`mailto:${member.email}`}>
                        <img
                          src="https://workik-widget-assets.s3.amazonaws.com/widget-assets/images/gray-mail.svg"
                          alt="Email"
                        />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer" id="footer" aria-label="Footer">
        <div className="box-container">
          <div className="box">
            <h3>Quick Links</h3>
            <a href="#home">Home</a>
            <a href="#features">Features</a>
            <a href="#about">About</a>
          </div>
          <div className="box">
            <h3>Extra Links</h3>
            <a href="#">Ask Questions</a>
            <a href="#">Terms of Use</a>
            <a href="#">Privacy Policy</a>
          </div>
          <div className="box">
            <h3>Helpful Resources</h3>
            <a href="#">FAQs</a>
            <a href="#">User Guides</a>
            <a href="#">Support Center</a>
          </div>
          <div className="box">
            <h3>Stay Connected</h3>
            <a href="#">Future Scope</a>
            <a href="#">Community Forum</a>
            <a href="#">Newsletter</a>
          </div>
        </div>

        <div className="credit">
          © 2025 <span>Plant Pulse</span> — All Rights Reserved
        </div>
      </footer>
    </div>
  );
}

export default Home;
