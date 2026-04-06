import { WA_URL, CONTACT_EMAIL } from "@/lib/constants";

export default function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="footer-inner">
          <div>
            <p className="footer-brand">EduCreation</p>
            <p className="footer-desc">A learning system built for every student in India. Not just knowledge — understanding that stays for life. Conceptual. Stress-free. Personalised.</p>
            <p style={{ marginTop: "1rem", fontSize: "0.82rem", color: "rgba(201,169,110,0.5)" }}>
              <a href="/contact" style={{ color: "inherit" }}>{CONTACT_EMAIL}</a><br />
              Kolkata, West Bengal, India
            </p>
          </div>
          <div>
            <p className="footer-col-title">System</p>
            <ul className="footer-links">
              <li><a href="#system">How it works</a></li>
              <li><a href="#system">The 4 steps</a></li>
              <li><a href="#students">For students</a></li>
              <li><a href="#parents">For parents</a></li>
              <li><a href={WA_URL} target="_blank" rel="noreferrer">For schools</a></li>
            </ul>
          </div>
          <div>
            <p className="footer-col-title">Plans</p>
            <ul className="footer-links">
              <li><a href="#pricing">Spark — ₹499/mo</a></li>
              <li><a href="#pricing">Illuminate — ₹999/mo</a></li>
              <li><a href="#pricing">Mastery — ₹1,999/mo</a></li>
              <li><a href={WA_URL} target="_blank" rel="noreferrer">Schools &amp; institutions</a></li>
            </ul>
          </div>
          <div>
            <p className="footer-col-title">Contact</p>
            <ul className="footer-links">
              <li><a href="/contact">{CONTACT_EMAIL}</a></li>
              <li><a href={WA_URL} target="_blank" rel="noreferrer">WhatsApp us</a></li>
              <li><a href="/contact">Send a message</a></li>
              <li><a href="/contact">School pilot enquiry</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 EduCreation · educreators.org · All rights reserved</p>
          <p className="footer-tagline">&ldquo;Understand more. Stress less. Create always.&rdquo;</p>
        </div>
      </div>
    </footer>
  );
}
