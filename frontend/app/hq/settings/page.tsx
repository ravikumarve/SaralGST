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
    <div className="max-w-4xl">
      {/* Page header */}
      <div className="mb-12">
        <span className="font-mono text-xs uppercase tracking-[2px] text-[#52525b]">SETTINGS</span>
        <h1 className="font-[var(--font-serif)] text-[1.8rem] text-[#f8f9fa] tracking-[0.02em] mt-2">Account</h1>
        <p className="text-[#a1a1aa] text-sm mt-2 font-light">Manage your preferences</p>
      </div>

      {/* Profile */}
      <div className="bg-[#0a0a0a] border border-[rgba(255,255,255,0.06)] rounded-[8px] p-8 mb-8">
        <h2 className="font-[var(--font-serif)] text-lg text-[#f8f9fa] mb-6">Profile</h2>
        <div className="space-y-5">
          <div>
            <label className="block text-xs text-[#a1a1aa] mb-2 uppercase tracking-[1px]">Name</label>
            <input
              type="text"
              defaultValue={user?.name || ''}
              className="w-full px-4 py-3 bg-[#050505] border border-[rgba(255,255,255,0.06)] rounded-lg text-[#f8f9fa] placeholder-[#a1a1aa] focus:outline-none focus:border-[rgba(255,255,255,0.12)] transition-colors text-sm"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="block text-xs text-[#a1a1aa] mb-2 uppercase tracking-[1px]">Email</label>
            <input
              type="email"
              defaultValue={user?.email || ''}
              disabled
              className="w-full px-4 py-3 bg-[#050505] border border-[rgba(255,255,255,0.06)] rounded-lg text-[#52525b] cursor-not-allowed text-sm"
            />
            <p className="text-[10px] text-[#52525b] mt-1 font-mono">Email cannot be changed</p>
          </div>
          <div>
            <label className="block text-xs text-[#a1a1aa] mb-2 uppercase tracking-[1px]">Tier</label>
            <div className="text-sm text-[#f8f9fa] font-medium capitalize">{user?.tier || 'free'}</div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-[#0a0a0a] border border-[rgba(255,255,255,0.06)] rounded-[8px] p-8 mb-8">
        <h2 className="font-[var(--font-serif)] text-lg text-[#f8f9fa] mb-6">Notifications</h2>
        <div className="space-y-5">
          {[
            { id: 'rate_alerts', label: 'GST Rate Change Alerts', desc: 'Get notified when tracked HSN codes change rates' },
            { id: 'usage_alerts', label: 'Usage Limit Warnings', desc: 'Receive alerts when you approach your daily limit' },
            { id: 'billing_alerts', label: 'Billing Updates', desc: 'Payment confirmations and subscription reminders' },
          ].map((item) => (
            <div key={item.id} className="flex items-center justify-between py-2">
              <div>
                <div className="text-sm text-[#f8f9fa]">{item.label}</div>
                <div className="text-xs text-[#a1a1aa] mt-1 font-light">{item.desc}</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-9 h-5 bg-[#262626] rounded-full peer peer-checked:bg-[#f8f9fa] transition-colors" />
                <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-[#000000] rounded-full transition-transform peer-checked:translate-x-4" />
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Danger zone */}
      <div className="bg-[#0a0a0a] border border-[rgba(255,255,255,0.06)] rounded-[8px] p-8 mb-8">
        <h2 className="font-[var(--font-serif)] text-lg text-[#f8f9fa] mb-6">Danger Zone</h2>
        <p className="text-sm text-[#a1a1aa] mb-6 font-light">Irreversible actions for your account.</p>
        <button className="inline-flex items-center gap-2 px-[1.5rem] py-[0.6rem] text-sm font-medium rounded-[4px] uppercase tracking-[1px] border border-[rgba(255,255,255,0.2)] bg-transparent text-[#a1a1aa] hover:border-[#ef4444] hover:text-[#ef4444] transition-all duration-200">
          Delete Account
        </button>
      </div>

      {/* Save button */}
      <button
        onClick={handleSave}
        className="inline-flex items-center gap-2 px-[1.5rem] py-[0.6rem] text-sm font-medium rounded-[4px] uppercase tracking-[1px] border border-[#f8f9fa] bg-[#f8f9fa] text-[#000000] hover:bg-transparent hover:text-[#f8f9fa] transition-all duration-200"
      >
        {saved ? 'Saved' : 'Save Settings'}
      </button>
    </div>
  );
}
