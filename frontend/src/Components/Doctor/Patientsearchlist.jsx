import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  User, 
  Calendar, 
  ChevronRight, 
  AlertCircle,
  Clock,
  FileText,
  MoreVertical 
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Mock data - would come from API in production
const mockPatients = [
  {
    id: '1',
    name: 'John Smith',
    age: 45,
    gender: 'Male',
    lastVisit: '2024-05-15',
    nextAppointment: '2024-06-01',
    status: 'Active',
    condition: 'Hypertension',
    riskLevel: 'Medium',
    consentStatus: 'Granted'
  },
  {
    id: '2',
    name: 'Emily Johnson',
    age: 32,
    gender: 'Female',
    lastVisit: '2024-05-10',
    nextAppointment: null,
    status: 'Active',
    condition: 'Type 2 Diabetes',
    riskLevel: 'High',
    consentStatus: 'Granted'
  },
  // Add more mock patients as needed
];

const PatientSearchList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filteredPatients, setFilteredPatients] = useState(mockPatients);
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

  // Filter and search patients
  useEffect(() => {
    let results = mockPatients;

    // Apply status filter
    if (filterStatus !== 'all') {
      results = results.filter(patient => patient.status.toLowerCase() === filterStatus);
    }

    // Apply search term
    if (searchTerm) {
      results = results.filter(patient => 
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.condition.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredPatients(results);
  }, [searchTerm, filterStatus]);

  const getRiskLevelBadgeColor = (riskLevel) => {
    switch (riskLevel.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Search and Filter Header */}
      <div className="p-4 border-b">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search patients by name or condition..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filter Button */}
          <div className="relative">
            <button
              onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
              className="flex items-center space-x-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              <Filter className="h-5 w-5 text-gray-600" />
              <span>Filter</span>
            </button>

            {isFilterMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 border">
                <div className="py-1">
                  <button
                    onClick={() => setFilterStatus('all')}
                    className={`block w-full text-left px-4 py-2 text-sm ${filterStatus === 'all' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    All Patients
                  </button>
                  <button
                    onClick={() => setFilterStatus('active')}
                    className={`block w-full text-left px-4 py-2 text-sm ${filterStatus === 'active' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    Active Patients
                  </button>
                  <button
                    onClick={() => setFilterStatus('inactive')}
                    className={`block w-full text-left px-4 py-2 text-sm ${filterStatus === 'inactive' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    Inactive Patients
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Patient List */}
      <div className="divide-y">
        {filteredPatients.length === 0 ? (
          <div className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No patients found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          filteredPatients.map((patient) => (
            <div key={patient.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                {/* Patient Info */}
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <User className="h-10 w-10 text-gray-400 bg-gray-100 rounded-full p-2" />
                    </div>
                    <div>
                      <Link 
                        href={`/patients/${patient.id}`}
                        className="text-lg font-medium text-gray-900 hover:text-blue-600"
                      >
                        {patient.name}
                      </Link>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>{patient.age} yrs</span>
                        <span>{patient.gender}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskLevelBadgeColor(patient.riskLevel)}`}>
                          {patient.riskLevel} Risk
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Clock className="h-4 w-4" />
                      <span>Last Visit: {patient.lastVisit}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {patient.nextAppointment 
                          ? `Next: ${patient.nextAppointment}`
                          : 'No upcoming appointment'
                        }
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <FileText className="h-4 w-4" />
                      <span>{patient.condition}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      patient.consentStatus === 'Granted' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {patient.consentStatus}
                    </span>
                  </div>
                  <div className="relative">
                    <button className="p-2 hover:bg-gray-100 rounded-full">
                      <MoreVertical className="h-5 w-5 text-gray-400" />
                    </button>
                  </div>
                  <Link 
                    href={`/patients/${patient.id}`}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PatientSearchList;