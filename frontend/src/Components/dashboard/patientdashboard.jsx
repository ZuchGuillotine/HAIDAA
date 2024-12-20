import React, { useState } from 'react';
import { User, Bell, Calendar, FileText, Lock, Activity, ChevronRight } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Mock data - would come from API in real implementation
const mockHealthData = {
  vitals: {
    bloodPressure: "120/80",
    heartRate: "72 bpm",
    temperature: "98.6°F",
    lastUpdated: "2024-05-20"
  },
  appointments: [
    { id: 1, doctor: "Dr. Sarah Thompson", date: "2024-06-01", time: "10:00 AM", type: "Follow-up" },
    { id: 2, doctor: "Dr. Michael Chen", date: "2024-06-15", time: "2:30 PM", type: "Annual Check-up" }
  ],
  medications: [
    { name: "Lisinopril", dosage: "10mg", frequency: "Daily", startDate: "2024-01-15" },
    { name: "Metformin", dosage: "500mg", frequency: "Twice daily", startDate: "2024-02-01" }
  ],
  consents: [
    { id: 1, doctor: "Dr. Sarah Thompson", purpose: "Primary Care", granted: "2024-01-15", status: "Active" },
    { id: 2, doctor: "Dr. Michael Chen", purpose: "Specialist Consultation", granted: "2024-03-01", status: "Active" }
  ]
};

const PatientDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <User className="h-10 w-10 text-gray-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Welcome, John Smith</h1>
                <p className="text-sm text-gray-500">Last login: May 25, 2024</p>
              </div>
            </div>
            <Bell className="h-6 w-6 text-gray-600 cursor-pointer" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Alert for important notifications */}
        <Alert className="mb-6 bg-blue-50 border-blue-200">
          <Activity className="h-4 w-4" />
          <AlertDescription>
            Your next appointment with Dr. Thompson is scheduled for June 1st, 2024 at 10:00 AM
          </AlertDescription>
        </Alert>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Health Summary Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Recent Vitals</h2>
              <Activity className="h-5 w-5 text-gray-600" />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Blood Pressure</span>
                <span className="font-medium">{mockHealthData.vitals.bloodPressure}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Heart Rate</span>
                <span className="font-medium">{mockHealthData.vitals.heartRate}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Temperature</span>
                <span className="font-medium">{mockHealthData.vitals.temperature}</span>
              </div>
              <div className="text-sm text-gray-500 mt-2">
                Last updated: {mockHealthData.vitals.lastUpdated}
              </div>
            </div>
          </div>

          {/* Appointments Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Upcoming Appointments</h2>
              <Calendar className="h-5 w-5 text-gray-600" />
            </div>
            <div className="space-y-4">
              {mockHealthData.appointments.map(appointment => (
                <div key={appointment.id} className="border-b pb-3 last:border-b-0 last:pb-0">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{appointment.doctor}</span>
                    <span className="text-sm text-gray-500">{appointment.type}</span>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {appointment.date} at {appointment.time}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Medications Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Current Medications</h2>
              <FileText className="h-5 w-5 text-gray-600" />
            </div>
            <div className="space-y-4">
              {mockHealthData.medications.map((medication, index) => (
                <div key={index} className="border-b pb-3 last:border-b-0 last:pb-0">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{medication.name}</span>
                    <span className="text-sm text-gray-500">{medication.dosage}</span>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {medication.frequency} - Started {medication.startDate}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Consent Management Section */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Active Consents</h2>
            <Lock className="h-5 w-5 text-gray-600" />
          </div>
          <div className="space-y-4">
            {mockHealthData.consents.map(consent => (
              <div key={consent.id} className="flex items-center justify-between border-b pb-4 last:border-b-0">
                <div>
                  <div className="font-medium">{consent.doctor}</div>
                  <div className="text-sm text-gray-600">{consent.purpose}</div>
                  <div className="text-sm text-gray-500">Granted: {consent.granted}</div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                    {consent.status}
                  </span>
                  <button className="text-blue-600 hover:text-blue-800">
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default PatientDashboard;