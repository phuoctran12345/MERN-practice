import { Link } from "react-router-dom"
import { Facebook, Instagram, Twitter } from "lucide-react"

const Footer = () => {
  return (
    <footer className="border-t" style={{ backgroundColor: "#f8f9fa", padding: "1.5rem", textAlign: "center" }}>
      <div
        className="container"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
        }}
      >
        <p style={{ fontSize: "0.875rem", color: "#6c757d" }}>
          &copy; {new Date().getFullYear()} E-commerce App. All rights reserved.
        </p>
        <nav style={{ display: "flex", gap: "1rem" }}>
          <Link to="/about" style={{ fontSize: "0.875rem", color: "#333", textDecoration: "none" }}>
            About Us
          </Link>
          <Link to="/services" style={{ fontSize: "0.875rem", color: "#333", textDecoration: "none" }}>
            Services
          </Link>
          <Link to="#" style={{ fontSize: "0.875rem", color: "#333", textDecoration: "none" }}>
            Contact
          </Link>
        </nav>
        <div style={{ display: "flex", gap: "1rem" }}>
          <Link to="#" aria-label="Facebook">
            <Facebook size={20} style={{ color: "#6c757d" }} />
          </Link>
          <Link to="#" aria-label="Twitter">
            <Twitter size={20} style={{ color: "#6c757d" }} />
          </Link>
          <Link to="#" aria-label="Instagram">
            <Instagram size={20} style={{ color: "#6c757d" }} />
          </Link>
        </div>
      </div>
    </footer>
  )
}

export default Footer
