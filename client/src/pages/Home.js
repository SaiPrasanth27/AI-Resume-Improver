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
            Improve Your Resume with AI
          </h1>
          <p className="hero-subtitle">
            Get personalized feedback, optimize for ATS systems, and land your dream job
            with our AI-powered resume analysis and improvement tool.
          </p>
          <div className="hero-actions">
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn btn-primary btn-large">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary btn-large">
                  Get Started Free
                </Link>
                <Link to="/login" className="btn btn-secondary btn-large">
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2 className="section-title">Why Choose AI Resume Improver?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🤖</div>
              <h3>AI-Powered Analysis</h3>
              <p>
                Advanced AI algorithms analyze your resume and provide detailed
                feedback on content, structure, and optimization opportunities.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>ATS Optimization</h3>
              <p>
                Ensure your resume passes Applicant Tracking Systems with
                keyword optimization and formatting recommendations.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Detailed Scoring</h3>
              <p>
                Get comprehensive scores and metrics to understand exactly
                how to improve your resume's effectiveness.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">✨</div>
              <h3>Content Enhancement</h3>
              <p>
                Receive suggestions for stronger action verbs, better formatting,
                and more impactful descriptions of your achievements.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔄</div>
              <h3>Multiple Versions</h3>
              <p>
                Create and manage multiple resume versions tailored for
                different job applications and industries.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🚀</div>
              <h3>Career Growth</h3>
              <p>
                Track your progress and see how your resume improves over time
                with our analytics and version history.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Transform Your Resume?</h2>
            <p>
              Join thousands of professionals who have improved their resumes
              and landed better jobs with our AI-powered platform.
            </p>
            {!isAuthenticated && (
              <Link to="/register" className="btn btn-primary btn-large">
                Start Your Free Analysis
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;