'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { StudentStressInput } from '@/types';
import { predictStress } from '@/lib/api';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
    academic_performance: 3,
    study_load: 3,
    teacher_student_relationship: 3,
    future_career_concerns: 3,
    basic_needs: 3,
    living_conditions: 3,
    safety: 3,
    noise_level: 3,
    anxiety_level: 10,
    self_esteem: 15,
    depression: 10,
    peer_pressure: 3,
    social_support: 3,
    bullying: 2,
    sleep_quality: 3,
    headache: 2,
    breathing_problem: 2,
    blood_pressure: 2,
    mental_health_history: 0,
    extracurricular_activities: 3,
  });

  const handleSliderChange = (key: keyof StudentStressInput, value: number[]) => {
    setFormData((prev) => ({ ...prev, [key]: value[0] }));
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

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Academic Wellbeing</h1>
        <p className="text-gray-600">Tell us about your current academic experience.</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          {STEP_LABELS.map((step) => (
            <TabsTrigger key={step.id} value={step.id} onClick={() => setActiveTab(step.id)} className={activeTab === step.id ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700'}>
              <span className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white text-xs">
                  {step.step}
                </span>
                <span className="hidden sm:inline">{step.label}</span>
              </span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="academic" className="space-y-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="font-semibold mb-6">Academic Wellbeing</h2>

            <div className="mb-8">
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium">Academic Performance</label>
                <span className="text-sm text-blue-600">{formData.academic_performance} / 5</span>
              </div>
              <p className="text-xs text-gray-600 mb-4">Self-reported GPA and academic standing</p>
              <Slider
                value={[formData.academic_performance]}
                onValueChange={(val) => handleSliderChange('academic_performance', val)}
                min={0}
                max={5}
                step={1}
                className="w-full"
              />
            </div>

            <div className="mb-8">
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium">Study Load</label>
                <span className="text-sm text-blue-600">{formData.study_load} / 5</span>
              </div>
              <p className="text-xs text-gray-600 mb-4">Volume of daily assignments and exam prep</p>
              <Slider
                value={[formData.study_load]}
                onValueChange={(val) => handleSliderChange('study_load', val)}
                min={0}
                max={5}
                step={1}
                className="w-full"
              />
            </div>

            <div className="mb-8">
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium">Teacher-Student Relationship</label>
                <span className="text-sm text-blue-600">{formData.teacher_student_relationship} / 5</span>
              </div>
              <p className="text-xs text-gray-600 mb-4">Quality of academic guidance and rapport</p>
              <Slider
                value={[formData.teacher_student_relationship]}
                onValueChange={(val) => handleSliderChange('teacher_student_relationship', val)}
                min={0}
                max={5}
                step={1}
                className="w-full"
              />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium">Future Career Concerns</label>
                <span className="text-sm text-blue-600">{formData.future_career_concerns} / 5</span>
              </div>
              <p className="text-xs text-gray-600 mb-4">Anxiety surrounding job placement/career</p>
              <Slider
                value={[formData.future_career_concerns]}
                onValueChange={(val) => handleSliderChange('future_career_concerns', val)}
                min={0}
                max={5}
                step={1}
                className="w-full"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="environment" className="space-y-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="font-semibold mb-6">Environmental & Socioeconomic</h2>

            <div className="mb-8">
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium">Basic Needs</label>
                <span className="text-sm text-blue-600">{formData.basic_needs} / 5</span>
              </div>
              <p className="text-xs text-gray-600 mb-4">Access to food, shelter, and essential daily needs</p>
              <Slider
                value={[formData.basic_needs]}
                onValueChange={(val) => handleSliderChange('basic_needs', val)}
                min={0}
                max={5}
                step={1}
                className="w-full"
              />
            </div>

            <div className="mb-8">
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium">Living Conditions</label>
                <span className="text-sm text-blue-600">{formData.living_conditions} / 5</span>
              </div>
              <p className="text-xs text-gray-600 mb-4">Quality and comfort of residential setup</p>
              <Slider
                value={[formData.living_conditions]}
                onValueChange={(val) => handleSliderChange('living_conditions', val)}
                min={0}
                max={5}
                step={1}
                className="w-full"
              />
            </div>

            <div className="mb-8">
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium">Safety</label>
                <span className="text-sm text-blue-600">{formData.safety} / 5</span>
              </div>
              <p className="text-xs text-gray-600 mb-4">Perceived personal safety in living environment</p>
              <Slider
                value={[formData.safety]}
                onValueChange={(val) => handleSliderChange('safety', val)}
                min={0}
                max={5}
                step={1}
                className="w-full"
              />
            </div>

            <div className="mb-8">
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium">Noise Level</label>
                <span className="text-sm text-blue-600">{formData.noise_level} / 5</span>
              </div>
              <p className="text-xs text-gray-600 mb-4">Environmental noise disruption during study/sleep</p>
              <Slider
                value={[formData.noise_level]}
                onValueChange={(val) => handleSliderChange('noise_level', val)}
                min={0}
                max={5}
                step={1}
                className="w-full"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-4 block">Mental Health History</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 0, label: 'No' },
                  { value: 1, label: 'Yes' },
                ].map((mh) => (
                  <button
                    key={mh.value}
                    type="button"
                    onClick={() => handleSliderChange('mental_health_history', [mh.value])}
                    className={`p-3 rounded border font-medium transition ${
                      formData.mental_health_history === mh.value
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300'
                    }`}
                  >
                    {mh.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="psychological" className="space-y-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="font-semibold mb-6">Psychological & Social</h2>

            <div className="mb-8">
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium">Anxiety Level</label>
                <span className="text-sm text-blue-600">{formData.anxiety_level} / 21</span>
              </div>
              <p className="text-xs text-gray-600 mb-4">GAD-7 score (anxiety disorder scale)</p>
              <Slider
                value={[formData.anxiety_level]}
                onValueChange={(val) => handleSliderChange('anxiety_level', val)}
                min={0}
                max={21}
                step={1}
                className="w-full"
              />
            </div>

            <div className="mb-8">
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium">Self-Esteem</label>
                <span className="text-sm text-blue-600">{formData.self_esteem} / 30</span>
              </div>
              <p className="text-xs text-gray-600 mb-4">Self-worth rating scale</p>
              <Slider
                value={[formData.self_esteem]}
                onValueChange={(val) => handleSliderChange('self_esteem', val)}
                min={0}
                max={30}
                step={1}
                className="w-full"
              />
            </div>

            <div className="mb-8">
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium">Depression</label>
                <span className="text-sm text-blue-600">{formData.depression} / 27</span>
              </div>
              <p className="text-xs text-gray-600 mb-4">PHQ-9 depression symptom score</p>
              <Slider
                value={[formData.depression]}
                onValueChange={(val) => handleSliderChange('depression', val)}
                min={0}
                max={27}
                step={1}
                className="w-full"
              />
            </div>

            <div className="mb-8">
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium">Peer Pressure</label>
                <span className="text-sm text-blue-600">{formData.peer_pressure} / 5</span>
              </div>
              <p className="text-xs text-gray-600 mb-4">Social and academic competition pressures</p>
              <Slider
                value={[formData.peer_pressure]}
                onValueChange={(val) => handleSliderChange('peer_pressure', val)}
                min={0}
                max={5}
                step={1}
                className="w-full"
              />
            </div>

            <div className="mb-8">
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium">Social Support</label>
                <span className="text-sm text-blue-600">{formData.social_support} / 5</span>
              </div>
              <p className="text-xs text-gray-600 mb-4">Availability of family, friends, support network</p>
              <Slider
                value={[formData.social_support]}
                onValueChange={(val) => handleSliderChange('social_support', val)}
                min={0}
                max={5}
                step={1}
                className="w-full"
              />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium">Bullying</label>
                <span className="text-sm text-blue-600">{formData.bullying} / 5</span>
              </div>
              <p className="text-xs text-gray-600 mb-4">Frequency of verbal or social harassment</p>
              <Slider
                value={[formData.bullying]}
                onValueChange={(val) => handleSliderChange('bullying', val)}
                min={0}
                max={5}
                step={1}
                className="w-full"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="physiological" className="space-y-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="font-semibold mb-6">Physiological</h2>

            <div className="mb-8">
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium">Sleep Quality</label>
                <span className="text-sm text-blue-600">{formData.sleep_quality} / 5</span>
              </div>
              <p className="text-xs text-gray-600 mb-4">Restfulness and daily sleep duration</p>
              <Slider
                value={[formData.sleep_quality]}
                onValueChange={(val) => handleSliderChange('sleep_quality', val)}
                min={0}
                max={5}
                step={1}
                className="w-full"
              />
            </div>

            <div className="mb-8">
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium">Headache Frequency</label>
                <span className="text-sm text-blue-600">{formData.headache} / 5</span>
              </div>
              <p className="text-xs text-gray-600 mb-4">Frequency of somatic headaches</p>
              <Slider
                value={[formData.headache]}
                onValueChange={(val) => handleSliderChange('headache', val)}
                min={0}
                max={5}
                step={1}
                className="w-full"
              />
            </div>

            <div className="mb-8">
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium">Breathing Problems</label>
                <span className="text-sm text-blue-600">{formData.breathing_problem} / 5</span>
              </div>
              <p className="text-xs text-gray-600 mb-4">Physical anxiety symptoms (shortness of breath)</p>
              <Slider
                value={[formData.breathing_problem]}
                onValueChange={(val) => handleSliderChange('breathing_problem', val)}
                min={0}
                max={5}
                step={1}
                className="w-full"
              />
            </div>

            <div className="mb-8">
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium">Extracurricular Activities</label>
                <span className="text-sm text-blue-600">{formData.extracurricular_activities} / 5</span>
              </div>
              <p className="text-xs text-gray-600 mb-4">Involvement in campus clubs, sports, events</p>
              <Slider
                value={[formData.extracurricular_activities]}
                onValueChange={(val) => handleSliderChange('extracurricular_activities', val)}
                min={0}
                max={5}
                step={1}
                className="w-full"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-4 block">Blood Pressure Status</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 1, label: 'Low' },
                  { value: 2, label: 'Normal' },
                  { value: 3, label: 'High' },
                ].map((bp) => (
                  <button
                    key={bp.value}
                    type="button"
                    onClick={() => handleSliderChange('blood_pressure', [bp.value])}
                    className={`p-3 rounded border font-medium transition ${
                      formData.blood_pressure === bp.value
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300'
                    }`}
                  >
                    {bp.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-between mt-8">
        <Button
          variant="outline"
          onClick={() => {
            const tabs = STEP_LABELS.map((s) => s.id);
            const currentIdx = tabs.indexOf(activeTab);
            if (currentIdx > 0) setActiveTab(tabs[currentIdx - 1]);
          }}
        >
          ← Back
        </Button>

        <div className="flex gap-3">
          {activeTab !== 'physiological' && (
            <Button
              onClick={() => {
                const tabs = STEP_LABELS.map((s) => s.id);
                const currentIdx = tabs.indexOf(activeTab);
                if (currentIdx < tabs.length - 1) setActiveTab(tabs[currentIdx + 1]);
              }}
            >
              Next →
            </Button>
          )}

          {activeTab === 'physiological' && (
            <Button onClick={handleSubmit} disabled={loading} className="bg-blue-600">
              {loading ? 'Processing...' : 'Get Insights'}
            </Button>
          )}
        </div>
      </div>

      <p className="text-xs text-gray-500 mt-6 text-center">
        This assessment supports wellbeing reflection and is not a medical diagnosis.
      </p>
    </div>
  );
}
