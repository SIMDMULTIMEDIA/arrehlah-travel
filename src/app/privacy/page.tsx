export const metadata = {
  title: "Privacy Policy | Arrehlah Travel"
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 border border-slate-100">
          <h1 className="text-3xl md:text-5xl font-bold text-[var(--color-brand-navy)] mb-8">
            Privacy Policy
          </h1>
          <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
            <p>Arrehlah Travel & Tours Ltd ("we", "us", or "our") respects your privacy and is committed to protecting your personal data. This privacy policy informs you about how we look after your personal data when you visit our website or use our services.</p>

            <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">Information We Collect</h2>
            <p>To provide you with travel services, we may collect and process the following data:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Identity Data:</strong> First name, last name, date of birth, gender, passport details.</li>
              <li><strong>Contact Data:</strong> Email address, phone numbers, delivery address.</li>
              <li><strong>Financial Data:</strong> Bank account and payment card details (processed securely via third-party gateways).</li>
              <li><strong>Transaction Data:</strong> Details about payments to and from you and other details of products and services you have purchased from us.</li>
            </ul>

            <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">How We Use Your Information</h2>
            <p>We will only use your personal data for the following purposes:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>To process and manage your travel bookings (flights, hotels, visas, etc.).</li>
              <li>To communicate with you regarding your itinerary or customer service queries.</li>
              <li>To share with necessary third parties (airlines, hotels, embassies) solely for the purpose of fulfilling your booking.</li>
              <li>To send promotional materials, provided you have opted in to receive them.</li>
            </ul>

            <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">Data Security</h2>
            <p>We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way, altered, or disclosed. Access to your personal data is limited to employees, agents, and third parties who have a business need to know.</p>

            <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">Contact Us</h2>
            <p>If you have any questions about this privacy policy or our privacy practices, please contact us at our main office in Kano or via our support channels.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
