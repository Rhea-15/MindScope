'use client';

import { useEffect, useState } from 'react';
import { PredictionResult } from '@/types';
import GaugeChart from '@/components/charts/GaugeChart';

const Icons = {
  Download: () => (
    <svg className="w-4 h-4 ml-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  ),
  Lightbulb: () => (
    <svg className="w-4 h-4 text-amber-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
      <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4z" />
    </svg>
  ),
  BarChart: () => (
    <svg className="w-6 h-6 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  Target: () => (
    <svg className="w-6 h-6 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  Clipboard: () => (
    <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
  ),
  Alert: () => (
    <svg className="w-6 h-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  )
};

export default function InsightsPage() {
  const [data, setData] = useState<PredictionResult | null>(null);
  const [showAllFactors, setShowAllFactors] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('latestPrediction');
    if (stored) setData(JSON.parse(stored));
  }, []);

  const handleSaveSummary = () => {
    if (!data) return;

    const printWindow = window.open('', '', 'width=800,height=900');
    if (!printWindow) {
      alert("Please allow pop-ups to generate your PDF report.");
      return;
    }

    const currentDate = new Date().toLocaleDateString('en-IN', {
      day: '2-digit', month: 'long', year: 'numeric'
    });

    const topStressorsHTML = data.top_stressors.map(str => {
      const featureName = str.feature.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      const percentage = Math.round((str.impact / totalImpact) * 100);
      return `
        <li style="margin-bottom: 12px; line-height: 1.5;">
          <strong>${featureName}</strong> (Influence: ${percentage}%)<br/>
          <span style="color: #64748b; font-size: 14px;">Identified by the model as a leading factor shaping your current wellbeing.</span>
        </li>
      `;
    }).join('');

    const interventionsHTML = data.interventions?.length 
      ? data.interventions.map(inv => `<li style="margin-bottom: 8px;">${inv}</li>`).join('')
      : `<li style="margin-bottom: 8px;">Review your upcoming deadlines and break them into smaller tasks.</li>
         <li style="margin-bottom: 8px;">Prioritize 7-8 hours of sleep to improve cognitive recovery.</li>`;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>MindScope Wellbeing Summary</title>
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; padding: 40px; color: #0f172a; max-width: 800px; margin: 0 auto; }
            .header { border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 30px; }
            .header h1 { color: #4f46e5; margin: 0 0 10px 0; font-size: 28px; }
            .header p { color: #64748b; margin: 0; font-size: 14px; }
            .card { background: #f8fafc; border: 1px solid #e2e8f0; padding: 24px; border-radius: 12px; margin-bottom: 30px; }
            .level-title { font-size: 13px; font-weight: bold; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px; }
            .level-value { font-size: 28px; font-weight: bold; text-transform: uppercase; color: ${theme.colorHex}; margin: 0 0 12px 0; }
            .desc { font-size: 15px; line-height: 1.6; color: #334155; margin: 0 0 16px 0; }
            .confidence { font-size: 13px; color: #475569; background: #e2e8f0; padding: 4px 10px; border-radius: 6px; display: inline-block; }
            h2 { color: #1e293b; font-size: 20px; margin-top: 30px; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px; }
            ul { padding-left: 24px; color: #334155; }
            .footer { margin-top: 50px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; text-align: center; }
            @media print {
              body { padding: 0; }
              @page { margin: 2cm; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>MindScope Wellbeing Summary</h1>
            <p>Assessment generated on ${currentDate}</p>
          </div>

          <div class="card">
            <div class="level-title">Current Predicted Stress Level</div>
            <div class="level-value">${data.stress_level}</div>
            <p class="desc">${getDynamicDescription()}</p>
          </div>

          <h2>Top Contributing Factors</h2>
          <ul>
            ${topStressorsHTML}
          </ul>

          <h2>Recommended Next Steps</h2>
          <ul>
            ${interventionsHTML}
          </ul>

          <div class="footer">
            Generated by MindScope AI Analytics<br/>
            <strong>Note:</strong> This report is a supportive estimate based on self-reported data and is not a clinical or medical diagnosis.
          </div>

          <script>
            window.onload = () => {
              // Trigger PDF print dialog automatically
              window.print();
              // Close window after printing/saving
              setTimeout(() => { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  if (!data) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f9fc]">
      <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
    </div>
  );

  const levelCode = typeof data.stress_level_code === 'number' ? data.stress_level_code : (data.stress_level === 'Low' ? 0 : data.stress_level === 'High' ? 2 : 1);
  
  const theme = {
    bg: levelCode === 0 ? 'bg-emerald-50' : levelCode === 2 ? 'bg-rose-50' : 'bg-amber-50',
    text: levelCode === 0 ? 'text-emerald-600' : levelCode === 2 ? 'text-rose-600' : 'text-amber-500',
    colorHex: levelCode === 0 ? '#10b981' : levelCode === 2 ? '#f43f5e' : '#f59e0b'
  };

  const getDynamicDescription = () => {
    if (levelCode === 0) {
      return "Your responses suggest a healthy balance in your current routine. Keep maintaining your supportive habits and stay mindful of your wellbeing.";
    } else if (levelCode === 2) {
      return "Your responses indicate a significant amount of pressure across multiple areas. We highly recommend exploring campus support services and prioritizing your immediate rest.";
    } else {
      return "Your responses suggest that a few areas may be placing extra pressure on your wellbeing right now. This is a useful moment to pause, understand the patterns, and choose one small action.";
    }
  };

  const totalImpact = data.top_stressors.reduce((sum, str) => sum + str.impact, 0) || 1;
  const displayFactors = showAllFactors ? data.top_stressors : data.top_stressors.slice(0, 4);

  return (
    <div className="p-8 md:p-10 max-w-5xl mx-auto font-sans bg-[#f8f9fc] min-h-screen">
      
      {/* Top Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2 tracking-tight">Your Stress Insights</h1>
          <p className="text-slate-500 text-sm md:text-base">Based on the information you provided. Here is what the model found.</p>
        </div>
      </div>

      {/* Hero Result Card */}
      <div className="rounded-[2rem] border border-indigo-100/80 shadow-xs p-8 md:p-12 mb-8 relative overflow-hidden bg-gradient-to-br from-[#EEF2FF] via-[#FDF2F8] to-[#FFFBEB] flex flex-col md:flex-row items-center gap-10">
        
        {/* Soft Ambient Blur Orbs */}
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-indigo-200/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-pink-200/30 rounded-full blur-3xl pointer-events-none" />

        <div className="flex-1 relative z-10">
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-6 ${theme.bg} ${theme.text} border border-white shadow-xs`}>
            {data.stress_level} stress
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight tracking-tight">
            Your current stress level is <span style={{ color: theme.colorHex }}>{data.stress_level.toLowerCase()}</span>
          </h2>
          <p className="text-slate-700 mb-8 text-base leading-relaxed max-w-lg">
            {getDynamicDescription()}
          </p>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 bg-white/60 backdrop-blur-sm w-fit px-3 py-2 rounded-lg border border-white/80 shadow-2xs">
            <Icons.Lightbulb />
            This result is not a diagnosis. It is a supportive estimate.
          </div>
        </div>
        
        {/* Gauge Chart Wrapper */}
        <div className="w-full md:w-[280px] shrink-0 relative z-10">
          <GaugeChart 
            stressLevel={levelCode} 
            confidence={data.confidence} 
            stressLabel={data.stress_level} 
            color={theme.colorHex} 
          />
        </div>
      </div>

      {/* Deep Analytics Chips Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-10">
        {[
          { 
            label: 'Model Confidence', 
            val: `${Math.round(data.confidence * 100)}%`, 
            sub: 'Prediction certainty',
            icon: <Icons.Target /> 
          },
          { 
            label: 'Leading Factor Category', 
            val: ['academic_performance', 'study_load', 'teacher_student_relationship', 'future_career_concerns'].includes(data.top_stressors[0]?.feature) ? 'Academic' : 
                 ['sleep_quality', 'headache', 'breathing_problem'].includes(data.top_stressors[0]?.feature) ? 'Physiological' : 'Psychological', 
            sub: 'Primary area of focus',
            icon: <Icons.Lightbulb /> 
          }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 lg:p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="w-11 h-11 rounded-xl bg-slate-50 flex items-center justify-center shadow-inner border border-slate-100 shrink-0">
                {stat.icon}
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider text-right w-2/3 leading-tight">{stat.label}</p>
            </div>
            <div>
              <p className="font-bold text-slate-900 text-2xl md:text-3xl tracking-tight leading-none mb-1.5 truncate">
                {stat.val}
              </p>
              <p className="text-sm text-slate-500 font-medium">
                {stat.sub}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* SHAP Analysis Section with Pastel Gradients */}
      <div className="grid md:grid-cols-2 gap-8 mb-10">
        {/* Card 1: Influences */}
        <div className="rounded-3xl border border-indigo-100/80 p-8 shadow-sm bg-gradient-to-br from-[#EEF2FF] via-[#FDF2F8] to-[#FFFBEB] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-60 h-60 bg-indigo-200/20 rounded-full blur-2xl pointer-events-none" />
          
          <div className="relative z-10">
            <h3 className="font-bold text-xl text-slate-900 mb-1">What is influencing your result?</h3>
            <p className="text-sm text-slate-500 mb-8">The key elements driving your wellbeing right now</p>
            
            <div className="space-y-6">
              {displayFactors.map((str, idx) => {
                const percentage = Math.round((str.impact / totalImpact) * 100);
                return (
                  <div key={idx} className="group">
                    <div className="flex justify-between text-sm font-semibold mb-2 capitalize text-slate-800">
                      <span>{str.feature.replace(/_/g, ' ')}</span>
                      <span className="text-slate-500 font-medium">{percentage}%</span>
                    </div>
                    <div className="w-full bg-white/70 backdrop-blur-xs rounded-full h-2.5 overflow-hidden border border-slate-200/50">
                      <div 
                        className="bg-indigo-600 h-full rounded-full transition-all duration-700 ease-out" 
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {data.top_stressors.length > 4 && (
              <button 
                onClick={() => setShowAllFactors(!showAllFactors)}
                className="text-indigo-600 text-sm font-bold mt-8 hover:text-indigo-700 transition"
              >
                {showAllFactors ? 'Show top factors ←' : 'View all factors →'}
              </button>
            )}
          </div>
        </div>

        {/* Card 2: Top Contributions */}
        <div className="rounded-3xl border border-purple-100/80 p-8 shadow-sm bg-gradient-to-br from-[#F5F3FF] via-[#FCE7F3] to-[#FEF3C7] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-60 h-60 bg-purple-200/20 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10">
            <h3 className="font-bold text-xl text-slate-900 mb-1">What is contributing most?</h3>
            <p className="text-sm text-slate-500 mb-8">Your top three factors</p>
            
            <div className="space-y-6">
              {data.top_stressors.slice(0, 3).map((str, idx) => {
                const percentage = Math.round((str.impact / totalImpact) * 100);
                return (
                  <div key={idx} className="flex items-center gap-4 bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-white/60 shadow-2xs">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-sm shrink-0 border border-indigo-100">
                      {idx + 1}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <h4 className="font-bold text-slate-900 capitalize truncate" title={str.feature.replace(/_/g, ' ')}>
                        {str.feature.replace(/_/g, ' ')}
                      </h4>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}