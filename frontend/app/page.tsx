'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<'student' | 'counselor'>('student');
  const [email, setEmail] = useState('alex@northbridge.edu');
  const [password, setPassword] = useState('password123');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === 'student') router.push('/student/dashboard');
    else router.push('/admin/dashboard');
  };

  return (
    <div className="min-h-screen flex bg-[#f8f9fc]">
      {/* Left Side - Info */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center p-16 bg-[#f8f9fc]">
        <p className="text-xs font-bold tracking-widest text-indigo-500 mb-4 uppercase">
          Wellbeing, made understandable
        </p>
        <h1 className="text-5xl font-bold text-slate-900 leading-tight mb-4">
          Understand wellbeing.<br />Support better student<br />experiences.
        </h1>
        <p className="text-lg text-slate-600 mb-12 max-w-md">
          AI-powered stress insights for students and universities, designed with privacy and explainability at the core.
        </p>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white shadow-[-20px_0_40px_-10px_rgba(0,0,0,0.05)] z-10">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Welcome back</h2>
          <p className="text-slate-500 mb-8">Sign in to continue to your workspace.</p>

          {/* Role Toggle */}
          <div className="flex p-1 bg-slate-100 rounded-lg mb-6">
            <button
              onClick={() => setRole('student')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                role === 'student' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Student
            </button>
            <button
              onClick={() => setRole('counselor')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                role === 'counselor' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Counselor
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">University email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                required
              />
            </div>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center text-slate-600 cursor-pointer">
                <input type="checkbox" className="mr-2 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                Remember me
              </label>
              <a href="#" className="text-indigo-600 font-medium hover:underline">Forgot password?</a>
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors mt-2"
            >
              Sign in →
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}