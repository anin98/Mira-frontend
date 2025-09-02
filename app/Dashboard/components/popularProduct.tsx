// components/PopularProducts.tsx
import React from 'react';
import { TrendingUp, ShoppingBag } from 'lucide-react';
import { Order } from './api';

interface PopularProductsProps {
  orders: Order[];
  loading: boolean;
}

export const PopularProducts: React.FC<PopularProductsProps> = ({ orders, loading }) => {
  const getOrderStats = () => {
    if (!orders.length) return [];
    
    // Since we don't have product-specific data, let's show order value ranges
    const valueRanges = {
      'Small Orders (৳1-500)': 0,
      'Medium Orders (৳501-1000)': 0,
      'Large Orders (৳1001-2000)': 0,
      'Premium Orders (৳2000+)': 0
    };

    orders.forEach(order => {
      const amount = order.total_amount || 0;
      if (amount <= 500) {
        valueRanges['Small Orders (৳1-500)']++;
      } else if (amount <= 1000) {
        valueRanges['Medium Orders (৳501-1000)']++;
      } else if (amount <= 2000) {
        valueRanges['Large Orders (৳1001-2000)']++;
      } else {
        valueRanges['Premium Orders (৳2000+)']++;
      }
    });

    return Object.entries(valueRanges)
      .filter(([, count]) => count > 0)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);
  };

  const orderStats = getOrderStats();
  const maxCount = Math.max(...orderStats.map(([,count]) => count), 1);

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Order Categories</h3>
          <TrendingUp className="w-5 h-5 text-gray-400" />
        </div>
      </div>
      <div className="p-6">
        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-2 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        ) : orderStats.length > 0 ? (
          <div className="space-y-4">
            {orderStats.map(([category, count], index) => (
              <div key={index} className="flex justify-between items-center">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <ShoppingBag className="w-4 h-4 text-gray-400" />
                    <p className="font-medium text-gray-900 text-sm">{category}</p>
                  </div>
                  <div className="w-48 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                      style={{ 
                        width: `${Math.min((count / maxCount) * 100, 100)}%` 
                      }}
                    ></div>
                  </div>
                </div>
                <div className="text-right ml-4">
                  <span className="text-sm font-medium text-gray-900">{count}</span>
                  <p className="text-xs text-gray-500">orders</p>
                </div>
              </div>
            ))}
            
            {/* Summary Stats */}
            <div className="border-t pt-4 mt-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-lg font-semibold text-gray-900">{orders.length}</p>
                  <p className="text-xs text-gray-500">Total Orders</p>
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-900">
                    ৳{orders.reduce((sum, order) => sum + (order.total_amount || 0), 0).toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">Total Revenue</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No order data yet</p>
        )}
      </div>
    </div>
  );
};