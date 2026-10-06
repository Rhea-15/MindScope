'use client';

import React, { useState } from 'react';

// Modern SVG Icons
const Icons = {
  Play: () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
    </svg>
  ),
  Book: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  Moon: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
  ),
  Breeze: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Focus: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  ArrowRight: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
  ),
  Close: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  Check: () => (
    <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
  )
};

interface RecommendationItem {
  id: number;
  title: string;
  category: string;
  duration: string;
  type: string;
  desc: string;
  bgColor: string;
  textColor: string;
  icon: React.ReactNode;
  steps: string[];
  takeaway: string;
}

const CATEGORIES = ['All', 'Sleep', 'Anxiety', 'Focus', 'Social'];

const RECOMMENDATIONS: RecommendationItem[] = [
  {
    id: 1,
    title: "Deep Sleep Wind-down",
    category: "Sleep",
    duration: "10 min",
    type: "Audio",
    desc: "A guided visualization to help you disconnect from academic stress before bed.",
    bgColor: "bg-[#F4F1FD]",
    textColor: "text-[#6355A4]",
    icon: <Icons.Moon />,
    takeaway: "Shifts your autonomic nervous system from sympathetic (fight/flight) to parasympathetic (rest/digest).",
    steps: [
      "Dim all direct room lights and power off phone notifications.",
      "Lie flat on your back, placing one hand on your chest and one on your abdomen.",
      "Close your eyes and visualize releasing tension progressively from your shoulders down to your feet.",
      "Maintain slow, diaphragmatic breaths for 5 to 10 minutes without checking the clock."
    ]
  },
  {
    id: 2,
    title: "Box Breathing Technique",
    category: "Anxiety",
    duration: "4 min",
    type: "Exercise",
    desc: "Quick 4-4-4-4 breathing rhythm to instantly lower your heart rate during exams.",
    bgColor: "bg-[#EEFAF3]",
    textColor: "text-[#2B825B]",
    icon: <Icons.Breeze />,
    takeaway: "Clinically proven to reduce acute stress responses and lower cortisol levels.",
    steps: [
      "Exhale all air completely from your lungs.",
      "Inhale slowly through your nose for a count of 4 seconds.",
      "Hold your breath gently for a count of 4 seconds.",
      "Exhale smoothly through your mouth for 4 seconds.",
      "Hold empty for 4 seconds, then repeat for 4 cycles."
    ]
  },
  {
    id: 3,
    title: "The Pomodoro Shift",
    category: "Focus",
    duration: "Read",
    type: "Article",
    desc: "Learn how breaking study loads into 25-minute sprints prevents cognitive burnout.",
    bgColor: "bg-[#FFF9EA]",
    textColor: "text-[#9E6D13]",
    icon: <Icons.Focus />,
    takeaway: "Preserves prefrontal cortex endurance and prevents procrastination loops.",
    steps: [
      "Select one specific task (e.g., solve 5 numerical problems or draft one section).",
      "Set an uninterrupted timer for 25 minutes; put your phone out of sight.",
      "Work exclusively on that task until the timer chimes.",
      "Take a mandatory 5-minute break away from screens before starting sprint two."
    ]
  },
  {
    id: 4,
    title: "Challenging Imposter Syndrome",
    category: "Anxiety",
    duration: "7 min",
    type: "Audio",
    desc: "Reframe negative self-talk and academic doubts with cognitive behavioral tools.",
    bgColor: "bg-[#EEF5FF]",
    textColor: "text-[#2A66B8]",
    icon: <Icons.Breeze />,
    takeaway: "Separates factual competency from temporary emotional insecurity.",
    steps: [
      "Identify the automatic thought: 'Everyone else understands this except me.'",
      "Look for concrete counter-evidence: list 3 assignments or concepts you conquered previously.",
      "Recognize that feeling uncertain is an intrinsic part of learning challenging material.",
      "Speak to yourself with the same constructive tone you would use with a peer."
    ]
  },
  {
    id: 5,
    title: "Building Campus Connections",
    category: "Social",
    duration: "Read",
    type: "Guide",
    desc: "Small, actionable steps to find study groups and expand your support network.",
    bgColor: "bg-[#FFF2F4]",
    textColor: "text-[#B33951]",
    icon: <Icons.Book />,
    takeaway: "High social connectedness directly moderates the severity of academic burnout.",
    steps: [
      "Reach out to one classmate before or after lecture to compare notes on a difficult topic.",
      "Propose a structured 1-hour co-working session at the campus library or quiet study area.",
      "Participate regularly in at least one student branch or extracurricular circle.",
      "Remember that most peers are seeking collaborative partners but hesitate to initiate."
    ]
  },
  {
    id: 6,
    title: "Digital Sunset Routine",
    category: "Sleep",
    duration: "Practice",
    type: "Routine",
    desc: "Step-by-step guide to disconnecting from screens to improve REM sleep recovery.",
    bgColor: "bg-[#F4F1FD]",
    textColor: "text-[#6355A4]",
    icon: <Icons.Moon />,
    takeaway: "Restores natural melatonin production inhibited by blue-spectrum display light.",
    steps: [
      "Set an alarm 45 minutes prior to your target bedtime labeled 'Screen Shutdown'.",
      "Plug charging cables across the room, out of arm's reach from your mattress.",
      "Replace late-night phone browsing with light reading, journaling, or stretching.",
      "Keep bedroom ambient temperatures slightly cool to facilitate sleep onset."
    ]
  }
];

