import React, { useState, memo, ReactNode } from 'react';
import { Trash2, Crown, UserMinus, Shield } from 'lucide-react';
import { useWorkspaceStore } from '../../store/workspaceStore.js';
import { useAuthStore } from '../../store/authStore.js';
import { Button, Badge } from '../ui/index.js';
import toast from 'react-hot-toast';
import { Member, User } from '../../types';

interface MemberItemProps {
  member: Member;
  isOwner: string;
  isCurrentUser: string;
  canManage: (memberId: string) => boolean;
  onRoleChange: (memberId: string, newRole: string) => void;
  onRemove: (memberId: string, username: string) => void;
  updatingRoleId: string | null;
  removingId: string | null;
}

const MemberItem: React.FC<MemberItemProps> = memo(({
  member,
  isOwner,
  isCurrentUser,
  canManage,
  onRoleChange,
  onRemove,
  updatingRoleId,
  removingId
}) => {
  const isMemberOwner = member.user?._id === isOwner;
  const isMemberCurrentUser = member.user?._id === isCurrentUser;

  return (
    <div
      className="flex items-center justify-between p-4 bg-dark-800/50 rounded-xl border border-dark-600 hover:border-dark-500 transition-colors"
    >
      <div className="flex items-center space-x-3">
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-white font-semibold">
            {(member.user?.username || 'U').charAt(0).toUpperCase()}
          </div>
          {isMemberOwner && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
              <Crown size={12} className="text-dark-900" />
            </div>
          )}
        </div>
        <div>
          <p className="font-medium text-white flex items-center gap-2">
            {member.user?.username}
            {isMemberCurrentUser && (
              <span className="text-xs text-slate-500">(you)</span>
            )}
          </p>
          <p className="text-sm text-slate-500">{member.user?.email}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {isMemberOwner ? (
          <Badge variant="warning" className="flex items-center gap-1">
            <Crown size={12} />
            Owner
          </Badge>
        ) : canManage(member.user?._id) ? (
          <>
            <select
              value={member.role}
              onChange={(e) => onRoleChange(member.user._id, e.target.value)}
              disabled={updatingRoleId === member.user._id}
              className="bg-dark-700 border border-dark-600 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
            >
              <option value="admin">Admin</option>
              <option value="member">Member</option>
            </select>
            <button
              onClick={() => onRemove(member.user._id, member.user?.username || 'member')}
              disabled={removingId === member.user._id}
              className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
              title="Remove member"
            >
              <UserMinus size={18} />
            </button>
          </>
        ) : (
          <Badge variant={member.role === 'admin' ? 'primary' : 'default'}>
            {member.role}
          </Badge>
        )}
      </div>
    </div>
  );
});

MemberItem.displayName = 'MemberItem';

interface MemberManagementProps {
  onClose?: () => void;
}

const MemberManagement: React.FC<MemberManagementProps> = ({ onClose }) => {
  const { currentWorkspace, updateMemberRole, removeMember, deleteWorkspace } = useWorkspaceStore();
  const { user } = useAuthStore();
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [updatingRoleId, setUpdatingRoleId] = useState<string | null>(null);

  const isOwner = currentWorkspace?.owner?._id === user?._id;

  const handleRoleChange = async (memberId: string, newRole: string) => {
    setUpdatingRoleId(memberId);
    try {
      await updateMemberRole(currentWorkspace!._id, memberId, newRole);
      toast.success('Role updated successfully');
    } catch {
      toast.error('Failed to update role');
    } finally {
      setUpdatingRoleId(null);
    }
  };

  const handleRemoveMember = async (memberId: string, username: string) => {
    if (!confirm(`Remove ${username} from workspace?`)) return;
    setRemovingId(memberId);
    try {
      await removeMember(currentWorkspace!._id, memberId);
      toast.success('Member removed');
    } catch {
      toast.error('Failed to remove member');
    } finally {
      setRemovingId(null);
    }
  };

  const handleDeleteWorkspace = async () => {
    if (!confirm(`Delete "${currentWorkspace?.name}"? This cannot be undone.`)) return;
    try {
      await deleteWorkspace(currentWorkspace!._id);
      toast.success('Workspace deleted');
      onClose?.();
    } catch {
      toast.error('Failed to delete workspace');
    }
  };

  const canManage = (memberId: string) => {
    if (!isOwner) return false;
    if (memberId === currentWorkspace?.owner?._id) return false;
    return true;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Shield size={20} className="text-purple-400" />
          Members ({currentWorkspace?.members?.length || 0})
        </h3>
        {isOwner && (
          <Button
            variant="danger"
            size="sm"
            onClick={handleDeleteWorkspace}
            className="flex items-center gap-1"
          >
            <Trash2 size={14} />
            Delete Workspace
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {currentWorkspace?.members?.map((member) => (
          <MemberItem
            key={member.user?._id}
            member={member}
            isOwner={currentWorkspace.owner?._id ?? ''}
            isCurrentUser={user?._id ?? ''}
            canManage={canManage}
            onRoleChange={handleRoleChange}
            onRemove={handleRemoveMember}
            updatingRoleId={updatingRoleId}
            removingId={removingId}
          />
        ))}
      </div>
    </div>
  );
};

export default MemberManagement;