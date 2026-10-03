export default function TermsPage() {
    return (
        <div className="min-h-screen bg-white text-black">
            <div className="max-w-4xl mx-auto px-6 py-12">
                <a href="/" className="text-sm text-gray-500 hover:text-black">← Back to Home</a>
                <h1 className="text-4xl font-bold mt-6">Terms and Conditions</h1>
                <p className="text-sm text-gray-500 mt-2">Last updated: May 13, 2026 | EduCreation - educreators.org</p>
                <div className="prose prose-neutral max-w-none mt-8 space-y-6 text- leading-relaxed">
                    <p>Welcome to EduCreation (educreators.org). By accessing or using our website, PDF concept guides, and mentor plans, you agree to these Terms.</p>
                    <h2 className="text-xl font-semibold mt-8">1. Services</h2>
                    <p>EduCreation provides digital educational content including free 4-step concept guides for Class 6-12 and paid mentor sessions. Our content is for educational purposes.</p>
                    <h2 className="text-xl font-semibold">2. Payments</h2>
                    <p>Paid plans (Spark ₹1999/month, Illuminate ₹2999/month, Mastery ₹4,999/month for parents, bulk plans for schools) are processed via 【entity-Razorpay¦canonical_name=Razorpay】. Payments via UPI, Cards, Netbanking, Wallets are supported. Corporate Netbanking available for schools.</p>
                    <h2 className="text-xl font-semibold">3. Intellectual Property</h2>
                    <p>All PDF guides, 4-step method, branding belong to EduCreation. Personal use only, not for resale.</p>
                    <h2 className="text-xl font-semibold">4. Contact</h2>
                    <p>EduCreation, Kolkata - 700105 | support@educreators.org</p>
                </div>
            </div>
        </div>
    );
}