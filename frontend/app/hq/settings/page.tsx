'use client';

import { useSession } from 'next-auth/react';
import { useState } from 'react';

export default function SettingsPage() {
  const { data: session } = useSession();
  const user = session?.user;
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="text-2xl font-bold text-[#ededed] mb-1">Settings</h1>
      <p className="text-[#71717a] text-sm mb-8">Manage your account preferences</p>

      {/* Profile */}
      <div className="bg-[#0a0a0a] border border-[#262626] rounded-2xl p-6 mb-6">
        <h2 className="text-sm font-semibold text-[#ededed] mb-4">Profile</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-[#a1a1aa] mb-2">Name</label>
            <input
              type="text"
              defaultValue={user?.name || ''}
              className="w-full px-4 py-3 bg-[#141414] border border-[#262626] rounded-xl text-[#ededed] placeholder-[#71717a] focus:outline-none focus:border-[#F59E0B]/40 transition-colors"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="block text-sm text-[#a1a1aa] mb-2">Email</label>
            <input
              type="email"
              defaultValue={user?.email || ''}
              disabled
              className="w-full px-4 py-3 bg-[#141414] border border-[#262626] rounded-xl text-[#52525b] cursor-not-allowed"
            />
            <p className="text-[10px] text-[#52525b] mt-1">Email cannot be changed</p>
          </div>
          <div>
            <label className="block text-sm text-[#a1a1aa] mb-2">Tier</label>
            <div className="text-sm text-[#F59E0B] font-medium capitalize">{user?.tier || 'free'}</div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-[#0a0a0a] border border-[#262626] rounded-2xl p-6 mb-6">
        <h2 className="text-sm font-semibold text-[#ededed] mb-4">Notifications</h2>
        <div className="space-y-4">
          {[
            { id: 'rate_alerts', label: 'GST Rate Change Alerts', desc: 'Get notified when tracked HSN codes change rates' },
            { id: 'usage_alerts', label: 'Usage Limit Warnings', desc: 'Receive alerts when you approach your daily limit' },
            { id: 'billing_alerts', label: 'Billing Updates', desc: 'Payment confirmations and subscription reminders' },
          ].map((item) => (
            <div key={item.id} className="flex items-center justify-between py-3">
              <div>
                <div className="text-sm text-[#ededed]">{item.label}</div>
                <div className="text-xs text-[#71717a]">{item.desc}</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-9 h-5 bg-[#262626] rounded-full peer peer-checked:bg-[#F59E0B] transition-colors" />
                <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-[#ededed] rounded-full transition-transform peer-checked:translate-x-4" />
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Danger zone */}
      <div className="bg-[#0a0a0a] border border-[#262626] rounded-2xl p-6">
        <h2 className="text-sm font-semibold text-[#FBBF24] mb-4">Danger Zone</h2>
        <button className="px-5 py-2.5 text-sm text-[#FBBF24] bg-[rgba(251,191,36,0.1)] border border-[rgba(251,191,36,0.2)] rounded-xl hover:bg-[rgba(251,191,36,0.2)] transition-colors">
          Delete Account
        </button>
      </div>

      {/* Save button */}
      <button
        onClick={handleSave}
        className="mt-8 px-6 py-3 bg-[#F59E0B] text-[#020202] font-bold rounded-xl hover:bg-[#FBBF24] transition-colors"
      >
        {saved ? 'Saved ✓' : 'Save Settings'}
      </button>
    </div>
  );
}
