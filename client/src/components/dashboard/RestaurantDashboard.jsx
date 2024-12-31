// src/components/dashboard/RestaurantDashboard.jsx
import React from 'react';
import StatsCards from './StatCards';
import SalesChart from './SalesChart';
import ActiveOrdersList from './ActiveOrdersList';

const RestaurantDashboard = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Restaurant Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's your restaurant's overview.</p>
      </div>
      
      <StatsCards />
      <SalesChart />
      <ActiveOrdersList />
    </div>
  );
};

export default RestaurantDashboard;

