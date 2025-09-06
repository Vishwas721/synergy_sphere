import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Archive, HelpCircle, Users, Menu, X, CheckCircle, MessageSquare, BarChart2, Briefcase, PenTool, GitBranch, Rocket } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import './HomePage.css';

// --- Navbar Component ---
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navLinks = ["Solutions", "Features", "How It Works"];

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="navbar"
    >
      <div className="navbar-content">
        <NavLink to="/" className="navbar-logo">SynergySphere</NavLink>
        <div className="navbar-links">
          {navLinks.map(link => (
            <a key={link} href={`#${link.toLowerCase().replace(' ', '-')}`} className="navbar-link">{link}</a>
          ))}
        </div>
        <div className="navbar-actions">
          <NavLink to="/login" className="navbar-button secondary">Login</NavLink>
          <NavLink to="/signup" className="navbar-button primary">Sign Up</NavLink>
        </div>
        <div className="navbar-mobile-toggle">
          <button onClick={() => setIsOpen(!isOpen)}>{isOpen ? <X /> : <Menu />}</button>
        </div>
      </div>
      {isOpen && (
        <div className="navbar-mobile-menu">
          {navLinks.map(link => (
            <a key={link} href={`#${link.toLowerCase().replace(' ', '-')}`} onClick={() => setIsOpen(false)} className="navbar-link">{link}</a>
          ))}
          <div className="mobile-menu-actions">
            <NavLink to="/login" className="navbar-button secondary">Login</NavLink>
            <NavLink to="/signup" className="navbar-button primary">Sign Up</NavLink>
          </div>
        </div>
      )}
    </motion.nav>
  );
};

// --- Hero Section ---
const HeroSection = () => {
    const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.2 } } };
    const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { duration: 0.5 } } };
    return (
      <section className="hero-section">
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="hero-content">
          <motion.h1 variants={itemVariants} className="hero-headline">From Scattered Chaos to synchronized Flow</motion.h1>
          <motion.p variants={itemVariants} className="hero-tagline">Tired of scattered chats, unclear progress, and deadline surprises? SynergySphere is the central nervous system for your team, transforming chaos into a clear, actionable workflow.</motion.p>
          <motion.div variants={itemVariants} className="hero-buttons">
            <motion.a href="#" whileHover={{ scale: 1.05, boxShadow: "0px 0px 20px rgba(255,255,255,0.3)" }} className="navbar-button primary large">Get Started</motion.a>
            <motion.a href="#" whileHover={{ scale: 1.05 }} className="navbar-button secondary large">Explore Features</motion.a>
          </motion.div>
        </motion.div>
      </section>
    );
};

// --- Solutions Section ---
const SolutionsSection = () => {
    const problems = [
        { icon: <Archive size={32} />, title: "Scattered Info? No more.", desc: "Files, chats, decisions lost across apps. Find everything in one place, instantly accessible." },
        { icon: <HelpCircle size={32} />, title: "Unclear Progress? Never again.", desc: "Gain full visibility into every task and project. Know where your team stands, in real-time." },
        { icon: <Users size={32} />, title: "Assignment Chaos? Resolved.", desc: "Clearly define responsibilities and deadlines. Eliminate confusion and empower your team to execute." },
    ];
    return (
        <section id="solutions" className="page-section">
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.5 }} className="section-heading">Your Team's Challenges. Solved.</motion.h2>
            <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.5, delay: 0.1 }} className="section-subheading">SynergySphere is built to eliminate the friction that slows teams down.</motion.p>
            <div className="solutions-grid">
                {problems.map((problem, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.5, delay: i * 0.2 }} className="solution-card">
                        <div className="solution-card-icon">{problem.icon}</div>
                        <h3>{problem.title}</h3>
                        <p>{problem.desc}</p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

// --- Features Section ---
const FeaturesSection = () => {
    const [activeFeature, setActiveFeature] = useState(0);
    const features = [
        { title: "Smart Task Management", desc: "Visualize your workflow with customizable Kanban boards. Drag, drop, and track tasks from 'To-Do' to 'Done' with ease.", icon: <CheckCircle /> },
        { title: "Seamless Communication", desc: "Keep conversations in context. Discuss tasks and projects in dedicated threads, eliminating scattered information.", icon: <MessageSquare /> },
        { title: "Proactive Insights", desc: "Get a high-level overview of project health, team workload, and upcoming deadlines with our intelligent dashboard.", icon: <BarChart2 /> },
    ];
    return (
        <section id="features" className="page-section">
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.5 }} className="section-heading">Core Features Designed for Flow</motion.h2>
            <div className="features-grid">
                <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.5 }}>
                    <h3>Streamline. Collaborate. Excel.</h3>
                    <div className="features-accordion">
                        {features.map((feature, i) => (
                            <div key={i} className={`feature-item ${activeFeature === i ? 'active' : ''}`} onClick={() => setActiveFeature(i)}>
                                <div className="feature-item-header">
                                    <div className="feature-item-icon">{feature.icon}</div>
                                    <h4>{feature.title}</h4>
                                </div>
                                <div className="feature-item-body"><p>{feature.desc}</p></div>
                            </div>
                        ))}
                    </div>
                </motion.div>
                <motion.div key={activeFeature} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="feature-mockup">
                    <p>{features[activeFeature].title} Mockup</p>
                </motion.div>
            </div>
        </section>
    );
};

