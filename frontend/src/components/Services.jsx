import { LayoutDashboard, Code, Palette } from "lucide-react"

const ServiceCard = ({ icon: Icon, title, description }) => (
  <div className="card">
    <div className="card-header">
      <Icon size={32} style={{ marginBottom: "0.5rem", color: "#007bff" }} />
      <h3 className="card-title">{title}</h3>
    </div>
    <div className="card-content">
      <p>{description}</p>
    </div>
  </div>
)

const Services = () => {
  return (
    <div className="container py-8">
      <h1 className="mb-6 text-4xl font-bold text-center">Our Services</h1>
      <p className="mb-8 text-lg text-muted-foreground text-center">
        We offer a range of services to help businesses establish and enhance their online presence.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ServiceCard
          icon={LayoutDashboard}
          title="Web Design"
          description="Crafting visually appealing and user-friendly websites that reflect your brand identity. We focus on responsive design to ensure a seamless experience across all devices."
        />
        <ServiceCard
          icon={Code}
          title="Web Development"
          description="Building robust and scalable web applications using the latest technologies. From front-end interfaces to back-end systems, we deliver high-performance solutions."
        />
        <ServiceCard
          icon={Palette}
          title="E-commerce Solutions"
          description="Developing comprehensive e-commerce platforms with secure payment gateways, product management, shopping cart functionality, and order tracking."
        />
      </div>
    </div>
  )
}

export default Services
