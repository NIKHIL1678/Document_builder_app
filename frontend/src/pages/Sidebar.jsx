import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Sidebar() {

  const menu = [
    { name: 'Dashboard', path: '/dashboard', icon: '📊' },
    { name: 'Files', path: '/files', icon: '📂' },
    { name: 'Document Builder', path: '/upload', icon: '📥' }, // Added your new upload route here
    { name: 'Workspace', path: '/edit', icon: '⌨️' }, // Added your new upload route here
    { name: 'AI Intelligence', path: '/ai', icon: '✨' },
    { name: 'Settings', path: '/settings', icon: '⚙️' }
  ];

  return (
    <aside className="w-72 border-r border-slate-200 bg-white p-8 hidden lg:flex flex-col h-screen sticky top-0">
      <div className="flex items-center gap-3 mb-12">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black">V</div>
        <div className="text-xl font-bold tracking-tight text-slate-800">Vault<span className="text-indigo-600">AI</span></div>
      </div>

      <nav className="space-y-2">
        {menu.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `w-full px-4 py-3 rounded-xl transition-all font-semibold text-sm flex items-center gap-3 ${isActive
                ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`
            }
          >
            <span>{item.icon}</span>
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* System Status - Bottom */}
      <div className="mt-auto p-4 bg-slate-50 rounded-2xl border border-slate-100">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 uppercase tracking-widest">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          Nodes Live
        </div>
      </div>
    </aside>
  );
}