// --- How It Works Section ---
const HowItWorksSection = () => {
    const steps = [
        { icon: <Briefcase />, title: "Join Your Operations", desc: "Sign up and create your first project. Invite team members to centralize all your work." },
        { icon: <PenTool />, title: "Organize & Assign", desc: "Break down projects into actionable tasks. Assign owners and set deadlines to create a clear path." },
        { icon: <GitBranch />, title: "Communicate & Track", desc: "Use threaded discussions to keep conversations focused and update task statuses in real-time." },
        { icon: <Rocket />, title: "Achieve More", desc: "With clarity and focus, your team can deliver better results, faster. Celebrate success." },
    ];
    return (
        <section id="how-it-works" className="page-section">
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.5 }} className="section-heading">Get Started in Minutes</motion.h2>
            <div className="how-it-works-grid">
                {steps.map((step, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.5, delay: i * 0.15 }} className="how-it-works-step">
                        <div className="how-it-works-icon">{step.icon}</div>
                        <h3>{step.title}</h3>
                        <p>{step.desc}</p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

// --- Call to Action Section ---
const CTASection = () => (
    <section className="page-section">
        <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.5 }} className="cta-card">
            <h2>Ready to Build Better, Together?</h2>
            <div className="hero-buttons">
                <motion.a href="#" whileHover={{ scale: 1.05, boxShadow: "0px 0px 20px rgba(255,255,255,0.3)" }} className="navbar-button primary large">Launch Live Demo</motion.a>
                <motion.a href="#" whileHover={{ scale: 1.05 }} className="navbar-button secondary large">View on GitHub</motion.a>
            </div>
        </motion.div>
    </section>
);

// --- Footer Section ---
const Footer = () => (
    <footer className="footer">
        <div className="footer-content">
            <div className="footer-column">
                <h3>SynergySphere</h3>
                <p>&copy; {new Date().getFullYear()}. All rights reserved.</p>
            </div>
            <div className="footer-column">
                <h4>Solutions</h4>
                <a href="#solutions">For Startups</a>
                <a href="#solutions">For Agencies</a>
            </div>
            <div className="footer-column">
                <h4>Company</h4>
                <a href="#">About Us</a>
                <a href="#">The Team</a>
            </div>
            <div className="footer-column">
                <h4>Connect</h4>
                <div className="social-links">
                    <a href="#">X</a>
                    <a href="#">GitHub</a>
                    <a href="#">LinkedIn</a>
                </div>
            </div>
        </div>
    </footer>
);


// --- Main Homepage Export ---
export default function HomePage() {
  return (
    <div className="homepage-container">
      <Navbar />
      <main>
        <HeroSection />
        <SolutionsSection />
        <FeaturesSection />
        <HowItWorksSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}