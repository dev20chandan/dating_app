import { useEffect, useState } from 'react';
import { Trash2, Edit, CheckCircle2, XCircle, ShieldOff, Ban, Eye, X } from 'lucide-react';
import api from '../services/api';

export default function Users() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedProfile, setSelectedProfile] = useState<any>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data.body || response.data);
    } catch (error) {
      console.error('Failed to fetch users', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleViewUser = async (user: any) => {
    setSelectedUser(user);
    setLoadingProfile(true);
    try {
      const response = await api.get(`/admin/users/${user._id}/profile`);
      setSelectedProfile(response.data.body || response.data);
    } catch (error) {
      console.error('Failed to fetch profile', error);
      setSelectedProfile(null);
    } finally {
      setLoadingProfile(false);
    }
  };

  const closeViewModal = () => {
    setSelectedUser(null);
    setSelectedProfile(null);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/admin/users/${id}`);
        fetchUsers();
      } catch (error) {
        console.error('Failed to delete user', error);
      }
    }
  };

  const handleBlockToggle = async (user: any) => {
    const action = user.isBlocked ? 'unblock' : 'block';
    if (window.confirm(`Are you sure you want to ${action} this user?`)) {
      try {
        await api.patch(`/admin/users/${user._id}/${action}`);
        fetchUsers();
      } catch (error) {
        console.error(`Failed to ${action} user`, error);
      }
    }
  };

  if (loading) {
    return <div className="text-slate-400">Loading users...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">User Management</h1>
          <p className="text-slate-400">View and manage all registered users.</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/50 border-b border-slate-800 text-slate-400 text-sm">
                <th className="py-4 px-6 font-medium">Email / Phone</th>
                <th className="py-4 px-6 font-medium">Status</th>
                <th className="py-4 px-6 font-medium">Joined</th>
                <th className="py-4 px-6 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-slate-800/20 transition-colors">
                  <td className="py-4 px-6">
                    <div className="font-medium text-slate-200">{user.email || user.phoneNumber}</div>
                    <div className="text-sm text-slate-500">{user._id}</div>
                  </td>
                  <td className="py-4 px-6 space-y-1">
                    <div>
                      {user.isVerified ? (
                        <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                          <CheckCircle2 size={14} /> Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-medium bg-slate-500/10 text-slate-400 border border-slate-500/20">
                          <XCircle size={14} /> Unverified
                        </span>
                      )}
                    </div>
                    {user.isBlocked && (
                      <div>
                        <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                          <Ban size={14} /> Blocked
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-6 text-slate-400">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6 text-right space-x-2">
                    <button 
                      onClick={() => handleViewUser(user)}
                      className="p-2 text-slate-400 hover:text-blue-400 transition-colors bg-slate-950 rounded-lg border border-slate-800 hover:border-blue-400/50"
                      title="View Details"
                    >
                      <Eye size={16} />
                    </button>
                    <button 
                      onClick={() => handleBlockToggle(user)}
                      className={`p-2 transition-colors bg-slate-950 rounded-lg border border-slate-800 ${user.isBlocked ? 'text-green-400 hover:text-green-300 hover:border-green-400/50' : 'text-orange-400 hover:text-orange-300 hover:border-orange-400/50'}`}
                      title={user.isBlocked ? 'Unblock User' : 'Block User'}
                    >
                      {user.isBlocked ? <ShieldOff size={16} /> : <Ban size={16} />}
                    </button>
                    <button 
                      onClick={() => handleDelete(user._id)}
                      className="p-2 text-slate-400 hover:text-red-400 transition-colors bg-slate-950 rounded-lg border border-slate-800 hover:border-red-400/50"
                      title="Delete User"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-500">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl relative max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-slate-800 shrink-0">
              <h2 className="text-xl font-bold text-white">User Details</h2>
              <button 
                onClick={closeViewModal}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-500 mb-1">User ID</p>
                  <p className="text-slate-200 font-mono bg-slate-950 p-2 rounded-lg border border-slate-800 text-sm">{selectedUser._id}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Joined Date</p>
                  <p className="text-slate-200 bg-slate-950 p-2 rounded-lg border border-slate-800 text-sm">{new Date(selectedUser.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Email</p>
                  <p className="text-slate-200 bg-slate-950 p-2 rounded-lg border border-slate-800 text-sm">{selectedUser.email || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Phone Number</p>
                  <p className="text-slate-200 bg-slate-950 p-2 rounded-lg border border-slate-800 text-sm">{selectedUser.phoneNumber || 'N/A'}</p>
                </div>
              </div>

              <div className="flex gap-4 p-4 bg-slate-950 rounded-xl border border-slate-800">
                <div className="flex-1">
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Role</p>
                  <p className="text-slate-200 font-medium">{selectedUser.role}</p>
                </div>
                <div className="flex-1 border-l border-slate-800 pl-4">
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Verification</p>
                  <p className={selectedUser.isVerified ? 'text-green-400 font-medium' : 'text-slate-400 font-medium'}>
                    {selectedUser.isVerified ? 'Verified' : 'Unverified'}
                  </p>
                </div>
                <div className="flex-1 border-l border-slate-800 pl-4">
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Status</p>
                  <p className={selectedUser.isBlocked ? 'text-red-400 font-medium' : 'text-green-400 font-medium'}>
                    {selectedUser.isBlocked ? 'Blocked' : 'Active'}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <h3 className="text-lg font-semibold text-white mb-4">Profile Information</h3>
                {loadingProfile ? (
                  <p className="text-slate-400 animate-pulse">Loading profile data...</p>
                ) : selectedProfile ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-slate-500 mb-1">Full Name</p>
                        <p className="text-slate-200">{selectedProfile.firstName} {selectedProfile.lastName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 mb-1">Age / DOB</p>
                        <p className="text-slate-200">{selectedProfile.age} ({new Date(selectedProfile.dob).toLocaleDateString()})</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 mb-1">Gender</p>
                        <p className="text-slate-200">{selectedProfile.gender}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 mb-1">Interested In</p>
                        <p className="text-slate-200">{selectedProfile.interestedIn}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 mb-1">Location</p>
                        <p className="text-slate-200">{selectedProfile.city || 'N/A'}, {selectedProfile.country || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 mb-1">Relationship Goal</p>
                        <p className="text-slate-200">{selectedProfile.relationshipGoal || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 mb-1">Occupation</p>
                        <p className="text-slate-200">{selectedProfile.occupation || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 mb-1">Education</p>
                        <p className="text-slate-200">{selectedProfile.education || 'N/A'}</p>
                      </div>
                    </div>
                    
                    {selectedProfile.bio && (
                      <div>
                        <p className="text-sm text-slate-500 mb-1">Bio</p>
                        <p className="text-slate-200 bg-slate-950 p-3 rounded-lg border border-slate-800 text-sm whitespace-pre-wrap">
                          {selectedProfile.bio}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-slate-500 italic bg-slate-950 p-4 rounded-xl border border-slate-800/50 text-center">
                    No profile created yet for this user.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
