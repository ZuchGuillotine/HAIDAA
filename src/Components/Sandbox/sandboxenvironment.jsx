import React, { useState } from 'react';
import { BookOpen, RefreshCw, CheckCircle, AlertCircle, ChevronRight, FileText, User } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const mockScenarios = [
  {
    id: 1,
    title: 'Cardiac Assessment',
    difficulty: 'Intermediate',
    symptoms: ['Chest pain', 'Shortness of breath', 'Fatigue'],
    patientProfile: {
      age: 55,
      gender: 'Male',
      history: 'Hypertension, Smoking'
    }
  },
  {
    id: 2,
    title: 'Respiratory Diagnosis',
    difficulty: 'Advanced',
    symptoms: ['Persistent cough', 'Wheezing', 'Night sweats'],
    patientProfile: {
      age: 42,
      gender: 'Female',
      history: 'Asthma, Allergies'
    }
  },
  {
    id: 3,
    title: 'Diabetes Screening',
    difficulty: 'Beginner',
    symptoms: ['Increased thirst', 'Frequent urination', 'Unexplained weight loss'],
    patientProfile: {
      age: 48,
      gender: 'Female',
      history: 'Family history of diabetes'
    }
  }
];

const SandboxEnvironment = () => {
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [userDiagnosis, setUserDiagnosis] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [learningPoints, setLearningPoints] = useState([]);

  const handleScenarioSelect = (scenario) => {
    setSelectedScenario(scenario);
    setUserDiagnosis('');
    setShowFeedback(false);
    setLearningPoints([]);
  };

  const handleSubmitDiagnosis = () => {
    // In a real implementation, this would compare against correct diagnoses
    setShowFeedback(true);
    setLearningPoints([
      'Consider ordering additional tests for confirmation',
      'Review patient history for risk factors',
      'Evaluate differential diagnoses carefully'
    ]);
  };

  const handleReset = () => {
    setSelectedScenario(null);
    setUserDiagnosis('');
    setShowFeedback(false);
    setLearningPoints([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <BookOpen className="h-6 w-6 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Training Sandbox</h1>
            </div>
            {selectedScenario && (
              <button
                onClick={handleReset}
                className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900"
              >
                <RefreshCw className="h-4 w-4" />
                <span>New Scenario</span>
              </button>
            )}
          </div>
          <p className="mt-2 text-gray-600">
            Practice your diagnostic skills with simulated patient cases. All data is synthetic and for training purposes only.
          </p>
        </div>

        {!selectedScenario ? (
          // Scenario Selection
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockScenarios.map((scenario) => (
              <div
                key={scenario.id}
                className="bg-white rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleScenarioSelect(scenario)}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{scenario.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    scenario.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                    scenario.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {scenario.difficulty}
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <User className="h-4 w-4 text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600">
                        {scenario.patientProfile.age} y/o {scenario.patientProfile.gender}
                      </p>
                      <p className="text-sm text-gray-500">{scenario.patientProfile.history}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <FileText className="h-4 w-4 text-gray-400 mt-1" />
                    <div className="text-sm text-gray-600">
                      {scenario.symptoms.join(', ')}
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Active Scenario
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Patient Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Patient Information</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Demographics</p>
                  <p className="mt-1">
                    {selectedScenario.patientProfile.age} years old, {selectedScenario.patientProfile.gender}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Medical History</p>
                  <p className="mt-1">{selectedScenario.patientProfile.history}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Presenting Symptoms</p>
                  <ul className="mt-1 list-disc list-inside">
                    {selectedScenario.symptoms.map((symptom, index) => (
                      <li key={index} className="text-gray-700">{symptom}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Diagnostic Input */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Your Assessment</h2>
              <div className="space-y-4">
                <textarea
                  className="w-full h-40 p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your diagnostic assessment, including potential diagnoses and recommended tests..."
                  value={userDiagnosis}
                  onChange={(e) => setUserDiagnosis(e.target.value)}
                />
                <button
                  onClick={handleSubmitDiagnosis}
                  className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Submit Assessment
                </button>
              </div>
            </div>

            {/* Feedback Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">AI Feedback</h2>
              {showFeedback ? (
                <div className="space-y-4">
                  <Alert className="bg-blue-50 border-blue-200">
                    <AlertDescription>
                      Assessment submitted successfully. Review the learning points below.
                    </AlertDescription>
                  </Alert>
                  <div className="mt-4">
                    <p className="font-medium text-gray-700 mb-2">Key Learning Points:</p>
                    <ul className="space-y-2">
                      {learningPoints.map((point, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                          <span className="text-gray-600">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-40 text-gray-500">
                  Submit your assessment to receive AI feedback
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SandboxEnvironment;