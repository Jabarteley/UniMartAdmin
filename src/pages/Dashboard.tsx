import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useWebSocket } from '../context/WebSocketContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import MainLayout from '../components/MainLayout';
import { dashboardAPI } from '../services/dashboardService';

const Dashboard: React.FC = () => {
  const { adminUser } = useAuth();
  const { isConnected, subscribe, unsubscribe } = useWebSocket();
  const [stats, setStats] = useState({
    totalUsers: 0,
    verifiedUsers: 0,
    activeListings: 0,
    completedDeals: 0,
    reportedIssues: 0,
    bannedUsers: 0,
    generalUsers: 0,
    sellers: 0,
    premiumSellers: 0,
    pendingListings: 0,
    suspendedListings: 0,
    pendingVerifications: 0,
    trustScoreAverage: 0,
    activeChats: 0
  });
  const [dealsPerDayData, setDealsPerDayData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [realTimeNotifications, setRealTimeNotifications] = useState<string[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Set up real-time updates via WebSocket
  useEffect(() => {
    const handleNewDeal = (data: any) => {
      setStats(prev => ({
        ...prev,
        completedDeals: prev.completedDeals + 1
      }));
      addNotification(`New deal completed: ${data.itemTitle}`);
    };

    const handleNewListing = (data: any) => {
      setStats(prev => ({
        ...prev,
        activeListings: prev.activeListings + 1
      }));
      addNotification(`New listing created: ${data.title}`);
    };

    const handleNewUser = (data: any) => {
      setStats(prev => ({
        ...prev,
        totalUsers: prev.totalUsers + 1
      }));
      addNotification(`New user registered: ${data.name}`);
    };

    const handleNewReport = (data: any) => {
      setStats(prev => ({
        ...prev,
        reportedIssues: prev.reportedIssues + 1
      }));
      addNotification(`New report filed: ${data.type}`);
    };

    // Subscribe to WebSocket events
    subscribe('new-deal', handleNewDeal);
    subscribe('new-listing', handleNewListing);
    subscribe('new-user', handleNewUser);
    subscribe('new-report', handleNewReport);

    // Clean up subscriptions
    return () => {
      unsubscribe('new-deal', handleNewDeal);
      unsubscribe('new-listing', handleNewListing);
      unsubscribe('new-user', handleNewUser);
      unsubscribe('new-report', handleNewReport);
    };
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // In a real implementation, we would fetch from the API
      // const response = await dashboardAPI.getDashboardStats();
      // if (response) {
      //   setStats(response);
      // }
      
      // For now, using mock data
      setStats({
        totalUsers: 1245,
        verifiedUsers: 987,
        activeListings: 892,
        completedDeals: 634,
        reportedIssues: 23,
        bannedUsers: 5,
        generalUsers: 821,
        sellers: 342,
        premiumSellers: 82,
        pendingListings: 45,
        suspendedListings: 12,
        pendingVerifications: 18,
        trustScoreAverage: 78.5,
        activeChats: 1205
      });

      // Mock data for charts
      setDealsPerDayData([
        { day: 'Mon', deals: 45 },
        { day: 'Tue', deals: 52 },
        { day: 'Wed', deals: 38 },
        { day: 'Thu', deals: 61 },
        { day: 'Fri', deals: 58 },
        { day: 'Sat', deals: 72 },
        { day: 'Sun', deals: 49 }
      ]);

      setCategoryData([
        { name: 'Electronics', listings: 210 },
        { name: 'Textbooks', listings: 185 },
        { name: 'Furniture', listings: 142 },
        { name: 'Clothing', listings: 98 },
        { name: 'Appliances', listings: 87 },
        { name: 'Bikes', listings: 65 },
        { name: 'Other', listings: 105 }
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const addNotification = (message: string) => {
    setRealTimeNotifications(prev => [message, ...prev.slice(0, 4)]);
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
      </MainLayout>
    );
  }

  if (!adminUser) {
    return <div>Not authenticated</div>;
  }

  // Colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:flex lg:items-center lg:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Admin Dashboard
            </h2>
            <p className="mt-1 text-sm text-gray-500">Welcome back, {adminUser.email}</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">{stats.totalUsers}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Verified Users</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">{stats.verifiedUsers}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Active Listings</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">{stats.activeListings}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Completed Deals</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">{stats.completedDeals}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Pending Verifications</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">{stats.pendingVerifications}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-red-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Reported Issues</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">{stats.reportedIssues}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-teal-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Trust Score Avg</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">{stats.trustScoreAverage}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Deals Per Day</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dealsPerDayData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="deals" fill="#8884d8" name="Deals" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Listings by Category</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="listings"
                  nameKey="name"
                  label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : '0'}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Real-time notifications */}
        <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Real-time Activity</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Recent activities in the system</p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <ul className="divide-y divide-gray-200">
              {realTimeNotifications.length > 0 ? (
                realTimeNotifications.map((notification, index) => (
                  <li key={index} className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">{notification}</p>
                        <p className="text-sm text-gray-500">Just now</p>
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <li className="px-6 py-4 text-center text-gray-500">
                  No recent activity
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;