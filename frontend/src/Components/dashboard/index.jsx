// src/components/dashboard/index.js

// Import all dashboard components
import DoctorDashboard from './DoctorDashboard';
import PatientDashboard from './PatientDashboard';  // If we create this in future
import AdminDashboard from './AdminDashboard';      // If we create this in future

// Export all components
export {
  DoctorDashboard,
  PatientDashboard,
  AdminDashboard
};

// You can also provide default export if needed
export default DoctorDashboard;

/**
 * Usage examples:
 * 
 * // Import specific dashboard
 * import { DoctorDashboard } from '@/components/dashboard';
 * 
 * // Import multiple dashboards
 * import { DoctorDashboard, AdminDashboard } from '@/components/dashboard';
 * 
 * // Default import
 * import DoctorDashboard from '@/components/dashboard';
 */