export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-white text-black">
            <div className="max-w-4xl mx-auto px-6 py-12">
                <a href="/" className="text-sm text-gray-500 hover:text-black">← Back to Home</a>
                <h1 className="text-4xl font-bold mt-6">Privacy Policy</h1>
                <p className="text-sm text-gray-500 mt-2">Last updated: May 13, 2026 | EduCreation</p>
                <div className="mt-8 space-y-6 text- leading-relaxed">
                    <p>At EduCreation (educreators.org), we respect your privacy.</p>
                    <h2 className="text-xl font-semibold mt-8">1. Data We Collect</h2>
                    <ul className="list-disc pl-5 space-y-2">
                        <li><strong>Parent info:</strong> Name, email, phone</li>
                        <li><strong>Child learning:</strong> Class, Subject, Topic, Problem - to personalize PDF</li>
                        <li><strong>Payments:</strong> Via 【entity-Razorpay¦canonical_name=Razorpay】 (we don't store card/UPI)</li>
                        <li><strong>Cookies:</strong> Pixel 1438654674832607 for ads measurement</li>
                    </ul>
                    <h2 className="text-xl font-semibold">2. How We Use</h2>
                    <p>Generate PDFs, send email, process payments, WhatsApp follow-up, Facebook ads optimization via CAPI Gateway.</p>
                    <h2 className="text-xl font-semibold">3. Contact</h2>
                    <p>support@educreators.org | Kolkata - 700105 | Delete data: email us.</p>
                </div>
            </div>
        </div>
    );
}