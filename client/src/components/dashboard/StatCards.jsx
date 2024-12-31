import React from 'react';
import { Package, DollarSign, Clock, TrendingUp } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const StatsCards = () => {
  const stats = {
    totalOrders: 45,
    revenue: 1234,
    averagePreparationTime: 25,
    activeOrders: 8
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Today's Orders</CardTitle>
          <Package className="text-gray-400" size={20} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalOrders}</div>
          <p className="text-xs text-gray-500">+12% from yesterday</p>
        </CardContent>
      </Card>
      {/* Add other stat cards similarly */}
    </div>
  );
};
