import { Link } from 'react-router-dom'
import Footer from '../components/common/Footer'
import Navbar from '../components/common/Navbar'

const LandingPage = () => {
  return (
    <div className="landing-page">
      <Navbar />
      
      {/* Hero Section */}
      <section id="home" className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              Welcome to <span className="highlight">Campus Cloud Web</span>
            </h1>
            <h2 className="hero-subtitle">
              College Project Management Portal
            </h2>
            <p className="hero-description">
              Streamline your academic projects with our comprehensive platform. 
              Submit, review, and showcase your work seamlessly. Join thousands of 
              students and faculty members in revolutionizing project management.
            </p>
            <div className="hero-actions">
              <Link to="/register" className="btn btn-primary btn-large">
                 Get Started
              </Link>
              <Link to="/projects" className="btn btn-secondary btn-large">
                 Browse Projects
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about-section">
        <div className="container">
          <h2 className="section-title">About Campus Cloud Web</h2>
          <div className="about-content">
            <div className="about-text">
              <h3>Empowering Academic Excellence</h3>
              <p>
                Campus Cloud Web is a comprehensive platform designed to streamline the entire 
                project lifecycle in educational institutions. From initial proposal to 
                final submission and review, we provide the tools for seamless collaboration 
                between students and faculty.
              </p>
              <p>
              Our platform bridges the gap between innovative student ideas and expert faculty guidance, creating an ecosystem that fosters creativity, learning, and academic excellence. Faculty members can effortlessly manage submissions, grade drafts, and generate comprehensive reports across multiple project batches. Finally, the system culminates in a digital portfolio, allowing students to showcase their successful projects to future employers and peers.
              </p>
              
              
            </div>
            
            <div className="about-visions">
              <div className="vision-card">
                <h4> Our Mission</h4>
                <p>To simplify project management and enhance collaboration in academic institutions.</p>
              </div>
              <div className="vision-card">
                <h4> Our Vision</h4>
                <p>Creating a centralized hub for academic project excellence and innovation.</p>
              </div>
             
            </div>
          </div>
        </div>
      </section>

      {/* Departments Section */}
      <section className="departments-section">
        <div className="container">
          <h2 className="section-title">Supported Departments</h2>
          <div className="departments-grid">
            <div className="department-card">
              <div className="department-icon">💻</div>
              <div className="department-name">Computer Science</div>
              <div className="department-projects">Fostering innovation in algorithms, software development, and artificial intelligence to build the digital infrastructure of tomorrow.</div>
            </div>
            <div className="department-card">
              <div className="department-icon">📡</div>
              <div className="department-name">Electronics& Communications</div>
              <div className="department-projects">Designing and optimizing integrated circuits, communication systems, and embedded hardware for next-generation devices and IoT applications.</div>
            </div>
            <div className="department-card">
              <div className="department-icon">⚡</div>
              <div className="department-name">Electrical&Electronics</div>
              <div className="department-projects">Focusing on the generation, transmission, and control of electrical power, renewable energy systems, and high-efficiency electrical machines.</div>
            </div>
            <div className="department-card">
              <div className="department-icon">🔧</div>
              <div className="department-name">Mechanical</div>
              <div className="department-projects">Applying principles of motion, energy, and force to design, analyze, and manufacture everything from industrial machinery to robotic systems.</div>
            </div>
            <div className="department-card">
              <div className="department-icon">🏗️</div>
              <div className="department-name">Civil</div>
              <div className="department-projects">Planning, designing, and constructing essential infrastructure, including buildings, bridges, and transportation networks, to improve quality of life.</div>
            </div>
            <div className="department-card">
              <div className="department-icon">🎨</div>
              <div className="department-name">Arts & Design</div>
              <div className="department-projects"> Integrating creative principles with technical skills to develop user interfaces, industrial prototypes, and compelling visual media.</div>
            </div>
          </div>
        </div>
      </section>

     

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <h2 className="section-title">What Our Users Say</h2>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <p className="testimonial-text">
                "Campus Cloud Web transformed how we manage student projects. The platform is intuitive 
                and has significantly reduced our administrative workload."
              </p>
              <div className="testimonial-author">
                <div className="author-avatar"></div>
                <div>
                  <div className="author-name">Dr. Sarah Johnson</div>
                  <div className="author-role">Professor, Computer Science</div>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <p className="testimonial-text">
                "As a student, I love how easy it is to submit projects and get feedback. 
                The final upload feature makes document management a breeze!"
              </p>
              <div className="testimonial-author">
                <div className="author-avatar"></div>
                <div>
                  <div className="author-name">Emily Chen</div>
                  <div className="author-role">Final Year Student</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact-section">
        <div className="container">
          <h2 className="section-title">Get In Touch</h2>
          <div className="contact-content">
            <div className="contact-info">
              <h3>Contact Information</h3>
              <div className="contact-details">
                <div className="contact-item">
                  <span className="contact-icon">📧</span>
                  <span>support@CampusCloudWeb.com</span>
                </div>
                <div className="contact-item">
                  <span className="contact-icon">📞</span>
                  <span>+1 (555) 123-CCW</span>
                </div>
                <div className="contact-item">
                  <span className="contact-icon">📍</span>
                  <span>University Campus, Academic City</span>
                </div>
                <div className="contact-item">
                  <span className="contact-icon">🕒</span>
                  <span>Mon - Fri: 9:00 AM - 6:00 PM</span>
                </div>
              </div>
            </div>
            <div className="contact-form">
              <h3>Send us a Message</h3>
              <form className="contact-form-fields">
                <input type="text" placeholder="Your Name" className="form-input" />
                <input type="email" placeholder="Your Email" className="form-input" />
                <input type="text" placeholder="Subject" className="form-input" />
                <textarea placeholder="Your Message" rows="4" className="form-textarea"></textarea>
                <button type="submit" className="btn btn-primary">Send Message</button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2 className="cta-title">Ready to Get Started?</h2>
          <p className="cta-description">
            Join hundreds of students and faculty members already using Campus Cloud Web 
            to streamline their academic project workflow.
          </p>
          <div className="cta-actions">
            <Link to="/register" className="btn btn-primary btn-large">
              Create Account
            </Link>
            <Link to="/login" className="btn btn-secondary btn-large">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default LandingPage