"use client";

import * as React from 'react';
import { useState } from 'react';
import { RefreshCw } from 'lucide-react';

// Components (you'll need to adjust these imports based on your file structure)
import { StatsCards } from './components/statscard';
import { RecentOrders } from './components/recent';
import { PopularProducts } from './components/popularProduct';
import { OrdersTable } from './components/orderTable';

// Hooks (you'll need to adjust these imports based on your file structure)
import { useAnalytics, useOrders } from './components/hooks';

// Local Button component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "default" | "outline";
  size?: "default" | "sm";
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  className = "", 
  variant = "default",
  size = "default",
  ...props 
}) => {
  const variantStyles = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
  };
  
  const sizeStyles = {
    default: "px-4 py-2 text-sm",
    sm: "px-3 py-1.5 text-xs"
  };

  return (
    <button
      className={`inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const ManageSales: React.FC = () => {
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  // API Hooks
  const { stats, loading: analyticsLoading, error: analyticsError, refetch: refetchAnalytics } = useAnalytics();
  const { orders, loading: ordersLoading, error: ordersError, refetch: refetchOrders } = useOrders();

  const loading = analyticsLoading || ordersLoading;
  const error = analyticsError || ordersError;

  const handleRefresh = async () => {
    await Promise.all([
      refetchAnalytics(),
      refetchOrders(),
    ]);
    setLastRefresh(new Date());
  };

  const exportToCSV = () => {
    if (orders.length === 0) {
      alert('No orders to export');
      return;
    }
  
    // Define CSV headers based on actual order data structure
    const headers = [
      'Order ID', 
      'Customer Name', 
      'Phone', 
      'Address', 
      'Subtotal (৳)', 
      'Delivery Charge (৳)', 
      'Total Amount (৳)', 
      'Status', 
      'Date', 
      'Time'
    ];
    
    // Convert orders to CSV format using correct property names
    const csvData = orders.map(order => [
      order.id.toString(),
      order.guest_name,
      order.guest_phone,
      `"${order.guest_address.replace(/"/g, '""')}"`, // Escape quotes in address
      order.subtotal.toFixed(2),
      order.delivery_charge.toFixed(2),
      order.total_amount.toFixed(2),
      order.status.replace('_', ' '), // Format status (e.g., PENDING_PAYMENT -> PENDING PAYMENT)
      new Date(order.created_at).toLocaleDateString(),
      new Date(order.created_at).toLocaleTimeString()
    ]);
  
    // Combine headers and data
    const csvContent = [headers, ...csvData]
      .map(row => row.join(','))
      .join('\n');
  
    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `orders-export-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Sales Dashboard</h2>
          <p className="text-gray-600">
            {lastRefresh ? `Last updated: ${lastRefresh.toLocaleTimeString()}` : 'Monitor your sales performance and order management'}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button 
            onClick={handleRefresh}
            variant="outline"
            disabled={loading}
            className="flex items-center space-x-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <p className="text-red-600">{error}</p>
            <Button 
              onClick={handleRefresh} 
              size="sm" 
              variant="outline"
              className="text-red-600 border-red-300 hover:bg-red-50"
            >
              Retry
            </Button>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <StatsCards stats={stats} loading={analyticsLoading} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <RecentOrders orders={orders} loading={ordersLoading} />

        {/* Popular Products */}
        <PopularProducts orders={orders} loading={ordersLoading} />

   
      </div>

      {/* All Orders Table */}
      <OrdersTable 
        orders={orders} 
        loading={ordersLoading} 
        onExportCSV={exportToCSV}
      />
    </div>
  );
};

export default ManageSales;