'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

const Icons = {
  Logo: () => (
    <svg className="w-6 h-6 text-indigo-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
      <circle cx="12" cy="12" r="9" strokeWidth={2} />
    </svg>
  ),
  Overview: () => (
    <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
    </svg>
  ),
  Assessment: () => (
    <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0118 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3l1.5 1.5 3-3.75" />
    </svg>
  ),
  Insights: () => (
    <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
    </svg>
  ),
  Recommendations: () => (
    <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.82 1.508-2.316a7.5 7.5 0 10-7.516 0c.85.496 1.508 1.333 1.508 2.316V18" />
    </svg>
  ),
  History: () => (
    <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Lock: () => (
    <svg className="w-4 h-4 text-amber-500 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
    </svg>
  ),
  ChevronLeft: () => (
    <svg className="w-5 h-5 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  ),
  ChevronRight: () => (
    <svg className="w-5 h-5 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  )
};

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { href: '/student/dashboard', label: 'Overview', icon: <Icons.Overview /> },
    { href: '/student/assessment', label: 'My Assessment', icon: <Icons.Assessment /> },
    { href: '/student/insights', label: 'Stress Insights', icon: <Icons.Insights /> },
    { href: '/student/recommendations', label: 'Recommendations', icon: <Icons.Recommendations /> },
    { href: '/student/history', label: 'History', icon: <Icons.History /> },
  ];

  return (
    <div className="flex h-screen bg-[#f8f9fc] text-slate-900 font-sans overflow-hidden">
      <aside 
        className={`${isCollapsed ? 'w-20' : 'w-64'} bg-white border-r border-slate-200 flex flex-col justify-between transition-all duration-300 ease-in-out shrink-0`}
      >
        <div>
          {/* Header */}
          <div className="h-16 flex items-center justify-center border-b border-slate-100 px-4">
            <div className="flex items-center gap-2 overflow-hidden w-full justify-center lg:justify-start">
              <Icons.Logo />
              {!isCollapsed && <span className="font-bold text-slate-800 tracking-tight text-lg whitespace-nowrap animate-in fade-in">MindScope</span>}
            </div>
          </div>
          
          {/* Navigation */}
          <div className={`py-6 ${isCollapsed ? 'px-2' : 'px-4'}`}>
            <nav className="space-y-1.5">
              {navItems.map((item) => {
                const active = pathname.includes(item.href);
                return (
                  <button
                    key={item.href}
                    onClick={() => router.push(item.href)}
                    title={isCollapsed ? item.label : undefined}
                    className={`w-full flex items-center ${isCollapsed ? 'justify-center px-0' : 'px-3'} py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      active ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                    }`}
                  >
                    <span className={`${active ? 'text-indigo-600' : 'text-slate-400'}`}>
                      {item.icon}
                    </span>
                    {!isCollapsed && <span className="ml-3 whitespace-nowrap animate-in fade-in">{item.label}</span>}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
        
        {/* Footer Area */}
        <div className="p-4 border-t border-slate-100 flex flex-col items-center">
        
          
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3 w-full px-2'} cursor-pointer hover:bg-slate-50 py-2 rounded-xl transition-all duration-200`}>
            <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-bold shadow-inner shrink-0">
              AM
            </div>
            {!isCollapsed && (
              <div className="overflow-hidden animate-in fade-in">
                <p className="text-sm font-bold text-slate-900 whitespace-nowrap">Alex Morgan</p>
                <p className="text-xs text-slate-500 font-medium whitespace-nowrap">CE • Year 2</p>
              </div>
            )}
          </div>

          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="mt-4 w-8 h-8 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition shadow-sm"
          >
            {isCollapsed ? <Icons.ChevronRight /> : <Icons.ChevronLeft />}
          </button>
        </div>
      </aside>
      
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}