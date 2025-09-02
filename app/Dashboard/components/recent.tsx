// components/RecentOrders.tsx
import React from 'react';
import { User, Calendar, Package, DollarSign } from 'lucide-react';
import { Order } from './api';

interface RecentOrdersProps {
  orders: Order[];
  loading: boolean;
}

const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'pending_payment':
      return 'bg-yellow-100 text-yellow-800';
    case 'confirmed':
      return 'bg-blue-100 text-blue-800';
    case 'processing':
      return 'bg-orange-100 text-orange-800';
    case 'shipped':
      return 'bg-purple-100 text-purple-800';
    case 'delivered':
      return 'bg-green-100 text-green-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const formatStatus = (status: string) => {
  if (!status) return 'Unknown';
  return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
};

export const RecentOrders: React.FC<RecentOrdersProps> = ({ orders, loading }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
          <Package className="w-5 h-5 text-gray-400" />
        </div>
      </div>
      <div className="p-6">
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        ) : orders.length > 0 ? (
          <div className="space-y-4">
            {orders.slice(-5).reverse().map((order, index) => (
              <div key={order.id || index} className="flex justify-between items-start p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <p className="font-medium text-gray-900">{order.guest_name}</p>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                      {formatStatus(order.status)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">
                    Order #{order.id} • {order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''}
                  </p>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-gray-400" />
                    <p className="text-xs text-gray-500">
                      {new Date(order.created_at).toLocaleDateString()} at {new Date(order.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center justify-end mb-1">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-green-600">
                      ৳{order.total_amount}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    +৳{order.delivery_charge} delivery
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No orders yet</p>
        )}
      </div>
    </div>
  );
};