// src/components/doctor/ConsentManager.jsx
import React, { useState, useEffect } from 'react';
import {
  ClipboardCheck,
  Clock,
  AlertCircle,
  FileText,
  Download,
  Send,
  CheckCircle,
  XCircle,
  AlertTriangle,
  History,
  Eye,
  Plus
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const ConsentManager = ({ patientId }) => {
  const [activeTab, setActiveTab] = useState('current');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [consents, setConsents] = useState({
    active: [],
    pending: [],
    expired: [],
    history: []
  });

  // Mock data - would come from API in production
  useEffect(() => {
    const fetchConsents = async () => {
      try {
        // Simulate API call
        const mockConsents = {
          active: [
            {
              id: '1',
              type: 'Treatment',
              description: 'General medical treatment consent',
              grantedDate: '2024-01-15',
              expiryDate: '2025-01-15',
              status: 'active',
              documentUrl: '/consents/doc1.pdf',
              lastUpdated: '2024-01-15',
              scope: ['Medical procedures', 'Medication administration'],
              grantedBy: 'Patient',
              verificationMethod: 'Electronic signature'
            },
            {
              id: '2',
              type: 'Data Sharing',
              description: 'Share medical data with specialists',
              grantedDate: '2024-02-01',
              expiryDate: '2024-08-01',
              status: 'active',
              documentUrl: '/consents/doc2.pdf',
              lastUpdated: '2024-02-01',
              scope: ['Medical history', 'Test results'],
              grantedBy: 'Legal guardian',
              verificationMethod: 'In-person'
            }
          ],
          pending: [
            {
              id: '3',
              type: 'Surgery',
              description: 'Consent for surgery to repair ACL',
              requestDate: '2024-04-05',
              status: 'pending',
              requestedBy: 'Dr. Smith'
            }
          ],
          expired: [],
          history: []
        };
        setConsents(mockConsents);
        setLoading(false);
      } catch (err) {
        setError('Failed to load consent data');
        setLoading(false);
      }
    };

    fetchConsents();
  }, []);

  const handleApproveConsent = (consentId) => {
    setConsents((prevConsents) => {
      const consent = prevConsents.pending.find((c) => c.id === consentId);
      return {
        ...prevConsents,
        pending: prevConsents.pending.filter((c) => c.id !== consentId),
        active: [...prevConsents.active, { ...consent, status: 'active', grantedDate: new Date().toISOString().split('T')[0] }]
      };
    });
  };

  const handleRejectConsent = (consentId) => {
    setConsents((prevConsents) => {
      return {
        ...prevConsents,
        pending: prevConsents.pending.filter((c) => c.id !== consentId)
      };
    });
  };

  const handleRequestConsent = () => {
    // This function would handle form submission to request new consents
    // Here we just mock adding a pending consent
    setConsents((prevConsents) => ({
      ...prevConsents,
      pending: [
        ...prevConsents.pending,
        {
          id: new Date().getTime().toString(),
          type: 'New Consent',
          description: 'New consent request',
          requestDate: new Date().toISOString().split('T')[0],
          status: 'pending',
          requestedBy: 'Dr. Thompson'
        }
      ]
    }));
    setShowRequestForm(false);
  };

  if (loading) {
    return <div>Loading consent information...</div>;
  }

  if (error) {
    return (
      <Alert>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="consent-manager-container">
      {/* Tabs for consent status */}
      <div className="tabs flex items-center space-x-4 mb-4">
        <button onClick={() => setActiveTab('current')} className={`tab ${activeTab === 'current' ? 'text-blue-600' : 'text-gray-500'}`}>
          Current Consents
        </button>
        <button onClick={() => setActiveTab('pending')} className={`tab ${activeTab === 'pending' ? 'text-blue-600' : 'text-gray-500'}`}>
          Pending Consents
        </button>
        <button onClick={() => setActiveTab('expired')} className={`tab ${activeTab === 'expired' ? 'text-blue-600' : 'text-gray-500'}`}>
          Expired Consents
        </button>
      </div>

      {/* Consent details based on active tab */}
      {activeTab === 'current' && (
        <>
          {consents.active.map((consent) => (
            <div key={consent.id} className="bg-white p-4 rounded-lg border mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{consent.type}</h3>
                  <p className="mt-1 text-gray-600">{consent.description}</p>
                  <div className="text-sm text-gray-500 mt-2">Granted by: {consent.grantedBy}</div>
                </div>
                <a href={consent.documentUrl} className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-md">
                  <Download className="h-5 w-5" />
                </a>
              </div>
              <div className="text-sm text-gray-500 mt-2">Verification: {consent.verificationMethod}</div>
              <div className="text-sm text-gray-500 mt-1">Scope: {consent.scope.join(', ')}</div>
            </div>
          ))}
        </>
      )}

      {activeTab === 'pending' && (
        <>
          {consents.pending.map((consent) => (
            <div key={consent.id} className="bg-white p-4 rounded-lg border mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{consent.type}</h3>
                  <p className="mt-1 text-gray-600">{consent.description}</p>
                  <div className="text-sm text-gray-500 mt-2">Requested by: {consent.requestedBy}</div>
                </div>
                <div className="flex items-center space-x-2">
                  <button onClick={() => handleApproveConsent(consent.id)} className="px-3 py-1 text-green-600 hover:bg-green-50 rounded-md">
                    <CheckCircle className="h-5 w-5" />
                  </button>
                  <button onClick={() => handleRejectConsent(consent.id)} className="px-3 py-1 text-red-600 hover:bg-red-50 rounded-md">
                    <XCircle className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </>
      )}

      {activeTab === 'expired' && (
        <div>No expired consents at this time.</div>
      )}

      {/* Request new consent form */}
      {showRequestForm && (
        <div className="request-form bg-white p-4 rounded-lg border mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Request New Consent</h3>
          <button onClick={handleRequestConsent} className="btn-request p-2 bg-blue-500 text-white rounded-lg">
            Request Consent
          </button>
        </div>
      )}

      {!showRequestForm && (
        <button onClick={() => setShowRequestForm(true)} className="btn-add-request mt-4 p-2 bg-green-500 text-white rounded-lg">
          <Plus className="h-5 w-5 inline-block mr-2" /> Request New Consent
        </button>
      )}
    </div>
  );
};

export default ConsentManager;
