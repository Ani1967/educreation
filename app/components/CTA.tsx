import BookingForm from "./BookingForm";

export default function CTA() {
  return (
    <section className="cta-section" id="contact">
      <div className="cta-glow" />
      <div className="container">
        <div className="cta-inner reveal">
          <p className="section-label" style={{ textAlign: "center", marginBottom: "0.75rem" }}>Start today</p>
          <h2>Get your free PDF guide.<br /><em>No commitment.</em></h2>
          <p>Download our free 7-page guide on building understanding that stays for life. See the system before you pay anything.</p>
          <BookingForm />
          <p className="cta-note" style={{ marginTop: "1.25rem" }}>
            We will WhatsApp you within 2 hours · Kolkata-based families only in Phase 1
          </p>
        </div>
      </div>
    </section>
  );
}
