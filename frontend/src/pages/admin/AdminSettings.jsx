import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Bell, Lock, Palette, Upload, Save } from 'lucide-react';
import DashboardHeader from '../../components/admin/DashboardHeader';

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'password', label: 'Password', icon: Lock },
  { id: 'branding', label: 'Branding', icon: Palette },
];

export default function AdminSettings() {
  const [tab, setTab] = useState('profile');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // TODO: Connect to backend API to save settings
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <DashboardHeader title="Settings" />
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="bg-white rounded-2xl p-4 border border-gray-100 h-fit" style={{ boxShadow: '0 2px 12px rgba(15,27,61,0.06)' }}>
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors mb-0.5 ${tab === t.id ? 'bg-navy-900 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <t.icon size={16} />
                {t.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="lg:col-span-3 bg-white rounded-2xl p-6 border border-gray-100" style={{ boxShadow: '0 2px 12px rgba(15,27,61,0.06)' }}>
            {tab === 'profile' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                <h2 className="text-lg font-serif font-semibold text-navy-900 mb-5">Profile Information</h2>
                <div className="flex items-center gap-5 mb-6">
                  <img src="https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=100" alt="Admin" className="w-20 h-20 rounded-2xl object-cover" />
                  <label className="btn-outline text-sm py-2 px-4 cursor-pointer gap-2">
                    <Upload size={14} /> Change Photo
                    <input type="file" className="hidden" accept="image/*" />
                  </label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {[
                    { label: 'First Name', value: 'James', field: 'firstName' },
                    { label: 'Last Name', value: 'Whitmore', field: 'lastName' },
                    { label: 'Email', value: 'james@lightvisionproperty.co.za', field: 'email' },
                    { label: 'Phone', value: '+27 82 100 2001', field: 'phone' },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">{label}</label>
                      <input type="text" className="input-light" defaultValue={value} />
                    </div>
                  ))}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Bio</label>
                  <textarea rows={4} className="input-light resize-none" defaultValue="Senior Luxury Property Specialist with 15 years of experience in Cape Town's most exclusive property market." />
                </div>
              </motion.div>
            )}

            {tab === 'notifications' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                <h2 className="text-lg font-serif font-semibold text-navy-900 mb-5">Notification Preferences</h2>
                {[
                  { label: 'New Inquiries', desc: 'Get notified when a new property inquiry is submitted', defaultChecked: true },
                  { label: 'Valuation Requests', desc: 'Notifications for new valuation requests', defaultChecked: true },
                  { label: 'New Applications', desc: 'Career application submissions', defaultChecked: false },
                  { label: 'Offer Updates', desc: 'When offers are submitted or updated', defaultChecked: true },
                  { label: 'System Alerts', desc: 'Important system notifications and updates', defaultChecked: true },
                  { label: 'Weekly Reports', desc: 'Weekly performance summary emails', defaultChecked: false },
                ].map(({ label, desc, defaultChecked }) => (
                  <div key={label} className="flex items-start justify-between py-4 border-b border-gray-50">
                    <div>
                      <p className="font-medium text-navy-900 text-sm">{label}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked={defaultChecked} className="sr-only peer" />
                      <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gold-500" />
                    </label>
                  </div>
                ))}
              </motion.div>
            )}

            {tab === 'password' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                <h2 className="text-lg font-serif font-semibold text-navy-900 mb-5">Change Password</h2>
                {[
                  { label: 'Current Password', placeholder: '••••••••' },
                  { label: 'New Password', placeholder: '••••••••' },
                  { label: 'Confirm New Password', placeholder: '••••••••' },
                ].map(({ label, placeholder }) => (
                  <div key={label}>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">{label}</label>
                    <input type="password" className="input-light" placeholder={placeholder} />
                  </div>
                ))}
                <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600">
                  <p className="font-medium mb-2">Password requirements:</p>
                  <ul className="space-y-1 text-xs">
                    <li>• Minimum 8 characters</li>
                    <li>• At least one uppercase letter</li>
                    <li>• At least one number</li>
                    <li>• At least one special character</li>
                  </ul>
                </div>
              </motion.div>
            )}

            {tab === 'branding' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                <h2 className="text-lg font-serif font-semibold text-navy-900 mb-5">Branding Settings</h2>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Company Logo</label>
                  <div className="flex items-center gap-4">
                    <img src="/LOGO.png" alt="Logo" className="h-16 w-auto" />
                    <label className="btn-outline text-sm py-2 px-4 cursor-pointer gap-2">
                      <Upload size={14} /> Upload New Logo
                      <input type="file" className="hidden" accept="image/*" />
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Brand Colors</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { label: 'Primary (Navy)', value: '#0f1b3d' },
                      { label: 'Accent (Gold)', value: '#c8a96b' },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
                        <input type="color" defaultValue={value} className="w-8 h-8 rounded-lg cursor-pointer border-0" />
                        <div>
                          <p className="text-xs font-semibold text-gray-500">{label}</p>
                          <p className="text-sm font-mono text-navy-900">{value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Company Name</label>
                  <input type="text" className="input-light" defaultValue="Light Vision Property" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Tagline</label>
                  <input type="text" className="input-light" defaultValue="South Africa's Premier Luxury Real Estate" />
                </div>
              </motion.div>
            )}

            {/* Save Button */}
            <div className="mt-8 pt-5 border-t border-gray-100 flex justify-end">
              <button onClick={handleSave} className={`btn-primary gap-2 text-sm py-2.5 transition-all ${saved ? 'bg-green-500 hover:bg-green-500' : ''}`}>
                <Save size={15} />
                {saved ? 'Saved!' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
