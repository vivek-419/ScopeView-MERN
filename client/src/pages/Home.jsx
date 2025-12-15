import { Link } from 'react-router-dom'
import { FaBolt, FaShieldAlt, FaHistory, FaUsers } from 'react-icons/fa'
import './Home.css'

function Home() {
    return (
        <div className="home-container">
            {/* Background Animations */}
            <div className="home-bg-glow">
                <div className="glow-orb orb-1"></div>
                <div className="glow-orb orb-2"></div>
                <div className="glow-orb orb-3"></div>
            </div>

            {/* Navigation */}
            <nav className="home-nav">
                <div className="nav-logo">
                    <span className="logo-icon">⚡</span>
                    ScopeView
                </div>
                <div className="nav-links">
                    <a href="#features">Features</a>
                    <a href="#solutions">Solutions</a>
                    <a href="#pricing">Pricing</a>
                    <a href="#resources">Resources</a>
                </div>
                <div className="nav-cta">
                    <Link to="/login" className="btn-secondary">Log in</Link>
                    <Link to="/register" className="btn-primary">Start for free</Link>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="hero-section">
                <div className="hero-content">
                    <h1>
                        <span className="gradient-text">The data factory for</span> <br />
                        <span className="highlight">Modern Engineering</span>
                    </h1>
                    <p>
                        ScopeView provides real-time telemetry, historical playback, and collaborative tools
                        for engineering teams building the next generation of hardware and software.
                    </p>
                    <div className="hero-buttons">
                        <Link to="/register" className="btn-primary btn-large">Start for free</Link>
                        <Link to="/login" className="btn-secondary btn-large">Take a tour &rarr;</Link>
                    </div>
                </div>
            </header>

            {/* Features Grid */}
            <section id="features" className="features-section">
                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon"><FaBolt /></div>
                        <h3>Real-time Latency</h3>
                        <p>
                            Monitor your systems with sub-millisecond latency. Our WebSocket engine ensures you never miss a critical event.
                        </p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon"><FaHistory /></div>
                        <h3>Historical Playback</h3>
                        <p>
                            Rewind time to analyze anomalies. Our efficient storage engine allows for seamless replay of past sessions.
                        </p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon"><FaShieldAlt /></div>
                        <h3>Enterprise Security</h3>
                        <p>
                            Role-based access control, encrypted data transmission, and secure team management built-in.
                        </p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon"><FaUsers /></div>
                        <h3>Team Collaboration</h3>
                        <p>
                            Share dashboards, annotate streams, and work together in real-time to solve complex engineering problems.
                        </p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="footer-content">
                    <div className="footer-brand">
                        <h2>ScopeView</h2>
                        <p>Empowering engineering teams with high-frequency data visualization tools.</p>
                    </div>
                    <div className="footer-column">
                        <h4>Platform</h4>
                        <ul>
                            <li><a href="#">Real-time Dashboards</a></li>
                            <li><a href="#">Data Connectors</a></li>
                            <li><a href="#">API Reference</a></li>
                            <li><a href="#">Integrations</a></li>
                        </ul>
                    </div>
                    <div className="footer-column">
                        <h4>Solutions</h4>
                        <ul>
                            <li><a href="#">Automotive</a></li>
                            <li><a href="#">Robotics</a></li>
                            <li><a href="#">IoT Devices</a></li>
                            <li><a href="#">Server Monitoring</a></li>
                        </ul>
                    </div>
                    <div className="footer-column">
                        <h4>Company</h4>
                        <ul>
                            <li><a href="#">About Us</a></li>
                            <li><a href="#">Careers</a></li>
                            <li><a href="#">Blog</a></li>
                            <li><a href="#">Contact</a></li>
                        </ul>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; 2025 ScopeView, Inc. We enable breakthroughs.</p>
                    <div className="footer-legal">
                        <a href="#">Terms of Service</a> &bull; <a href="#">Privacy Policy</a>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default Home
