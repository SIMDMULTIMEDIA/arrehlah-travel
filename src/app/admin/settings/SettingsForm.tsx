"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateSettings } from "@/app/actions/admin/settings";

export default function SettingsForm({ initialData }: { initialData: any }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const formData = new FormData(e.currentTarget);
    const result = await updateSettings(formData);
    
    setMessage(result.message);
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="bg-white p-6 rounded-xl border shadow-sm space-y-6">
        
        <div>
          <h3 className="text-lg font-bold mb-4 border-b pb-2 text-[var(--color-brand-navy)]">Contact Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Public Email</label>
              <Input name="contact_email" defaultValue={initialData?.contact_email || ""} placeholder="info@arrehlah.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Public Phone</label>
              <Input name="contact_phone" defaultValue={initialData?.contact_phone || ""} placeholder="+234 907 979 7429" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">WhatsApp Number</label>
              <Input name="contact_whatsapp" defaultValue={initialData?.contact_whatsapp || ""} placeholder="+234 907 979 7429" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Office Address</label>
              <Input name="contact_address" defaultValue={initialData?.contact_address || ""} placeholder="NO 37 Dantata Plaza..." />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-4 border-b pb-2 text-[var(--color-brand-navy)]">Social Media Links</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Facebook URL</label>
              <Input name="social_facebook" defaultValue={initialData?.social_facebook || ""} placeholder="https://facebook.com/..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Twitter / X URL</label>
              <Input name="social_twitter" defaultValue={initialData?.social_twitter || ""} placeholder="https://twitter.com/..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Instagram URL</label>
              <Input name="social_instagram" defaultValue={initialData?.social_instagram || ""} placeholder="https://instagram.com/..." />
            </div>
          </div>
        </div>

        {message && (
          <div className={`mt-4 p-3 rounded text-sm font-medium ${message.includes('success') ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
            {message}
          </div>
        )}

        <div className="pt-4 flex justify-end">
          <Button type="submit" disabled={loading} className="bg-[var(--color-brand-green)] hover:bg-green-700">
            {loading ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </div>
    </form>
  );
}
