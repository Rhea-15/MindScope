'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

// Modern SVG Icons
const Icons = {
  Calendar: () => (
    <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  Pulse: () => (
    <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  AlertTarget: () => (
    <svg className="w-5 h-5 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  Sparkle: () => (
    <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  ),
  ArrowRight: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
  ),
  CuteRobot: () => (
    <svg width="180" height="180" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-xl" style={{ transform: 'translateY(0)', animation: 'float 4s ease-in-out infinite' }}>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
      `}</style>
      <ellipse cx="100" cy="185" rx="45" ry="8" fill="#E2E8F0" opacity="0.6" />
      <path d="M100 45 L100 20" stroke="#818CF8" strokeWidth="4" strokeLinecap="round" />
      <circle cx="100" cy="15" r="7" fill="#F472B6" />
      <circle cx="98" cy="13" r="2" fill="#FFFFFF" />
      <rect x="30" y="80" width="12" height="32" rx="6" fill="#C7D2FE" />
      <rect x="158" y="80" width="12" height="32" rx="6" fill="#C7D2FE" />
      <rect x="42" y="45" width="116" height="96" rx="32" fill="#FFFFFF" stroke="#EEF2FF" strokeWidth="3" />
      <rect x="56" y="65" width="88" height="54" rx="18" fill="#1E1B4B" />
      <path d="M72 92 Q81 80 90 92" stroke="#818CF8" strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M110 92 Q119 80 128 92" stroke="#818CF8" strokeWidth="4" strokeLinecap="round" fill="none" />
      <circle cx="68" cy="105" r="6" fill="#F472B6" opacity="0.9" />
      <circle cx="132" cy="105" r="6" fill="#F472B6" opacity="0.9" />
      <path d="M38 115 Q15 125 25 150" stroke="#818CF8" strokeWidth="6" strokeLinecap="round" fill="none" />
      <path d="M162 115 Q185 125 175 150" stroke="#818CF8" strokeWidth="6" strokeLinecap="round" fill="none" />
      <circle cx="25" cy="150" r="9" fill="#FFFFFF" stroke="#818CF8" strokeWidth="3" />
      <circle cx="175" cy="150" r="9" fill="#FFFFFF" stroke="#818CF8" strokeWidth="3" />
      <path d="M82 140 L118 140 L108 160 L92 160 Z" fill="#C7D2FE" />
      <circle cx="100" cy="168" r="8" fill="#38BDF8" opacity="0.9" />
      <circle cx="100" cy="168" r="4" fill="#FFFFFF" />
    </svg>
  )
};

// Generates a tailored 2-line note based on the specific top stressor
const getStressorAdvice = (featureName: string) => {
  const normalized = featureName.toLowerCase().replace(/_/g, ' ');

  if (normalized.includes('teacher') || normalized.includes('relationship')) {
    return {
      title: 'Strengthen Academic Rapport',
      line1: 'Schedule a brief 10-minute office hour to clarify course expectations.',
      line2: 'Prepare two specific questions in advance to keep the conversation focused and productive.',
    };
  }
  if (normalized.includes('study') || normalized.includes('load')) {
    return {
      title: 'Pace Your Study Load',
      line1: 'Divide large assignments into 25-minute focused blocks with mandatory breaks.',
      line2: 'Tackle the most demanding task during your peak energy hours to prevent cognitive fatigue.',
    };
  }
  if (normalized.includes('sleep')) {
    return {
      title: 'Protect Your Sleep Routine',
      line1: 'Power down blue-light screens 45 minutes before bed to allow melatonin release.',
      line2: 'Keep your wake time consistent to stabilize your circadian rhythm across the week.',
    };
  }
  if (normalized.includes('anxiety')) {
    return {
      title: 'Reset Acute Nervous System Tension',
      line1: 'Practice 4-7-8 breathing for 3 minutes whenever physical tension spikes.',
      line2: 'Write down worries onto paper to separate actionable tasks from uncontrollable doubts.',
    };
  }
  if (normalized.includes('peer') || normalized.includes('social')) {
    return {
      title: 'Cultivate Supportive Boundaries',
      line1: 'Step back from high-pressure peer comparisons and focus on your individual progress.',
      line2: 'Reach out to one trusted friend or peer for an informal, non-academic check-in.',
    };
  }
  if (normalized.includes('future') || normalized.includes('career')) {
    return {
      title: 'Ground Career Uncertainty',
      line1: 'Focus on mastering one skill or project milestone this month rather than the entire horizon.',
      line2: 'Schedule a low-stakes consultation with campus placement advisory to map real options.',
    };
  }
  if (normalized.includes('financial') || normalized.includes('basic')) {
    return {
      title: 'Connect with Campus Support',
      line1: 'Check student welfare assistance programs for confidential grant and budget resources.',
      line2: 'Review essential recurring costs to regain predictability over your immediate schedule.',
    };
  }
  return {
    title: 'Daily Wellbeing Focus',
    line1: 'Incorporate 15 minutes of screen-free restorative downtime into your afternoon.',
    line2: 'Prioritize small, incremental wins today rather than attempting to solve everything at once.',
  };
};

export default function StudentDashboard() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [greeting, setGreeting] = useState('Good morning');

  useEffect(() => {
    // Dynamic Time-Based Greeting
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');

    // 1. Fetch latest prediction
    const storedLatest = localStorage.getItem('latestPrediction');
    const latestPred = storedLatest ? JSON.parse(storedLatest) : null;

    // 2. Fetch realtime assessment history
    const storedHistory = localStorage.getItem('assessmentHistory');
    let historyList: any[] = [];

    if (storedHistory) {
      try {
        historyList = JSON.parse(storedHistory);
      } catch (e) {
        historyList = [];
      }
    }

    // 3. Format Realtime Trend Points
    let trendPoints: { label: string; val: number; dateStr: string; level: string }[] = [];

    if (historyList && historyList.length > 0) {
      trendPoints = historyList.map((entry: any) => {
        const d = entry.date ? new Date(entry.date) : new Date();
        const month = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const levelCode = typeof entry.stress_level_code === 'number'
          ? entry.stress_level_code
          : entry.stress_level === 'Low' ? 0 : entry.stress_level === 'High' ? 2 : 1;

        return {
          label: month,
          val: levelCode + 1, // 1: Low, 2: Moderate, 3: High
          dateStr: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          level: entry.stress_level || (levelCode === 0 ? 'Low' : levelCode === 2 ? 'High' : 'Moderate'),
        };
      });
    } else if (latestPred) {
      const code = typeof latestPred.stress_level_code === 'number' ? latestPred.stress_level_code : 1;
      trendPoints = [
        {
          label: 'Current',
          val: code + 1,
          dateStr: 'Recent',
          level: latestPred.stress_level || 'Moderate',
        },
      ];
    } else {
      trendPoints = [
        { label: 'Baseline', val: 2, dateStr: 'Start', level: 'Moderate' },
      ];
    }

    // 4. Identify latest date and top stressor
    const rawDate = historyList.length > 0 ? historyList[historyList.length - 1].date : null;
    const latestAssessmentDate = rawDate
      ? new Date(rawDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
      : latestPred
      ? 'Today'
      : 'Not taken yet';

    const topStressorFeature = latestPred?.top_stressors?.[0]?.feature || 'study_load';
    const topStressorFormatted = topStressorFeature.replace(/_/g, ' ');

    const advice = getStressorAdvice(topStressorFeature);

    setData({
      userName: 'Alex',
      latestAssessmentDate,
      stressLevel: latestPred?.stress_level || 'Moderate',
      stressLevelCode: typeof latestPred?.stress_level_code === 'number' ? latestPred.stress_level_code : 1,
      topStressor: topStressorFormatted,
      advice,
      trend: trendPoints,
    });
  }, []);

  if (!data) return null;

  // Dynamic card colors for Stress Level
  const stressCardStyles =
    data.stressLevelCode === 0
      ? { bg: 'bg-[#F0FDF4]', border: 'border-emerald-100', text: 'text-emerald-700', badge: 'bg-emerald-100/70 text-emerald-800' }
      : data.stressLevelCode === 2
      ? { bg: 'bg-[#FFF1F2]', border: 'border-rose-100', text: 'text-rose-700', badge: 'bg-rose-100/70 text-rose-800' }
      : { bg: 'bg-[#FFFBEB]', border: 'border-amber-100', text: 'text-amber-700', badge: 'bg-amber-100/70 text-amber-800' };

  return (
    <div className="p-8 md:p-10 max-w-6xl mx-auto font-sans">
      {/* Top Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-2">
            {greeting}, {data.userName}
          </h1>
          <p className="text-slate-500 text-base">
            Understand your current wellbeing and discover what may be affecting your stress.
          </p>
        </div>
        <div className="flex items-center text-emerald-700 font-semibold text-xs md:text-sm bg-emerald-50/80 px-3.5 py-1.5 rounded-full border border-emerald-200/60 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse" />
          Check-in ready
        </div>
      </div>

      {/* Elevated Pastel Mesh Hero Section with Cute Robot */}
      <div className="rounded-3xl p-8 md:p-10 mb-10 border border-indigo-100/80 shadow-xs relative overflow-hidden bg-gradient-to-br from-[#EEF2FF] via-[#FDF2F8] to-[#FFFBEB] flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Soft Ambient Blur Orbs */}
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-indigo-200/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-pink-200/30 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-xl">
          <span className="inline-block px-3 py-1 bg-white/80 backdrop-blur-sm rounded-full text-[11px] font-bold tracking-wider text-indigo-700 uppercase mb-4 border border-indigo-100/60 shadow-2xs">
            Personal Wellbeing Check-In
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3 tracking-tight">
            How are you feeling lately?
          </h2>
          <p className="text-slate-600 mb-6 text-sm md:text-base leading-relaxed">
            Complete a short, private assessment to understand your current stress level and what you can focus on next.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => router.push('/student/assessment')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-semibold transition-all duration-200 shadow-sm hover:shadow text-sm flex items-center gap-2"
            >
              Start assessment <Icons.ArrowRight />
            </button>
            <button
              onClick={() => router.push('/student/insights')}
              className="bg-white/80 hover:bg-white text-slate-700 border border-slate-200/80 px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 text-sm shadow-2xs"
            >
              View previous insights
            </button>
          </div>
        </div>

        {/* Cutesy Robot SVG */}
        <div className="relative z-10 flex justify-center items-center shrink-0 w-48 h-48">
          <Icons.CuteRobot />
        </div>
      </div>

      {/* Pastel Stat Cards Row (Reduced to 3 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="bg-[#F5F3FF] p-6 rounded-2xl border border-purple-100/80 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-start mb-3">
            <p className="text-sm font-semibold text-purple-900/70">Last assessment</p>
            <div className="w-10 h-10 rounded-xl bg-white/80 flex items-center justify-center shadow-2xs">
              <Icons.Calendar />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">{data.latestAssessmentDate}</p>
        </div>

        <div className={`${stressCardStyles.bg} p-6 rounded-2xl border ${stressCardStyles.border} shadow-xs flex flex-col justify-between`}>
          <div className="flex justify-between items-start mb-3">
            <p className="text-sm font-semibold text-slate-600">Current stress level</p>
            <div className="w-10 h-10 rounded-xl bg-white/80 flex items-center justify-center shadow-2xs">
              <Icons.Pulse />
            </div>
          </div>
          <p className={`text-2xl font-bold ${stressCardStyles.text} capitalize`}>
            {data.stressLevel}
          </p>
        </div>

        <div className="bg-[#FFF7ED] p-6 rounded-2xl border border-orange-100/80 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-start mb-3">
            <p className="text-sm font-semibold text-orange-900/70">Top stressor</p>
            <div className="w-10 h-10 rounded-xl bg-white/80 flex items-center justify-center shadow-2xs">
              <Icons.AlertTarget />
            </div>
          </div>
          <p 
            className="text-lg md:text-xl font-bold text-slate-900 capitalize leading-tight" 
            title={data.topStressor}
          >
            {data.topStressor}
          </p>
        </div>
      </div>

      {/* Grid: Realtime Trend Chart & Dynamic 2-Line Action Note */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 md:p-8 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-bold text-lg text-slate-900">My wellbeing trend</h3>
            </div>
            <button
              onClick={() => router.push('/student/history')}
              className="text-xs md:text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              View history <Icons.ArrowRight />
            </button>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.trend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis
                  dataKey="label"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#94A3B8' }}
                />
                <YAxis
                  domain={[0.5, 3.5]}
                  ticks={[1, 2, 3]}
                  tickFormatter={(val) => (val === 1 ? 'Low' : val === 2 ? 'Mod' : 'High')}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: '#94A3B8' }}
                />
                <Tooltip
                  formatter={(value: any, name: any, item: any) => [
                    item.payload.level,
                    'Stress Level',
                  ]}
                  labelFormatter={(label, items) => {
                    const date = items?.[0]?.payload?.dateStr;
                    return date ? `${label} (${date})` : label;
                  }}
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    border: '1px solid #E2E8F0',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    fontSize: '12px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="val"
                  stroke="#6366F1"
                  strokeWidth={3}
                  dot={{ fill: '#6366F1', stroke: '#FFFFFF', strokeWidth: 2, r: 5 }}
                  activeDot={{ r: 7, fill: '#4F46E5' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 md:p-8 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-bold text-lg text-slate-900">Focus for this week</h3>
              <p className="text-xs text-slate-400 mt-0.5">Based on your leading factor: <span className="font-medium text-slate-700 capitalize">{data.topStressor}</span></p>
            </div>
          </div>

          <div className="bg-[#FAF5FF] rounded-2xl p-6 border border-purple-100/80 flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-white shadow-2xs flex items-center justify-center shrink-0">
              <Icons.Sparkle />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-slate-900 text-base mb-2">
                {data.advice.title}
              </h4>
              <p className="text-slate-600 text-sm leading-relaxed mb-1.5">
                • {data.advice.line1}
              </p>
              <p className="text-slate-600 text-sm leading-relaxed">
                • {data.advice.line2}
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Adaptive recommendation</span>
            <button
              onClick={() => router.push('/student/recommendations')}
              className="text-indigo-600 font-semibold hover:underline"
            >
              Explore toolkit →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}