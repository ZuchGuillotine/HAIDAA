// src/components/doctor/PatientHistory.jsx
import React, { useState, useEffect } from 'react';
import {
  ClipboardList,
  Activity,
  Pill,
  AlertTriangle,
  Users,
  ChevronDown,
  ChevronRight,
  CalendarClock,
  Timeline,
  Filter
} from 'lucide-react';

// FHIR resource types we'll be handling
const RESOURCE_TYPES = {
  CONDITION: 'Condition',
  PROCEDURE: 'Procedure',
  MEDICATION: 'MedicationStatement',
  ALLERGY: 'AllergyIntolerance',
  FAMILY_HISTORY: 'FamilyMemberHistory'
};

const PatientHistory = ({ patientId }) => {
  const [activeSection, setActiveSection] = useState('conditions');
  const [timelineView, setTimelineView] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [historyData, setHistoryData] = useState({
    conditions: [],
    treatments: [],
    medications: [],
    allergies: [],
    familyHistory: []
  });
  const [filters, setFilters] = useState({
    dateRange: 'all',
    status: 'all',
    severity: 'all'
  });

  // Fetch FHIR data
  useEffect(() => {
    const fetchPatientHistory = async () => {
      setLoading(true);
      try {
        // In production, this would be actual FHIR API calls
        // Example structure following FHIR format
        const mockFHIRData = {
          conditions: [
            {
              resourceType: 'Condition',
              id: '1',
              clinicalStatus: { coding: [{ code: 'resolved' }] },
              verificationStatus: { coding: [{ code: 'confirmed' }] },
              category: [{ coding: [{ display: 'Problem List Item' }] }],
              severity: { coding: [{ display: 'Moderate' }] },
              code: { coding: [{ display: 'Type 2 Diabetes' }] },
              onsetDateTime: '2022-01-15',
              abatementDateTime: '2023-06-20',
              recordedDate: '2022-01-15',
              note: [{ text: 'Initially diagnosed during routine checkup' }]
            }
          ],
          procedures: [
            {
              resourceType: 'Procedure',
              id: '1',
              status: 'completed',
              category: { coding: [{ display: 'Surgery' }] },
              code: { coding: [{ display: 'Appendectomy' }] },
              performedDateTime: '2021-03-15',
              note: [{ text: 'Routine procedure without complications' }]
            }
          ],
          // Add other FHIR-formatted mock data...
        };

        setHistoryData({
          conditions: mockFHIRData.conditions,
          treatments: mockFHIRData.procedures,
          medications: [], // Add FHIR-formatted medication history
          allergies: [],   // Add FHIR-formatted allergies
          familyHistory: [] // Add FHIR-formatted family history
        });
      } catch (err) {
        setError('Failed to fetch patient history');
      } finally {
        setLoading(false);
      }
    };

    fetchPatientHistory();
  }, [patientId]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    const statusColors = {
      active: 'text-green-700 bg-green-50',
      resolved: 'text-blue-700 bg-blue-50',
      inactive: 'text-gray-700 bg-gray-50'
    };
    return statusColors[status.toLowerCase()] || 'text-gray-700 bg-gray-50';
  };

  const SectionHeader = ({ title, icon: Icon, count }) => (
    <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-t-lg">
      <div className="flex items-center space-x-2">
        <Icon className="h-5 w-5 text-gray-500" />
        <h2 className="font-medium text-gray-900">{title}</h2>
        {count > 0 && (
          <span className="ml-2 px-2 py-1 text-xs font-medium text-gray-600 bg-gray-200 rounded-full">
            {count}
          </span>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => setTimelineView(!timelineView)}
          className="p-1 hover:bg-gray-200 rounded"
        >
          <Timeline className="h-4 w-4 text-gray-500" />
        </button>
        <button
          className="p-1 hover:bg-gray-200 rounded"
          onClick={() => {/* Add filter logic */}}
        >
          <Filter className="h-4 w-4 text-gray-500" />
        </button>
      </div>
    </div>
  );

  const TimelineView = ({ data, resourceType }) => (
    <div className="pl-4 relative">
      <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-200" />
      {data.map((item, index) => (
        <div key={item.id} className="relative mb-4 pl-6">
          <div className="absolute left-0 top-2 w-2 h-2 bg-blue-500 rounded-full" />
          <div className="p-4 bg-white border rounded-lg">
            {resourceType === RESOURCE_TYPES.CONDITION && (
              <ConditionCard condition={item} />
            )}
            {resourceType === RESOURCE_TYPES.PROCEDURE && (
              <TreatmentCard treatment={item} />
            )}
            {/* Add other resource type renderers */}
          </div>
        </div>
      ))}
    </div>
  );

  const ConditionCard = ({ condition }) => (
    <div>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-gray-900">
            {condition.code.coding[0].display}
          </h3>
          <p className="text-sm text-gray-500">
            {formatDate(condition.onsetDateTime)}
            {condition.abatementDateTime && ` - ${formatDate(condition.abatementDateTime)}`}
          </p>
        </div>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          getStatusColor(condition.clinicalStatus.coding[0].code)
        }`}>
          {condition.clinicalStatus.coding[0].code}
        </span>
      </div>
      {condition.note && condition.note[0] && (
        <p className="mt-2 text-sm text-gray-600">{condition.note[0].text}</p>
      )}
    </div>
  );

  const TreatmentCard = ({ treatment }) => (
    <div>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-gray-900">
            {treatment.code.coding[0].display}
          </h3>
          <p className="text-sm text-gray-500">
            {formatDate(treatment.performedDateTime)}
          </p>
        </div>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          getStatusColor(treatment.status)
        }`}>
          {treatment.status}
        </span>
      </div>
      {treatment.note && treatment.note[0] && (
        <p className="mt-2 text-sm text-gray-600">{treatment.note[0].text}</p>
      )}
    </div>
  );

  if (loading) return <div>Loading patient history...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Navigation Tabs */}
      <div className="flex space-x-1 p-2 bg-gray-50 rounded-t-lg">
        {[
          { id: 'conditions', label: 'Conditions', icon: Activity },
          { id: 'treatments', label: 'Treatments', icon: ClipboardList },
          { id: 'medications', label: 'Medications', icon: Pill },
          { id: 'allergies', label: 'Allergies', icon: AlertTriangle },
          { id: 'familyHistory', label: 'Family History', icon: Users }
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveSection(id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md ${
              activeSection === id
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Content Section */}
      <div className="p-4">
        {activeSection === 'conditions' && (
          <div>
            <SectionHeader 
              title="Medical Conditions" 
              icon={Activity}
              count={historyData.conditions.length}
            />
            {timelineView ? (
              <TimelineView 
                data={historyData.conditions}
                resourceType={RESOURCE_TYPES.CONDITION}
              />
            ) : (
              <div className="space-y-4 mt-4">
                {historyData.conditions.map((condition) => (
                  <div key={condition.id} className="border rounded-lg p-4">
                    <ConditionCard condition={condition} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Add similar sections for treatments, medications, allergies, and family history */}
      </div>
    </div>
  );
};

export default PatientHistory;