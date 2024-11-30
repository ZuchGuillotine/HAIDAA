import React, { useState } from 'react';
import { Bell, User, Search, Calendar, AlignLeft } from 'lucide-react';

// Mock data - in a real application, this would come from API calls
const mockPatients = [
  { id: '1', name: 'John Doe', lastVisit: '2024-05-15', condition: 'Pending Diagnosis' },
  { id: '2', name: 'Jane Smith', lastVisit: '2024-05-10', condition: 'Treatment in Progress' },
];

const mockAppointments = [
  { id: '1', patient: 'Emily Johnson', time: '10:00 AM', date: '2024-06-01' },
  { id: '2', patient: 'Michael Brown', time: '02:30 PM', date: '2024-06-01' },
];

const mockAIInsights = [
  { id: '1', patient: 'John Doe', recommendation: 'Further cardiovascular tests recommended', confidence: '85%' },
  { id: '2', patient: 'Jane Smith', recommendation: 'Potential treatment adjustment', confidence: '72%' },
];

const DoctorDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPatients = mockPatients.filter(patient => 
    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <header className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <User className="h-10 w-10 text-gray-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Dr. Sarah Thompson</h1>
            <p className="text-sm text-gray-500">Cardiology Specialist</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Bell className="h-6 w-6 text-gray-600 cursor-pointer" />
          <AlignLeft className="h-6 w-6 text-gray-600 cursor-pointer" />
        </div>
      </header>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search patients..." 
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Recent Patients */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-lg font-semibold mb-4">Recent Patients</h2>
          {filteredPatients.map(patient => (
            <div key={patient.id} className="border-b py-2 last:border-b-0">
              <div className="flex justify-between items-center">
                <span className="font-medium">{patient.name}</span>
                <span className="text-sm text-gray-500">{patient.lastVisit}</span>
              </div>
              <p className="text-sm text-gray-400">{patient.condition}</p>
            </div>
          ))}
        </div>

        {/* Upcoming Appointments */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Appointments</h2>
            <Calendar className="h-5 w-5 text-gray-600" />
          </div>
          {mockAppointments.map(appointment => (
            <div key={appointment.id} className="border-b py-2 last:border-b-0">
              <div className="flex justify-between">
                <span className="font-medium">{appointment.patient}</span>
                <span className="text-sm text-gray-500">{appointment.time}</span>
              </div>
              <p className="text-sm text-gray-400">{appointment.date}</p>
            </div>
          ))}
        </div>

        {/* AI Diagnostic Insights */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-lg font-semibold mb-4">AI Diagnostic Insights</h2>
          {mockAIInsights.map(insight => (
            <div key={insight.id} className="border-b py-2 last:border-b-0">
              <div className="flex justify-between items-center">
                <span className="font-medium">{insight.patient}</span>
                <span className={`text-sm font-semibold ${
                  parseInt(insight.confidence) > 80 ? 'text-green-600' : 'text-yellow-600'
                }`}>
                  {insight.confidence}
                </span>
              </div>
              <p className="text-sm text-gray-500">{insight.recommendation}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;