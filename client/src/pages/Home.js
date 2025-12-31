import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Home.css';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Transform Your Resume with AI
          </h1>
          <p className="hero-subtitle">
            Upload your resume, add job details, and get an AI-improved version 
            that stands out to recruiters and passes ATS systems.
          </p>
          <div className="hero-actions">
            <Link to="/cv-improver" className="btn btn-primary btn-large">
              Start Improving Your Resume
            </Link>
            {!isAuthenticated && (
              <Link to="/register" className="btn btn-secondary btn-large">
                Sign Up Free
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2 className="section-title">Simple 3-Step Process</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">1</div>
              <h3>1. Upload Your Resume</h3>
              <p>
                Upload your PDF resume or paste your text. Our AI will 
                analyze your content and structure.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">2</div>
              <h3>2. Add Job Details</h3>
              <p>
                Provide the job description and company details to get 
                targeted improvements for your specific application.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">3</div>
              <h3>3. Download Improved Resume</h3>
              <p>
                Get your AI-enhanced resume with better formatting, 
                optimized content, and professional structure.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="benefits">
        <div className="container">
          <h2 className="section-title">Why Choose Our AI Resume Improver?</h2>
          <div className="benefits-grid">
            <div className="benefit-item">
              <div className="benefit-icon">AI</div>
              <h4>AI-Powered Enhancement</h4>
              <p>Advanced AI analyzes and improves your resume content</p>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">ATS</div>
              <h4>ATS Optimization</h4>
              <p>Ensures your resume passes Applicant Tracking Systems</p>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">FAST</div>
              <h4>Fast & Easy</h4>
              <p>Get results in minutes with our simple 3-step process</p>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">PRO</div>
              <h4>Professional Format</h4>
              <p>Clean, modern formatting that recruiters love</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Improve Your Resume?</h2>
            <p>
              Join thousands of job seekers who have enhanced their resumes 
              and landed better opportunities with our AI-powered tool.
            </p>
            <Link to="/cv-improver" className="btn btn-primary btn-large">
              Get Started Now - It's Free!
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;