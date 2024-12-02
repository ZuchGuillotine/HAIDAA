// src/components/dashboard/DoctorDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Calendar,
  Activity,
  Clock,
  AlertCircle,
  ChevronRight,
  TrendingUp,
  FileText,
  MessageSquare,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { usePatientData } from '@/hooks/usePatientData';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const { patients, loading, error } = usePatientData();
  const [recentActivity, setRecentActivity] = useState([]);
  const [stats, setStats] = useState({
    totalPatients: 0,
    appointments: 0,
    pendingDiagnoses: 0,
    alertsCount: 0
  });

  // Simulate fetching dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      // In production, this would be an API call
      setStats({
        totalPatients: patients.length,
        appointments: 8,
        pendingDiagnoses: 3,
        alertsCount: 2
      });

      setRecentActivity([
        {
          id: 1,
          type: 'diagnosis',
          patient: 'John Smith',
          description: 'AI Diagnostic report generated',
          time: '2 hours ago'
        },
        {
          id: 2,
          type: 'appointment',
          patient: 'Emily Johnson',
          description: 'Scheduled follow-up appointment',
          time: '3 hours ago'
        },
        {
          id: 3,
          type: 'alert',
          patient: 'Michael Brown',
          description: 'High blood pressure alert',
          time: '4 hours ago'
        }
      ]);
    };

    fetchDashboardData();
  }, [patients]);

  const todayAppointments = [
    { id: 1, time: '10:00 AM', patient: 'Sarah Wilson', type: 'Follow-up' },
    { id: 2, time: '11:30 AM', patient: 'James Miller', type: 'Initial Consultation' },
    { id: 3, time: '2:00 PM', patient: 'Emma Davis', type: 'AI Review' }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, Dr. {user?.name || 'Thompson'}
          </h1>
          <p className="text-gray-600">Here's what's happening with your patients today.</p>
        </div>
        <Link
          to="/diagnostics"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          New Diagnosis
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Patients</p>
                <h3 className="text-2xl font-bold text-gray-900">{stats.totalPatients}</h3>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today's Appointments</p>
                <h3 className="text-2xl font-bold text-gray-900">{stats.appointments}</h3>
              </div>
              <Calendar className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Diagnoses</p>
                <h3 className="text-2xl font-bold text-gray-900">{stats.pendingDiagnoses}</h3>
              </div>
              <Activity className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Alerts</p>
                <h3 className="text-2xl font-bold text-gray-900">{stats.alertsCount}</h3>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Appointments */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Today's Appointments</CardTitle>
            <Link 
              to="/appointments" 
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
            >
              View All
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todayAppointments.map((appointment) => (
                <div 
                  key={appointment.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <Clock className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-900">{appointment.patient}</p>
                      <p className="text-sm text-gray-600">{appointment.type}</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-600">
                    {appointment.time}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Activity</CardTitle>
            <Link 
              to="/activity" 
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
            >
              View All
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div 
                  key={activity.id}
                  className="flex items-start space-x-4 p-3 bg-gray-50 rounded-lg"
                >
                  {activity.type === 'diagnosis' && <FileText className="h-5 w-5 text-blue-500 mt-1" />}
                  {activity.type === 'appointment' && <Calendar className="h-5 w-5 text-green-500 mt-1" />}
                  {activity.type === 'alert' && <AlertCircle className="h-5 w-5 text-red-500 mt-1" />}
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{activity.patient}</p>
                    <p className="text-sm text-gray-600">{activity.description}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>AI Diagnostic Insights</CardTitle>
          <Link 
            to="/diagnostics" 
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
          >
            View All Diagnostics
            <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-blue-900">Pattern Analysis</h4>
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              <p className="text-sm text-blue-800">
                3 patients showing similar symptom patterns this week
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-green-900">Treatment Success</h4>
                <Activity className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-sm text-green-800">
                85% success rate in recent treatment recommendations
              </p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-yellow-900">Follow-up Required</h4>
                <MessageSquare className="h-5 w-5 text-yellow-600" />
              </div>
              <p className="text-sm text-yellow-800">
                2 patients require immediate follow-up based on AI analysis
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorDashboard;