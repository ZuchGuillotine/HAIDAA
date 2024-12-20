      // src/components/doctor/PatientDetails.jsx
      import React, { useState, useEffect } from 'react';
      import { 
        User, 
        Heart, 
        Activity, 
        AlertCircle, 
        Edit2, 
        Save,
        Mic, 
        MicOff,
        Plus,
        Clock,
        FileText,
        Pill,
        AlertTriangle
      } from 'lucide-react';

      const PatientDetails = ({ patientId }) => {
        const [isEditing, setIsEditing] = useState(false);
        const [isRecording, setIsRecording] = useState(false);
        const [activeSection, setActiveSection] = useState('overview');
        const [patientData, setPatientData] = useState({
          personalInfo: {
            name: 'John Smith',
            age: 45,
            gender: 'Male',
            dob: '1979-05-15',
            contact: '(555) 123-4567',
            email: 'john.smith@email.com',
            address: '123 Main St, Anytown, USA'
          },
          vitals: {
            bloodPressure: '120/80',
            heartRate: '72',
            temperature: '98.6',
            weight: '180',
            height: "5'10\"",
            bmi: '25.8'
          },
          currentConditions: [
            { condition: 'Hypertension', diagnosedDate: '2023-01-15', status: 'Active' },
            { condition: 'Type 2 Diabetes', diagnosedDate: '2023-03-20', status: 'Controlled' }
          ],
          medications: [
            { name: 'Lisinopril', dosage: '10mg', frequency: 'Daily', startDate: '2023-01-15' },
            { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', startDate: '2023-03-20' }
          ],
          allergies: [
            { allergen: 'Penicillin', severity: 'Severe', reaction: 'Anaphylaxis' },
            { allergen: 'Pollen', severity: 'Mild', reaction: 'Rhinitis' }
          ],
          notes: [
            { date: '2024-03-01', content: 'Patient reports improved blood pressure readings.', doctor: 'Dr. Thompson' }
          ]
        });

        // Speech recognition setup
        const [recognition, setRecognition] = useState(null);
        const [noteContent, setNoteContent] = useState("");

        useEffect(() => {
          if ('webkitSpeechRecognition' in window) {
            const recognitionInstance = new window.webkitSpeechRecognition();
            recognitionInstance.continuous = false;
            recognitionInstance.interimResults = false;
            recognitionInstance.lang = 'en-US';

            recognitionInstance.onresult = (event) => {
              const transcript = event.results[0][0].transcript;
              setNoteContent((prevContent) => prevContent + ' ' + transcript);
            };

            recognitionInstance.onend = () => {
              setIsRecording(false);
            };

            setRecognition(recognitionInstance);
          }
        }, []);

        const handleRecording = () => {
          if (isRecording) {
            recognition.stop();
            setIsRecording(false);
          } else {
            recognition.start();
            setIsRecording(true);
          }
        };

        const handleSaveNote = () => {
          if (noteContent.trim()) {
            const newNote = {
              date: new Date().toISOString().split('T')[0],
              content: noteContent,
              doctor: 'Dr. Thompson' // This could be dynamically set based on logged-in user
            };
            setPatientData((prevData) => ({
              ...prevData,
              notes: [...prevData.notes, newNote]
            }));
            setNoteContent("");
          }
        };

        return (
          <div className="patient-details-container">
            {/* Toolbar for editing and speech recognition */}
            <div className="toolbar flex items-center justify-end space-x-4 mb-4">
              <button onClick={() => setIsEditing(!isEditing)} className="btn-edit flex items-center space-x-2">
                {isEditing ? <Save className="h-5 w-5" /> : <Edit2 className="h-5 w-5" />}
                <span>{isEditing ? 'Save Changes' : 'Edit'}</span>
              </button>
              <button onClick={handleRecording} className="btn-recording flex items-center space-x-2">
                {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                <span>{isRecording ? 'Stop Recording' : 'Record'}</span>
              </button>
            </div>

            {/* Notes Section */}
            {activeSection === 'notes' && (
              <div className="space-y-4">
                {isEditing && (
                  <div className="mb-6">
                    <textarea
                      placeholder="Add a new note..."
                      className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      rows={4}
                      value={noteContent}
                      onChange={(e) => setNoteContent(e.target.value)}
                    />
                    <button onClick={handleSaveNote} className="mt-2 btn-save-note p-2 bg-blue-500 text-white rounded-lg">
                      Save Note
                    </button>
                  </div>
                )}
                {patientData.notes.map((note, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-gray-500" />
                        <span className="font-medium text-gray-900">{note.doctor}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Clock className="h-4 w-4" />
                        <span>{note.date}</span>
                      </div>
                    </div>
                    <p className="text-gray-600">{note.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      };

      export default PatientDetails;
