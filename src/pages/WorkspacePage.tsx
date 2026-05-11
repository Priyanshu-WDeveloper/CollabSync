import React, { useEffect, useState, lazy, Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Settings, Users, Copy, Check } from 'lucide-react';
import { useWorkspaceStore } from '../store/workspaceStore.js';
import { useAuthStore } from '../store/authStore.js';
import { useNotifications } from '../hooks/useNotifications.js';
import { Header } from '../components/layout/index.js';
import { Button, Spinner } from '../components/ui/index.js';
import { WorkspaceSettingsModal } from '../components/workspace/index.js';
import MemberManagement from '../components/workspace/MemberManagement.jsx';
import toast from 'react-hot-toast';

// Lazy load heavy components
const KanbanBoard = lazy(() => import('../components/tasks/KanbanBoard.tsx'));
const Chat = lazy(() => import('../components/chat/Chat.tsx'));

const WorkspacePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentWorkspace, fetchWorkspace, leaveWorkspace, generateInviteCode, isLoading } = useWorkspaceStore();
  const { user } = useAuthStore();
  useNotifications();
  const [activeTab, setActiveTab] = useState('tasks');
  const [copied, setCopied] = useState(false);
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [chatUnreadCount, setChatUnreadCount] = useState(0);

  const LoadingFallback: React.FC = () => (
    <div className="flex items-center justify-center h-64">
      <Spinner size="lg" />
    </div>
  );

  useEffect(() => {
    if (id) {
      fetchWorkspace(id);
    }
    return () => leaveWorkspace();
  }, [id, fetchWorkspace, leaveWorkspace]);

  const handleGenerateInvite = async () => {
    try {
      const data = await generateInviteCode(id!) as { code: string };
      setInviteCode(data.code);
      toast.success('Invite code generated!');
    } catch {
      toast.error('Failed to generate invite code');
    }
  };

  const copyToClipboard = () => {
    if (inviteCode) {
      navigator.clipboard.writeText(inviteCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading || !currentWorkspace) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const isOwner = currentWorkspace.owner?._id === user?._id;
  const canManage = isOwner || currentWorkspace.members?.find(m => m.user?._id === user?._id && m.role === 'admin');

  return (
    <div className="min-h-screen bg-dark-900">
      <Header
        title={currentWorkspace.name}
        onMenuClick={() => {}}
      />

      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Back & Actions */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Back to Dashboard</span>
            </button>

            <div className="flex items-center space-x-3">
              {canManage && (
                <>
                  <Button variant="secondary" size="sm" onClick={handleGenerateInvite}>
                    <Users size={16} className="mr-2" />
                    Generate Invite
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setShowSettings(true)}>
                    <Settings size={16} />
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Invite Code Banner */}
          {inviteCode && (
            <div className="mb-6 p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-300 font-medium">Invite Code</p>
                <p className="text-xl font-mono text-white">{inviteCode}</p>
              </div>
              <button
                onClick={copyToClipboard}
                className="p-2 rounded-lg bg-purple-500/20 text-purple-300 hover:text-white hover:bg-purple-500/30 transition-colors"
              >
                {copied ? <Check size={20} /> : <Copy size={20} />}
              </button>
            </div>
          )}

          {/* Tabs */}
          <div className="flex space-x-4 mb-6 border-b border-dark-600">
            <button
              onClick={() => setActiveTab('tasks')}
              className={`px-4 py-3 font-medium capitalize transition-colors ${
                activeTab === 'tasks'
                  ? 'text-purple-400 border-b-2 border-purple-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Tasks
            </button>
            <button
              onClick={() => {
                setActiveTab('chat');
                setChatUnreadCount(0);
              }}
              className={`relative px-4 py-3 font-medium capitalize transition-colors ${
                activeTab === 'chat'
                  ? 'text-purple-400 border-b-2 border-purple-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span className="flex items-center gap-2">
                Chat
                {chatUnreadCount > 0 && (
                  <span className="w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                    {chatUnreadCount > 9 ? '9+' : chatUnreadCount}
                  </span>
                )}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('members')}
              className={`px-4 py-3 font-medium capitalize transition-colors ${
                activeTab === 'members'
                  ? 'text-purple-400 border-b-2 border-purple-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Members
            </button>
          </div>

          {/* Tab Content */}
          <div className="mt-6">
            {activeTab === 'tasks' && (
              <Suspense fallback={<LoadingFallback />}>
                <KanbanBoard workspaceId={id!} />
              </Suspense>
            )}
            {activeTab === 'chat' && (
              <Suspense fallback={<LoadingFallback />}>
                <Chat workspaceId={id!} onUnreadCountChange={setChatUnreadCount} />
              </Suspense>
            )}
            {activeTab === 'members' && <MemberManagement />}
          </div>
        </div>
      </div>

      <WorkspaceSettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </div>
  );
};

export default WorkspacePage;