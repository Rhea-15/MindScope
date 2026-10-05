'use client';

import { useState } from 'react';
import AssessmentForm from '@/components/forms/AssessmentForm';

export default function AssessmentPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <p className="text-sm text-blue-600 font-semibold mb-2">PRIVATE ASSESSMENT</p>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Your Wellbeing Check-in</h1>
          <p className="text-lg text-gray-600">
            Tell us about your current experience across academic, environmental, psychological, and physiological dimensions.
          </p>
        </div>

        {/* Form Component */}
        <AssessmentForm />

        {/* Disclaimer */}
        <div className="mt-10 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            <strong>Privacy:</strong> Your responses are used only to generate your personal wellbeing insights. This assessment is not a medical diagnosis and should not be used as a substitute for professional mental health evaluation.
          </p>
        </div>
      </div>
    </div>
  );
}