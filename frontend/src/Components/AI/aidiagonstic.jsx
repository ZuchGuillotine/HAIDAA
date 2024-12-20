import React, { useState } from 'react';
import { Mic, Upload, Send, AlertCircle, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const AIDiagnosticInterface = () => {
  const [inputMethod, setInputMethod] = useState('text');
  const [patientData, setPatientData] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [aiResponse, setAiResponse] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate AI response
    setAiResponse({
      diagnoses: [
        {
          condition: 'Hypertension',
          confidence: 0.89,
          evidence: ['Elevated blood pressure', 'Family history', 'Lifestyle factors'],
          suggestedTests: ['24-hour blood pressure monitoring', 'ECG']
        }
      ],
      recommendations: [
        'Regular blood pressure monitoring',
        'Dietary modifications',
        'Exercise program'
      ]
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Input Section */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Patient Information Input</h2>

          {/* Input Method Toggle */}
          <div className="flex space-x-4 mb-4">
            <button
              onClick={() => setInputMethod('text')}
              className={`px-4 py-2 rounded ${inputMethod === 'text' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'}`}
            >
              Text
            </button>
            <button
              onClick={() => setInputMethod('voice')}
              className={`px-4 py-2 rounded ${inputMethod === 'voice' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'}`}
            >
              Voice
            </button>
            <button
              onClick={() => setInputMethod('upload')}
              className={`px-4 py-2 rounded ${inputMethod === 'upload' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'}`}
            >
              Upload
            </button>
          </div>

          {/* Input Area */}
          <form onSubmit={handleSubmit}>
            {inputMethod === 'text' && (
              <textarea
                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows="6"
                placeholder="Enter patient symptoms, vitals, and observations..."
                value={patientData}
                onChange={(e) => setPatientData(e.target.value)}
              />
            )}

            {inputMethod === 'voice' && (
              <div className="text-center p-8 border-2 border-dashed rounded-md">
                <button
                  type="button"
                  onClick={() => setIsRecording(!isRecording)}
                  className={`p-4 rounded-full ${isRecording ? 'bg-red-100 text-red-600' : 'bg-gray-100'}`}
                >
                  <Mic className="h-8 w-8" />
                </button>
                <p className="mt-2 text-sm text-gray-600">
                  {isRecording ? 'Recording... Click to stop' : 'Click to start recording'}
                </p>
              </div>
            )}

            {inputMethod === 'upload' && (
              <div className="text-center p-8 border-2 border-dashed rounded-md">
                <Upload className="h-8 w-8 mx-auto text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">
                  Drag and drop files or click to upload
                </p>
                <input type="file" className="hidden" />
              </div>
            )}

            <button
              type="submit"
              className="mt-4 w-full flex justify-center items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <span>Analyze</span>
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>

        {/* AI Response Section */}
        {aiResponse && (
          <div className="mt-8 space-y-6">
            <h3 className="text-lg font-semibold">AI Diagnostic Analysis</h3>

            {/* Potential Diagnoses */}
            {aiResponse.diagnoses.map((diagnosis, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">{diagnosis.condition}</h4>
                  <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {Math.round(diagnosis.confidence * 100)}% confidence
                  </span>
                </div>

                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Supporting Evidence:</p>
                    <ul className="list-disc list-inside text-sm text-gray-600 ml-2">
                      {diagnosis.evidence.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-600">Suggested Tests:</p>
                    <ul className="list-disc list-inside text-sm text-gray-600 ml-2">
                      {diagnosis.suggestedTests.map((test, i) => (
                        <li key={i}>{test}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}

            {/* Recommendations */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Recommendations</h4>
              <ul className="space-y-2">
                {aiResponse.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Feedback Section */}
            <div className="flex items-center justify-center space-x-4 mt-6">
              <button className="flex items-center space-x-2 px-4 py-2 rounded-md hover:bg-gray-100">
                <ThumbsUp className="h-4 w-4" />
                <span>Helpful</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 rounded-md hover:bg-gray-100">
                <ThumbsDown className="h-4 w-4" />
                <span>Not Helpful</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIDiagnosticInterface;