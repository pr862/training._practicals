import React, { useEffect, useState } from 'react';
import { adminUsersApi } from '../../api/admin/users';
import type { User } from '../../types/user';
import { PageHeader } from '../../components/ui/PageHeader';
import { useToast } from '../../context/ToastProvider';

export const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { error: toastError } = useToast();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const data = await adminUsersApi.list();
        if (!cancelled) setUsers(data);
      } catch (e: any) {
        if (!cancelled) toastError(e?.message ?? 'Failed to load users');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <PageHeader 
        title="Users" 
        subtitle="Manage registered users" 
      />

      <div className="rounded-2xl border border-white/10 bg-white/5 shadow-lg backdrop-blur">
        <div className="border-b border-white/10 px-6 py-4 text-sm text-white/60">
          {loading ? 'Loading users...' : `${users.length} users`}
        </div>
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-white/60">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t border-white/10 hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{u.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{u.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white/80">{u.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      u.role === 'admin' 
                        ? 'bg-violet-500/15 text-violet-200 border border-violet-400/20' 
                        : 'bg-sky-500/15 text-sky-200 border border-sky-400/20'
                    }`}>
                      {u.role === 'admin' ? 'Administrator' : 'User'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-teal-500/15 text-teal-200 border border-teal-400/20">
                      Active
                    </span>
                  </td>
                </tr>
              ))}
              {!loading && users.length === 0 ? (
                <tr>
                  <td className="px-6 py-8 text-center text-sm text-white/50" colSpan={5}>
                    No users found. Users will appear here when they register.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
