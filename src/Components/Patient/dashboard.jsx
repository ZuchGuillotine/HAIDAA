// pages/dashboard.jsx
import DoctorDashboard from '@/components/dashboard/DoctorDashboard';
import { useAuth } from '@/hooks/useAuth';

export default function Dashboard() {
  const { user, isDoctor } = useAuth();

  if (!user) return <Redirect to="/login" />;
  if (!isDoctor) return <Redirect to="/unauthorized" />;

  return <DoctorDashboard />;
}