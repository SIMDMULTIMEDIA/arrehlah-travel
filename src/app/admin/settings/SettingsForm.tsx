"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateSocialSettings } from "@/app/actions/admin/settings";

export default function SettingsForm({ initialData }: { initialData: any }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const formData = new FormData(e.currentTarget);
    const result = await updateSocialSettings(formData);
    
    setMessage(result.message);
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="bg-white p-6 rounded-xl border shadow-sm">
        <h3 className="text-lg font-bold mb-4">Social Media Links</h3>
        
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

        {message && (
          <div className="mt-4 p-3 bg-slate-50 text-slate-800 rounded text-sm">
            {message}
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </div>
    </form>
  );
}
