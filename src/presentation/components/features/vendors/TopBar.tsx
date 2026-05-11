import { LogOut } from 'lucide-react';
import type { MockAccount, Role } from '../../../../domain/entities';
import { RoleSwitcher } from './RoleSwitcher';

interface TopBarProps {
  currentAccount: MockAccount;
  activeRole: Role;
  onRoleChange: (role: Role) => void;
  onLogout: () => void;
}

export function TopBar({ currentAccount, activeRole, onRoleChange, onLogout }: TopBarProps) {
  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">LAPAKIN</h1>
          <div className="h-6 w-px bg-slate-300 dark:bg-slate-600" />
          <RoleSwitcher
            currentRole={activeRole}
            onRoleChange={onRoleChange}
            allowedRoles={[currentAccount.role]}
          />
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right mr-2">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
              {currentAccount.name}
            </p>
            <p className="text-xs text-slate-500 capitalize">{activeRole}</p>
          </div>
          <button
            onClick={onLogout}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            title="Logout"
          >
            <LogOut size={20} className="text-slate-500" />
          </button>
        </div>
      </div>
    </div>
  );
}