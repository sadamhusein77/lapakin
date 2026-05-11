import { User, ShoppingBag, Settings } from 'lucide-react';
import type { Role } from '../../../../domain/entities';

interface RoleSwitcherProps {
  currentRole: Role;
  onRoleChange: (role: Role) => void;
  allowedRoles?: Role[]; // If not provided, all roles are accessible
}

const roles: { key: Role; label: string; icon: typeof User }[] = [
  { key: 'customer', label: 'Pelanggan', icon: User },
  { key: 'vendor', label: 'Pedagang', icon: ShoppingBag },
  { key: 'admin', label: 'Admin', icon: Settings },
];

export function RoleSwitcher({ currentRole, onRoleChange, allowedRoles }: RoleSwitcherProps) {
  const accessibleRoles = allowedRoles ? roles.filter(r => allowedRoles.includes(r.key)) : roles;

  return (
    <div className="flex items-center gap-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full p-1.5 shadow-lg">
      {accessibleRoles.map((role) => {
        const Icon = role.icon;
        const isActive = currentRole === role.key;
        return (
          <button
            key={role.key}
            onClick={() => onRoleChange(role.key)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200
              ${isActive
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }
            `}
          >
            <Icon size={16} />
            <span className="text-sm font-medium">{role.label}</span>
          </button>
        );
      })}
    </div>
  );
}