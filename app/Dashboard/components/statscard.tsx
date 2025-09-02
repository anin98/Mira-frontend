// components/StatsCards.tsx
import React from 'react';
import { 
  Package, 
  DollarSign, 
  Users, 
  TrendingUp, 
  Target, 
  Zap 
} from 'lucide-react';
import { AnalyticsSummary } from './api';

interface StatsCardsProps {
  stats: AnalyticsSummary | null;
  loading: boolean;
}

const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  color, 
  loading 
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  loading: boolean;
}) => (
  <div className="bg-white rounded-lg shadow-sm border p-4">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900">
          {loading ? "..." : value}
        </p>
      </div>
      <Icon className={`w-8 h-8 ${color}`} />
    </div>
  </div>
);

export const StatsCards: React.FC<StatsCardsProps> = ({ stats, loading }) => {
  const cardData = [
    {
      title: "Total Orders",
      value: stats?.total_orders || 0,
      icon: Package,
      color: "text-blue-600"
    },
    {
      title: "Revenue",
      value: `${(stats?.total_revenue || 0).toFixed(2)}`,
      icon: DollarSign,
      color: "text-green-600"
    },
    {
      title: "Customers",
      value: stats?.unique_customers || 0,
      icon: Users,
      color: "text-purple-600"
    },
    {
      title: "Avg Order",
      value: `${(stats?.avg_order_value || 0).toFixed(2)}`,
      icon: TrendingUp,
      color: "text-orange-600"
    },
    {
      title: "Items Sold",
      value: stats?.total_quantity || 0,
      icon: Target,
      color: "text-red-600"
    },
    {
      title: "Recent (24h)",
      value: stats?.recent_orders || 0,
      icon: Zap,
      color: "text-yellow-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {cardData.map((card, index) => (
        <StatCard key={index} {...card} loading={loading} />
      ))}
    </div>
  );
};