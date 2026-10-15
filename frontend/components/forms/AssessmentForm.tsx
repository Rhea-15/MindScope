'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { StudentStressInput } from '@/types';
import { predictStress } from '@/lib/api';
import {
  ASSESSMENT_FIELDS,
  ASSESSMENT_STEPS,
  DEFAULT_ANSWERS,
  AssessmentKey,
  Tone,
} from '@/lib/assessmentOptions';

const TONE_STYLES: Record<Tone, string> = {
  good: 'bg-emerald-50 text-emerald-700 border-emerald-300 ring-1 ring-emerald-200',
  mid: 'bg-amber-50 text-amber-700 border-amber-300 ring-1 ring-amber-200',
  bad: 'bg-rose-50 text-rose-700 border-rose-300 ring-1 ring-rose-200',
};

export default function AssessmentForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const [formData, setFormData] = useState<StudentStressInput>(DEFAULT_ANSWERS);

  const setChoice = (key: AssessmentKey, value: number) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const result = await predictStress(formData);
      localStorage.setItem('latestPrediction', JSON.stringify(result));
      localStorage.setItem('latestAssessment', JSON.stringify(formData));
      router.push('/student/insights');
    } catch (error) {
      console.error('Prediction error:', error);
      alert('Failed to process assessment');
    } finally {
      setLoading(false);
    }
  };

  const currentStep = ASSESSMENT_STEPS[activeIdx];
  const isLast = activeIdx === ASSESSMENT_STEPS.length - 1;

  return (
    <div className="w-full max-w-3xl mx-auto font-sans">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight">{currentStep.label} Wellbeing</h2>
      </div>

      <div className="flex border-b border-slate-100 mb-10 overflow-x-auto scrollbar-hide">
        {ASSESSMENT_STEPS.map((step, idx) => {
          const isActive = idx === activeIdx;
          return (
            <button
              key={step.id}
              type="button"
              onClick={() => setActiveIdx(idx)}
              className={`flex-1 min-w-[120px] pb-4 px-2 text-[13px] md:text-sm font-semibold transition-all flex items-center justify-center gap-2 border-b-2 ${
                isActive ? 'border-indigo-500 text-indigo-700' : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              <span className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold shadow-xs ${
                isActive ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'
              }`}>
                {idx + 1}
              </span>
              <span className="hidden sm:inline">{step.label}</span>
            </button>
          );
        })}
      </div>

      <div className="min-h-[400px] space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
        {currentStep.keys.map((key) => {
          const field = ASSESSMENT_FIELDS[key];
          return (
            <div key={key} className="bg-[#F8FAFC] p-6 rounded-2xl border border-slate-100">
              <div className="mb-4">
                <label className="font-bold text-slate-800 tracking-tight">{field.label}</label>
                <p className="text-xs text-slate-500 mt-0.5">{field.desc}</p>
              </div>
              <div className="flex gap-3">
                {field.options.map((opt) => {
                  const active = formData[key] === opt.value;
                  return (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() => setChoice(key, opt.value)}
                      className={`flex-1 py-3 rounded-xl font-semibold transition-all text-sm border shadow-2xs ${
                        active ? TONE_STYLES[opt.tone] : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-between items-center mt-10 pt-6 border-t border-slate-200">
        <button
          type="button"
          className="px-6 py-2.5 text-slate-400 font-semibold hover:text-slate-600 rounded-xl transition text-sm disabled:opacity-0"
          disabled={activeIdx === 0}
          onClick={() => setActiveIdx((i) => Math.max(0, i - 1))}
        >
          ← Back
        </button>

        {!isLast ? (
          <button
            type="button"
            className="px-8 py-2.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition text-sm shadow-sm"
            onClick={() => setActiveIdx((i) => Math.min(ASSESSMENT_STEPS.length - 1, i + 1))}
          >
            Continue →
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="px-8 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition shadow-sm text-sm"
          >
            {loading ? 'Analyzing...' : 'Generate Insights'}
          </button>
        )}
      </div>

      <p className="text-xs font-medium text-slate-400 mt-8 text-center flex items-center justify-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 block"></span>
        This assessment supports wellbeing reflection and is not a medical diagnosis.
      </p>
    </div>
  );
}
