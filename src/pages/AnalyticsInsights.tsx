import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import MainLayout from '../components/MainLayout';
import { analyticsAPI } from '../services/analyticsService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const AnalyticsInsights: React.FC = () => {
  const { adminUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter'>('month');

  // Fetch analytics data from API
  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      
      // Get system analytics
      const systemAnalytics = await analyticsAPI.getSystemAnalytics();
      if (systemAnalytics && systemAnalytics.analytics) {
        setAnalyticsData(systemAnalytics.analytics);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics, timeRange]);

  if (!adminUser) {
    return <div>Not authenticated</div>;
  }

  if (loading || !analyticsData) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
      </MainLayout>
    );
  }

  // Colors for charts
  const ANALYTICS_COLORS = ['#4f46e5', '#22c55e', '#ef4444', '#f97316', '#8b5cf6', '#ec4899'];

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:flex lg:items-center lg:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Analytics & Insights
            </h2>
          </div>
          
          <div className="mt-5 flex lg:mt-0 lg:ml-4">
            <select
              id="timeRange"
              name="timeRange"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
            </select>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                  <dd className="text-2xl font-medium text-gray-900">{analyticsData.totalUsers || 0}</dd>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dt className="text-sm font-medium text-gray-500 truncate">Verified Users</dt>
                  <dd className="text-2xl font-medium text-gray-900">{analyticsData.verifiedUsers || 0}</dd>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dt className="text-sm font-medium text-gray-500 truncate">Active Listings</dt>
                  <dd className="text-2xl font-medium text-gray-900">{analyticsData.activeListings || 0}</dd>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dt className="text-sm font-medium text-gray-500 truncate">Completed Deals</dt>
                  <dd className="text-2xl font-medium text-gray-900">{analyticsData.completedDeals || 0}</dd>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {analyticsData.charts?.dealsPerDay && (
            <div className="bg-white p-6 shadow rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Deals per Day</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={analyticsData.charts.dealsPerDay}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" name="Number of Deals" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {analyticsData.charts?.listingsByCategory && (
            <div className="bg-white p-6 shadow rounded-lg lg:col-span-2">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Listings by Category</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analyticsData.charts.listingsByCategory}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                      nameKey="name"
                      label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : '0'}%`}
                    >
                      {analyticsData.charts.listingsByCategory.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={ANALYTICS_COLORS[index % ANALYTICS_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>

        {/* Export Section */}
        <div className="mt-8 bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Export Analytics</h3>
          <div className="flex space-x-4">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={() => analyticsAPI.exportAnalytics('csv')}
            >
              Export as CSV
            </button>
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={() => analyticsAPI.exportAnalytics('pdf')}
            >
              Export as PDF
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AnalyticsInsights;