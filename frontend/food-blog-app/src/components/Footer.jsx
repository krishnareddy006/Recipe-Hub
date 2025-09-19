import React, { useState } from 'react';
import { FaInstagram, FaLinkedin, FaGithub, FaEnvelope } from 'react-icons/fa';

function Footer() {
  const [feedback, setFeedback] = useState('');

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    if (feedback.trim()) {
      // Handle feedback submission here
      console.log('Feedback submitted:', feedback);
      alert('Thank you for your feedback!');
      setFeedback('');
    }
  };

  return (
    <div className='footer'>
      <div className='footer-content'>
        {/* ✅ Main Footer Section - Left and Right */}
        <div className='footer-main'>
          {/* ✅ Left Side - Feedback */}
          <div className='footer-left'>
            <div className='feedback-section'>
              <h3>We'd Love Your Feedback!</h3>
              <form onSubmit={handleFeedbackSubmit} className='feedback-form'>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Share your thoughts about our recipes..."
                  className='feedback-input'
                  rows="3"
                />
                <button type="submit" className='feedback-submit-btn'>
                  Submit Feedback
                </button>
              </form>
            </div>
          </div>
          
          {/* ✅ Right Side - Social Follow */}
          <div className='footer-right'>
            <div className='follow-section'>
              <h3>Contact Me</h3>
              <div className='social-icons'>
                <a 
                  href="mailto:saikamkrishnareddy09@gmail.com"
                  className='social-icon-link'
                >
                  <FaEnvelope className='social-icon' />
                </a>
                <a 
                  href="https://github.com/krishnareddy006" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className='social-icon-link'
                >
                  <FaGithub className='social-icon' />
                </a>
                <a 
                  href="https://www.linkedin.com/in/saikamkrishnareddy/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className='social-icon-link'
                >
                  <FaLinkedin className='social-icon' />
                </a>
                <a 
                  href="https://instagram.com/krishna_reddy_006" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className='social-icon-link'
                >
                  <FaInstagram className='social-icon' />
                </a>
                
              </div>
            </div>
          </div>
        </div>
        
        {/* ✅ Bottom - Full Width Copyright */}
        <div className='footer-bottom'>
          <p className='footer-text'>
            © 2025 Recipe Hub. All rights reserved. | Crafted with passion for food lovers worldwide
          </p>
        </div>
      </div>
    </div>
  );
}

export default Footer;
