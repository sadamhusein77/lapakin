import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, ShoppingBag, Settings, ChevronRight, MapPin } from 'lucide-react';
import { mockAccounts } from '../../data/datasources/local';
import type { Role, MockAccount } from '../../domain/entities';
import { Button } from '../components/ui/button';

interface LoginPageProps {
  onLogin: (account: MockAccount) => void;
}

const roleConfig = {
  customer: {
    icon: User,
    title: 'Pelanggan',
    description: 'Temukan dan rating pedagang kaki lima di sekitarmu',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  vendor: {
    icon: ShoppingBag,
    title: 'Pedagang',
    description: 'Kelola lokasi dan jadwal buka warungmu',
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
  },
  admin: {
    icon: Settings,
    title: 'Admin',
    description: 'Kelola semua pedagang dan pengaturan sistem',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
};

export function LoginPage({ onLogin }: LoginPageProps) {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
  };

  const handleLogin = () => {
    if (!selectedRole) return;
    const account = mockAccounts.find(acc => acc.role === selectedRole);
    if (account) {
      onLogin(account);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        {/* Logo / Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
              <MapPin className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Lapakin</h1>
          <p className="text-blue-200">Peta Pedagang Kaki Lima Indonesia</p>
        </div>

        {/* Role Selection */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6">
          <h2 className="text-xl font-semibold text-slate-800 mb-6 text-center">
            Pilih Peran Kamu
          </h2>

          <div className="space-y-3 mb-6">
            {(Object.keys(roleConfig) as Role[]).map((role) => {
              const config = roleConfig[role];
              const Icon = config.icon;
              const isSelected = selectedRole === role;

              return (
                <motion.button
                  key={role}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleRoleSelect(role)}
                  className={`
                    w-full p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-4
                    ${isSelected
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                    }
                  `}
                >
                  <div className={`p-3 rounded-xl ${config.bgColor}`}>
                    <Icon className={`w-6 h-6 ${config.color}`} />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-semibold text-slate-800">{config.title}</h3>
                    <p className="text-sm text-slate-500">{config.description}</p>
                  </div>
                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-white" />
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>

          <Button
            onClick={handleLogin}
            disabled={!selectedRole}
            className="w-full"
            size="lg"
          >
            Masuk sebagai {selectedRole ? roleConfig[selectedRole].title : '...'}
            <ChevronRight size={20} />
          </Button>
        </div>

        {/* Footer note */}
        <p className="text-center text-blue-200 text-sm mt-6">
          Demo mode - tidak memerlukan kata sandi
        </p>
      </motion.div>
    </div>
  );
}