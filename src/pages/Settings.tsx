import React, { useState, FormEvent, useEffect } from 'react';
import { User, Bell, Shield } from 'lucide-react';
import { useAuthStore } from '../store/authStore.js';
import { Header } from '../components/layout/index.js';
import { Button, Input } from '../components/ui/index.js';
import toast from 'react-hot-toast';

const Settings: React.FC = () => {
  const { user, updateProfile } = useAuthStore();
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user?.username) {
      setUsername(user.username);
    }
  }, [user?.username]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await updateProfile({ username });
      toast.success('Profile updated successfully');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900">
      <Header title="Settings" />

      <main className="p-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-display font-bold text-white mb-8">Account Settings</h1>

          {/* Profile Section */}
          <section className="bg-dark-800/50 border border-dark-600 rounded-2xl p-6 mb-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <User className="w-5 h-5 text-purple-400" />
              </div>
              <h2 className="text-lg font-semibold text-white">Profile</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <Input
                label="Email"
                value={user?.email || ''}
                disabled
                className="opacity-50"
              />
              <Button type="submit" isLoading={isLoading}>
                Save Changes
              </Button>
            </form>
          </section>

          {/* Notifications Section */}
          <section className="bg-dark-800/50 border border-dark-600 rounded-2xl p-6 mb-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                <Bell className="w-5 h-5 text-cyan-400" />
              </div>
              <h2 className="text-lg font-semibold text-white">Notifications</h2>
            </div>

            <div className="space-y-4">
              {[
                { label: 'Task assignments', checked: true },
                { label: 'Workspace invitations', checked: true },
                { label: 'New messages', checked: true },
                { label: 'Status changes', checked: false }
              ].map((item, i) => (
                <label key={i} className="flex items-center justify-between cursor-pointer">
                  <span className="text-slate-300">{item.label}</span>
                  <input
                    type="checkbox"
                    defaultChecked={item.checked}
                    className="w-5 h-5 rounded bg-dark-600 border-dark-500 text-purple-600 focus:ring-purple-500"
                  />
                </label>
              ))}
            </div>
          </section>

          {/* Security Section */}
          <section className="bg-dark-800/50 border border-dark-600 rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <Shield className="w-5 h-5 text-emerald-400" />
              </div>
              <h2 className="text-lg font-semibold text-white">Security</h2>
            </div>

            <Button variant="secondary">
              Change Password
            </Button>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Settings;