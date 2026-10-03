export default function RefundPage() {
    return (
        <div className="min-h-screen bg-white text-black">
            <div className="max-w-4xl mx-auto px-6 py-12">
                <a href="/" className="text-sm text-gray-500 hover:text-black">← Back to Home</a>
                <h1 className="text-4xl font-bold mt-6">Cancellation and Refund Policy</h1>
                <p className="text-sm text-gray-500 mt-2">Last updated: May 13, 2026</p>
                <div className="mt-8 space-y-4 text-">
                    <p>Free PDFs at /get-pdf are free.</p>
                    <p>Parents ₹1,999/mo: 7-day refund. Email support@educreators.org</p>
                    <p>Schools: 30-day notice, pro-rata NEFT refund 7-10 days.</p>
                </div>
            </div>
        </div>
    );
}