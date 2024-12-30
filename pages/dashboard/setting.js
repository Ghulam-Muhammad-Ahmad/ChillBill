"use client"
import DashboardLayout from '@/components/DashboardLayout';
import ResetPasswordForm from '@/components/ResetPasswordForm';

const Setting = () => {
  return (
    <DashboardLayout>
      <h1>Setting Page in the Dashboard</h1>
      <ResetPasswordForm />
    </DashboardLayout>
  );
};

export default Setting;