export default function RecommendationsPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedItem, setSelectedItem] = useState<RecommendationItem | null>(null);

  const filteredRecs = activeCategory === 'All' 
    ? RECOMMENDATIONS 
    : RECOMMENDATIONS.filter(r => r.category === activeCategory);

  const featuredItem = RECOMMENDATIONS[2]; // Focus / Study load item

  return (
    <div className="min-h-screen bg-[#F8F9FC] p-6 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2 tracking-tight">What do you need today?</h1>
          <p className="text-slate-500 text-base md:text-lg">Explore your personalized toolkit for mental and academic wellbeing.</p>
        </div>

        {/* Hero Pastel Gradient Banner */}
        <div className="rounded-3xl p-8 md:p-10 mb-10 border border-purple-100/70 shadow-sm relative overflow-hidden bg-gradient-to-r from-[#EDE9FE] via-[#FCE7F3] to-[#FEF3C7]">
          {/* Subtle Ambient Blur Accents */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/40 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4 pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-60 h-60 bg-pink-200/30 rounded-full blur-2xl translate-y-1/3 pointer-events-none" />

          <div className="relative z-10 max-w-xl">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3 tracking-tight">Managing Study Overload</h2>
            <p className="text-slate-700 mb-6 text-sm md:text-base leading-relaxed">
              Your recent assessment showed elevated study load stress. Take few minutes to reset your focus and organize your priorities.
            </p>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex overflow-x-auto pb-4 mb-6 scrollbar-hide gap-2.5">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-xs md:text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                activeCategory === cat 
                  ? 'bg-slate-900 text-white shadow-sm' 
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Recommendations Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecs.map((rec) => (
            <div 
              key={rec.id}
              onClick={() => setSelectedItem(rec)}
              className={`${rec.bgColor} rounded-3xl p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-md cursor-pointer flex flex-col justify-between border border-white/60 shadow-xs group`}
            >
              <div>
                <div className="flex justify-between items-start mb-5">
                  <div className={`w-11 h-11 rounded-2xl bg-white/80 flex items-center justify-center ${rec.textColor} shadow-xs backdrop-blur-xs`}>
                    {rec.icon}
                  </div>
                  <span className="bg-white/80 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-semibold text-slate-700 shadow-2xs">
                    {rec.category}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 mb-2 leading-snug">{rec.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  {rec.desc}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-900/5">
                <span className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                  {rec.type === 'Audio' ? <Icons.Play /> : <Icons.Book />}
                  {rec.duration}
                </span>
                
                {/* Arrow Button that triggers modal */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedItem(rec);
                  }}
                  aria-label={`Open details for ${rec.title}`}
                  className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-xs text-slate-700 group-hover:bg-slate-900 group-hover:text-white transition-all duration-200"
                >
                  <Icons.ArrowRight />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Modal Popup with Steps & Interactive Content */}
      {selectedItem && (
        <div 
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setSelectedItem(null)}
        >
          <div 
            className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl ${selectedItem.bgColor} ${selectedItem.textColor} flex items-center justify-center`}>
                  {selectedItem.icon}
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {selectedItem.category} • {selectedItem.duration}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900">{selectedItem.title}</h3>
                </div>
              </div>
              <button 
                onClick={() => setSelectedItem(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition"
              >
                <Icons.Close />
              </button>
            </div>

            {/* Description & Impact */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 mb-6">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Why this helps</p>
              <p className="text-sm text-slate-700 leading-relaxed">{selectedItem.takeaway}</p>
            </div>

            {/* Step-by-Step Instructions */}
            <div className="mb-6">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Action Steps</p>
              <div className="space-y-3">
                {selectedItem.steps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-sm text-slate-700">
                    <div className="mt-0.5 w-5 h-5 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                      <Icons.Check />
                    </div>
                    <span className="leading-snug">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button 
                onClick={() => setSelectedItem(null)}
                className="flex-1 bg-slate-900 text-white font-semibold py-2.5 rounded-xl hover:bg-slate-800 transition text-sm shadow-xs"
              >
                Complete Routine
              </button>
              <button 
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2.5 border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 transition text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}