import Administrators from "../assets/Administrators.jpeg";
import Deolinda from "../assets/Deolinda.jpeg";
import Doctor_01 from "../assets/Doctor-1.jpeg";
import Doctor_02 from "../assets/Doctor-2.jpeg";
import Insurer from "../assets/Insurer.jpeg";
import Patients from "../assets/Patients.jpeg";
import Provider from "../assets/Provider.jpeg";
import Video from "../assets/video.jpeg";
import { Link } from "react-router-dom"

export default function LandingPage() {
  return (
    <div>
      <header class="header">
        <div class="logo font-medium">
          Health<span>Connect</span>
        </div>
        <nav className="flex items-start">
          <Link to="/register" class="btn login">
          <button style={{ marginTop: "0px" }} class="btn signup mt-0">Sign Up</button></Link>
          <Link to="/login" class="btn login">
          <button class="btn login mt-0">Log In</button></Link>
        </nav>
      </header>

      <main class="homepage flex flex-col gap-4 w-[100vw]">
        <div class="intro-section ml-[10vw]">
          <img
            src={Doctor_01}
            alt="Doctor"
            class="intro-image"
          />
          <div class="intro-text">
            <h1>Tired of spending 2 hours for a 8 minutes consultation?</h1>
            <p>
              <strong>Welcome to the solution.</strong>
              <br />
              Our mission at <span class="highlight">HealthConnect</span> is to
              revolutionize healthcare accessibility by leveraging cutting-edge
              technology to provide seamless, secure, and efficient telemedicine
              services.
            </p>
          </div>
        </div>
        <div class="signup-section">
          <div class="signup-text">
            <p>
              Join HealthConnect today and experience the future of healthcare,
              where quality consultations are just a click away!
            </p>
            <button class="btn signup">Sign Up</button>
          </div>
          <img
            src={Doctor_02}
            alt="Consultation"
            class="signup-image"
          />
        </div>

        <div class="mission-section">
          <img
            src={Video}
            alt="Mission"
            class="mission-image"
          />
          <div class="mission-text">
            <h2>HealthConnect Mission</h2>
            <p>
              Our mission at HealthConnect is to revolutionize healthcare
              delivery by providing an accessible, efficient, and high-quality
              telemedicine platform. We strive to transform the healthcare
              landscape, making care delivery more accessible, efficient, and
              patient-centric.
            </p>
          </div>
        </div>

        <div class="offerings-section">
          <h2>Explore what we offer:</h2>
          <div class="offerings">
            <div class="offering">
              <img src={Provider} alt="Providers" />
              <h3>For Providers</h3>
              <p>
                Our comprehensive platform allows healthcare providers to
                deliver quality care efficiently.
              </p>
              <button class="btn offering-btn">Providers</button>
            </div>
            <div class="offering">
              <img src={Patients} alt="Patients" />
              <h3>For Patients</h3>
              <p>
                Our platform ensures convenient access to healthcare services
                from the comfort of your home.
              </p>
              <button class="btn offering-btn">Patients</button>
            </div>
            <div class="offering">
              <img src={Insurer} alt="Insurers" />
              <h3>For Insurers</h3>
              <p>
                Seamless integration with health insurance providers for
                efficient billing and claims processing.
              </p>
              <button class="btn offering-btn">Insurers</button>
            </div>
            <div class="offering">
              <img
                src={Administrators}
                alt="Health Administrators"
              />
              <h3>For Health Administrators</h3>
              <p>
                Manage consultations, prescriptions, and patient records with
                ease.
              </p>
              <button class="btn offering-btn">Health Administrators</button>
            </div>
          </div>
        </div>

        <div class="stats-section">
          <div class="stat">
            <h3>150+</h3>
            <p>Users</p>
          </div>
          <div class="stat">
            <h3>200+</h3>
            <p>Consultations</p>
          </div>
          <div class="stat">
            <h3>50+</h3>
            <p>Positive Reviews</p>
          </div>
          <div class="stat">
            <h3>20+</h3>
            <p>Healthcare Professionals</p>
          </div>
        </div>
        <div class="team-section">
          <h2>Our team</h2>
          <div class="team">
            <div class="team-member">
              <img src={Deolinda} alt="Deolinda Bogore" />
              <p>Deolinda Bogore</p>
            </div>
          </div>
        </div>
      </main>

      <footer class="footer">
        <p>Join our newsletter to stay up to date on features and releases.</p>
        <input type="email" placeholder="Email address" />
        <button class="btn subscribe-btn">Subscribe</button>
        <div class="footer-nav">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Cookie Settings</a>
        </div>
        <p>&copy; HealthConnect.</p>
      </footer>
    </div>
  );
}
