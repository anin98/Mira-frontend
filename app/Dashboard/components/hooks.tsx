// hooks/useApi.ts
import { useState, useEffect, useCallback } from 'react';
import { apiService, AnalyticsSummary, Order, Conversation, Product } from './api';

export const useAnalytics = () => {
  const [stats, setStats] = useState<AnalyticsSummary>({
    total_orders: 0,
    total_revenue: 0,
    unique_customers: 0,
    avg_order_value: 0,
    total_quantity: 0,
    recent_orders: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await apiService.getAnalyticsSummary();
      setStats(data);
    } catch (err) {
      console.error("Error fetching analytics:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch analytics");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return { stats, loading, error, refetch: fetchAnalytics };
};

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const { orders: ordersData, total: totalCount } = await apiService.getOrders();
      setOrders(ordersData);
      setTotal(totalCount);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return { orders, total, loading, error, refetch: fetchOrders };
};

export const useInbox = () => {
  const [loading, setLoading] = useState(false); // Changed to false since we're not actually fetching
  const [error, setError] = useState<string>("");

  // Commented out since you mentioned not using inbox now
  // const [conversations, setConversations] = useState<Conversation[]>([]);
  // const fetchInbox = useCallback(async () => {
  //   try {
  //     setLoading(true);
  //     setError("");
  //     const data = await apiService.getInbox();
  //     setConversations(data);
  //   } catch (err) {
  //     console.error("Error fetching inbox:", err);
  //     setError(err instanceof Error ? err.message : "Failed to fetch conversations");
  //   } finally {
  //     setLoading(false);
  //   }
  // }, []);

  // useEffect(() => {
  //   fetchInbox();
  // }, [fetchInbox]);

  return { loading, error };
};

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await apiService.getProducts();
      setProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, loading, error, refetch: fetchProducts };
};