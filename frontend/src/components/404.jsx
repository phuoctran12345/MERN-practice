import { Link } from "react-router-dom"

const NotFound = () => {
  return (
    <div className="flex-center" style={{ minHeight: "calc(100vh - 120px)", flexDirection: "column", padding: "2rem" }}>
      <h1 style={{ fontSize: "4rem", fontWeight: "bold", marginBottom: "1rem" }}>404</h1>
      <p style={{ fontSize: "1.5rem", marginBottom: "2rem" }}>Page Not Found</p>
      <Link to="/" className="button button-primary">
        Go to Home
      </Link>
    </div>
  )
}

export default NotFound
