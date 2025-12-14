import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from './components/home';
import FileUploader from './components/FileUploader';
import SanAgroPage from './components/SanAgroPage.jsx';
import Login from './components/login.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Weather from "./components/Weather";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/Weatherforcast" element={<Weather />} />
        {/* Login page (always accessible) */}
        <Route path="/login" element={<Login />} />

        {/* Protected routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <FileUploader />
            </ProtectedRoute>
          }
        />
        <Route
          path="/guidepage"
          element={
            <ProtectedRoute>
              <SanAgroPage />
            </ProtectedRoute>
          }
        />

        {/* Redirect any unknown routes to login */}
         {/* <Route path="*" element={<Navigate to="/login" />} /> */}

      </Routes>
    </Router>
  );
}

export default App;
