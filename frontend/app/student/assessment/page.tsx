'use client';

import AssessmentForm from '@/components/forms/AssessmentForm';

export default function AssessmentPage() {
  return (
    <div className="p-8 md:p-10 max-w-5xl mx-auto font-sans bg-[#f8f9fc] min-h-screen">
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3 tracking-tight">How are you feeling lately?</h1>
        <p className="text-slate-600 text-sm md:text-base">
          Answer a few quick questions to understand your current wellbeing
        </p>
      </div>
      
      <div className="bg-white rounded-[2rem] border border-slate-200/80 shadow-sm p-8">
        <AssessmentForm />
      </div>
    </div>
  );
}