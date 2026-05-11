import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, LayoutGrid, Users, ArrowRight } from 'lucide-react';
import { useWorkspaceStore } from '../store/workspaceStore.js';
import { useAuthStore } from '../store/authStore.js';
import { useNotifications } from '../hooks/useNotifications.js';
import { Header } from '../components/layout/index.js';
import { Button, Spinner } from '../components/ui/index.js';
import { Workspace } from '../types';

const Dashboard: React.FC = () => {
  const { workspaces, isLoading, fetchWorkspaces, createWorkspace, joinWorkspace } = useWorkspaceStore();
  const { user } = useAuthStore();
  useNotifications();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [newWorkspaceDesc, setNewWorkspaceDesc] = useState('');
  const [joinCode, setJoinCode] = useState('');

  React.useEffect(() => {
    fetchWorkspaces();
  }, [fetchWorkspaces]);

  const handleCreateWorkspace = async () => {
    if (!newWorkspaceName.trim()) return;
    try {
      await createWorkspace({ name: newWorkspaceName, description: newWorkspaceDesc });
      setShowCreateModal(false);
      setNewWorkspaceName('');
      setNewWorkspaceDesc('');
    } catch (error) {
      console.error('Failed to create workspace:', error);
    }
  };

  const handleJoinWorkspace = async () => {
    if (!joinCode.trim()) return;
    try {
      await joinWorkspace(joinCode);
      setShowJoinModal(false);
      setJoinCode('');
    } catch (error) {
      console.error('Failed to join workspace:', error);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900">
      <Header title="Dashboard" />

      <main className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-display font-bold text-white">
              Welcome back, {user?.username}
            </h1>
            <p className="text-slate-400 mt-2">Manage your workspaces and collaborate with your team</p>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-4 mb-8">
            <Button onClick={() => setShowCreateModal(true)} className="flex items-center space-x-2">
              <Plus size={18} />
              <span>Create Workspace</span>
            </Button>
            <Button onClick={() => setShowJoinModal(true)} variant="secondary" className="flex items-center space-x-2">
              <Users size={18} />
              <span>Join Workspace</span>
            </Button>
          </div>

          {/* Workspaces Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Spinner size="lg" />
            </div>
          ) : workspaces.length === 0 ? (
            <div className="text-center py-20 bg-dark-800/50 rounded-2xl border border-dark-600">
              <LayoutGrid className="w-16 h-16 mx-auto text-slate-600 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No workspaces yet</h3>
              <p className="text-slate-400 mb-6">Create your first workspace to start collaborating</p>
              <Button onClick={() => setShowCreateModal(true)} className="inline-flex items-center space-x-2">
                <Plus size={18} />
                <span>Create Workspace</span>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {workspaces.map((workspace: Workspace) => (
                <Link
                  key={workspace._id}
                  to={`/workspace/${workspace._id}`}
                  className="group bg-dark-800/80 border border-dark-600 rounded-2xl p-6 hover:border-purple-500/50 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg">
                      {workspace.name.charAt(0).toUpperCase()}
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{workspace.name}</h3>
                  <p className="text-sm text-slate-400 mb-4 line-clamp-2">
                    {workspace.description || 'No description'}
                  </p>
                  <div className="flex items-center space-x-2">
                    <div className="flex -space-x-2">
                      {workspace.members?.slice(0, 3).map((member, i) => (
                        <div
                          key={member.user?._id || i}
                          className="w-6 h-6 rounded-full bg-purple-400 border-2 border-dark-800 flex items-center justify-center text-xs text-white"
                        >
                          {(member.user?.username || 'U').charAt(0)}
                        </div>
                      ))}
                    </div>
                    <span className="text-xs text-slate-500">
                      {workspace.members?.length || 0} members
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Create Workspace Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="w-full max-w-lg bg-dark-800 rounded-2xl border border-dark-600 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Create Workspace</h2>
            <div className="space-y-4">
              <input
                type="text"
                value={newWorkspaceName}
                onChange={(e) => setNewWorkspaceName(e.target.value)}
                placeholder="Workspace Name"
                className="w-full px-4 py-3 rounded-xl bg-dark-700 border border-dark-500 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                autoFocus
              />
              <input
                type="text"
                value={newWorkspaceDesc}
                onChange={(e) => setNewWorkspaceDesc(e.target.value)}
                placeholder="Description (optional)"
                className="w-full px-4 py-3 rounded-xl bg-dark-700 border border-dark-500 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <div className="flex gap-3">
                <Button onClick={handleCreateWorkspace} className="flex-1">Create</Button>
                <Button onClick={() => setShowCreateModal(false)} variant="secondary" className="flex-1">Cancel</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Join Workspace Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="w-full max-w-lg bg-dark-800 rounded-2xl border border-dark-600 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Join Workspace</h2>
            <div className="space-y-4">
              <input
                type="text"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                placeholder="Enter invite code"
                className="w-full px-4 py-3 rounded-xl bg-dark-700 border border-dark-500 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                autoFocus
              />
              <div className="flex gap-3">
                <Button onClick={handleJoinWorkspace} className="flex-1">Join</Button>
                <Button onClick={() => setShowJoinModal(false)} variant="secondary" className="flex-1">Cancel</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;