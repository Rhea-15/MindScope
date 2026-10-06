'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { StudentStressInput } from '@/types';
import { predictStress } from '@/lib/api';

const STEP_LABELS = [
  { id: 'academic', label: 'Academic', step: 1 },
  { id: 'environment', label: 'Environment', step: 2 },
  { id: 'psychological', label: 'Psychological & Social', step: 3 },
  { id: 'physiological', label: 'Physiological', step: 4 },
];

export default function AssessmentForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('academic');

  const [formData, setFormData] = useState<StudentStressInput>({
    academic_performance: 3, study_load: 3, teacher_student_relationship: 3, future_career_concerns: 3,
    basic_needs: 3, living_conditions: 3, safety: 3, noise_level: 3,
    anxiety_level: 10, self_esteem: 15, depression: 10, peer_pressure: 3, social_support: 3, bullying: 2,
    sleep_quality: 3, headache: 2, breathing_problem: 2, blood_pressure: 2, mental_health_history: 0, extracurricular_activities: 3,
  });

  const handleSliderChange = (key: keyof StudentStressInput, value: number) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const result = await predictStress(formData);
      localStorage.setItem('latestPrediction', JSON.stringify(result));
      localStorage.setItem('latestAssessment', JSON.stringify(formData));
      
      const history = JSON.parse(localStorage.getItem('assessmentHistory') || '[]');
      history.push({ date: new Date().toISOString(), ...result });
      localStorage.setItem('assessmentHistory', JSON.stringify(history));

      router.push('/student/insights');
    } catch (error) {
      console.error('Prediction error:', error);
      alert('Failed to process assessment');
    } finally {
      setLoading(false);
    }
  };

  const currentStepData = STEP_LABELS.find(s => s.id === activeTab);

  return (
    <div className="w-full max-w-3xl mx-auto font-sans">
      
      {/* Dynamic Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight">{currentStepData?.label} Wellbeing</h2>
      </div>

      {/* Custom Stepper/Tabs - Pastel Aesthetic */}
      <div className="flex border-b border-slate-100 mb-10 overflow-x-auto scrollbar-hide">
        {STEP_LABELS.map((step) => {
          const isActive = activeTab === step.id;
          return (
            <button
              key={step.id}
              onClick={() => setActiveTab(step.id)}
              className={`flex-1 min-w-[120px] pb-4 px-2 text-[13px] md:text-sm font-semibold transition-all flex items-center justify-center gap-2 border-b-2 ${
                isActive 
                  ? 'border-indigo-500 text-indigo-700' 
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              <span className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold shadow-xs ${
                isActive ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'
              }`}>
                {step.step}
              </span>
              <span className="hidden sm:inline">{step.label}</span>
            </button>
          );
        })}
      </div>

      {/* Conditionally Rendered Content */}
      <div className="min-h-[400px]">
        
        {/* 1. Academic Tab */}
        {activeTab === 'academic' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            {[
              { id: 'academic_performance', label: 'Academic Performance', desc: 'Self-reported GPA and academic standing', max: 5 },
              { id: 'study_load', label: 'Study Load', desc: 'Volume of daily assignments and exam prep', max: 5 },
              { id: 'teacher_student_relationship', label: 'Teacher-Student Relationship', desc: 'Quality of academic guidance and rapport', max: 5 },
              { id: 'future_career_concerns', label: 'Future Career Concerns', desc: 'Anxiety surrounding job placement/career', max: 5 },
            ].map((field) => (
              <div key={field.id} className="bg-[#F8FAFC] p-6 rounded-2xl border border-slate-100 transition-all hover:bg-[#F1F5F9]">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <label className="font-bold text-slate-800 tracking-tight">{field.label}</label>
                    <p className="text-xs text-slate-500 mt-0.5">{field.desc}</p>
                  </div>
                  <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 shadow-2xs">
                    {formData[field.id as keyof StudentStressInput]} / {field.max}
                  </span>
                </div>
                <input
                  type="range" min={0} max={field.max}
                  value={formData[field.id as keyof StudentStressInput]}
                  onChange={(e) => handleSliderChange(field.id as keyof StudentStressInput, parseInt(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none"
                />
              </div>
            ))}
          </div>
        )}

        {/* 2. Environment Tab */}
        {activeTab === 'environment' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
             {[
              { id: 'basic_needs', label: 'Basic Needs', desc: 'Access to food, shelter, and essential daily needs', max: 5 },
              { id: 'living_conditions', label: 'Living Conditions', desc: 'Quality and comfort of residential setup', max: 5 },
              { id: 'safety', label: 'Safety', desc: 'Perceived personal safety in living environment', max: 5 },
              { id: 'noise_level', label: 'Noise Level', desc: 'Environmental noise disruption during study/sleep', max: 5 },
            ].map((field) => (
              <div key={field.id} className="bg-[#F8FAFC] p-6 rounded-2xl border border-slate-100 transition-all hover:bg-[#F1F5F9]">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <label className="font-bold text-slate-800 tracking-tight">{field.label}</label>
                    <p className="text-xs text-slate-500 mt-0.5">{field.desc}</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 shadow-2xs">
                    {formData[field.id as keyof StudentStressInput]} / {field.max}
                  </span>
                </div>
                <input
                  type="range" min={0} max={field.max}
                  value={formData[field.id as keyof StudentStressInput]}
                  onChange={(e) => handleSliderChange(field.id as keyof StudentStressInput, parseInt(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none"
                />
              </div>
            ))}
            
            <div className="bg-[#F8FAFC] p-6 rounded-2xl border border-slate-100">
              <label className="font-bold text-slate-800 block mb-3 tracking-tight">Mental Health History</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 0, label: 'No prior history' },
                  { value: 1, label: 'Yes, I have a history' },
                ].map((mh) => (
                  <button
                    key={mh.value} type="button"
                    onClick={() => handleSliderChange('mental_health_history', mh.value)}
                    className={`py-3 rounded-xl font-semibold transition-all text-sm border shadow-2xs ${
                      formData.mental_health_history === mh.value
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-1 ring-emerald-200'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {mh.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 3. Psychological Tab */}
        {activeTab === 'psychological' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            {[
              { id: 'anxiety_level', label: 'Anxiety Level', desc: 'General anxiety symptom score', max: 21 },
              { id: 'self_esteem', label: 'Self-Esteem', desc: 'Self-worth and confidence rating', max: 30 },
              { id: 'depression', label: 'Depressive Symptoms', desc: 'General low mood or energy score', max: 27 },
              { id: 'peer_pressure', label: 'Peer Pressure', desc: 'Social and academic competition pressures', max: 5 },
              { id: 'social_support', label: 'Social Support', desc: 'Availability of family, friends, support network', max: 5 },
              { id: 'bullying', label: 'Harassment/Bullying', desc: 'Frequency of verbal or social harassment', max: 5 },
            ].map((field) => (
              <div key={field.id} className="bg-[#F8FAFC] p-6 rounded-2xl border border-slate-100 transition-all hover:bg-[#F1F5F9]">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <label className="font-bold text-slate-800 tracking-tight">{field.label}</label>
                    <p className="text-xs text-slate-500 mt-0.5">{field.desc}</p>
                  </div>
                  <span className="text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-100 shadow-2xs">
                    {formData[field.id as keyof StudentStressInput]} / {field.max}
                  </span>
                </div>
                <input
                  type="range" min={0} max={field.max}
                  value={formData[field.id as keyof StudentStressInput]}
                  onChange={(e) => handleSliderChange(field.id as keyof StudentStressInput, parseInt(e.target.value))}
                  className="w-full accent-purple-500 cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none"
                />
              </div>
            ))}
          </div>
        )}

        {/* 4. Physiological Tab */}
        {activeTab === 'physiological' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            {[
              { id: 'sleep_quality', label: 'Sleep Quality', desc: 'Restfulness and daily sleep duration', max: 5 },
              { id: 'headache', label: 'Headache Frequency', desc: 'Frequency of somatic headaches', max: 5 },
              { id: 'breathing_problem', label: 'Breathing Issues', desc: 'Physical anxiety symptoms (e.g. shortness of breath)', max: 5 },
              { id: 'extracurricular_activities', label: 'Extracurricular Activities', desc: 'Involvement in campus clubs, sports, events', max: 5 },
            ].map((field) => (
              <div key={field.id} className="bg-[#F8FAFC] p-6 rounded-2xl border border-slate-100 transition-all hover:bg-[#F1F5F9]">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <label className="font-bold text-slate-800 tracking-tight">{field.label}</label>
                    <p className="text-xs text-slate-500 mt-0.5">{field.desc}</p>
                  </div>
                  <span className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-100 shadow-2xs">
                    {formData[field.id as keyof StudentStressInput]} / {field.max}
                  </span>
                </div>
                <input
                  type="range" min={0} max={field.max}
                  value={formData[field.id as keyof StudentStressInput]}
                  onChange={(e) => handleSliderChange(field.id as keyof StudentStressInput, parseInt(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none"
                />
              </div>
            ))}
            
            <div className="bg-[#F8FAFC] p-6 rounded-2xl border border-slate-100">
              <label className="font-bold text-slate-800 block mb-3 tracking-tight">Blood Pressure Status</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 1, label: 'Low' },
                  { value: 2, label: 'Normal' },
                  { value: 3, label: 'High' },
                ].map((bp) => (
                  <button
                    key={bp.value} type="button"
                    onClick={() => handleSliderChange('blood_pressure', bp.value)}
                    className={`py-3 rounded-xl font-semibold transition-all text-sm border shadow-2xs ${
                      formData.blood_pressure === bp.value
                        ? 'bg-amber-50 text-amber-700 border-amber-200 ring-1 ring-amber-200'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {bp.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Navigation */}
      <div className="flex justify-between items-center mt-10 pt-6 border-t border-slate-200">
        <button
          className="px-6 py-2.5 text-slate-400 font-semibold hover:text-slate-600 rounded-xl transition text-sm disabled:opacity-0"
          disabled={activeTab === 'academic'}
          onClick={() => {
            const tabs = STEP_LABELS.map((s) => s.id);
            const currentIdx = tabs.indexOf(activeTab);
            if (currentIdx > 0) setActiveTab(tabs[currentIdx - 1]);
          }}
        >
          ← Back
        </button>

        {activeTab !== 'physiological' ? (
          <button
            className="px-8 py-2.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition text-sm shadow-sm"
            onClick={() => {
              const tabs = STEP_LABELS.map((s) => s.id);
              const currentIdx = tabs.indexOf(activeTab);
              if (currentIdx < tabs.length - 1) setActiveTab(tabs[currentIdx + 1]);
            }}
          >
            Continue →
          </button>
        ) : (
          <button 
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