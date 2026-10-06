'use client';

import { usePathname, useRouter } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { href: '/admin/dashboard', label: 'Overview', icon: '📊' },
    { href: '/admin/cohort', label: 'Cohort Analytics', icon: '👥' },
    { href: '/admin/stressors', label: 'Stressors', icon: '⚠️' }
  ];

  return (
    <div className="flex h-screen bg-[#f8f9fc] text-slate-900 font-sans">
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between">
        <div>
          <div className="h-16 flex items-center px-6 border-b border-slate-100">
            <span className="text-xl font-bold text-indigo-600 mr-2">⊚</span>
            <span className="font-bold text-slate-800 tracking-tight">MindScope</span>
          </div>
          <div className="px-4 py-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 ml-2">Institution Workspace</p>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const active = pathname.includes(item.href);
                return (
                  <button
                    key={item.href}
                    onClick={() => router.push(item.href)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      active ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className={active ? 'text-indigo-600' : 'text-slate-400'}>{item.icon}</span>
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
        
        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-bold">
              DR
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900">Dr. Rhea Sen</p>
              <p className="text-xs text-slate-500">Student Wellbeing Office</p>
            </div>
          </div>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}