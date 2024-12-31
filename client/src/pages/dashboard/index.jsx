import React from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import RestaurantDashboard from '../../components/dashboard/RestaurantDashboard';

const DashboardPage = () => {
  return (
    <DashboardLayout>
      <RestaurantDashboard />
    </DashboardLayout>
  );
};

export default DashboardPage;