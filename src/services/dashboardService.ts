import { apiCall } from '../utils/api';

// Dashboard API service
export const dashboardAPI = {
  // Get dashboard overview statistics
  getDashboardStats: async () => {
    const response = await apiCall('/admin/analytics');
    if (!response) return null;

    const data = await response.json();

    if (data.analytics) {
      const analytics = data.analytics;
      return {
        totalUsers: analytics.totalUsers || 0,
        verifiedUsers: analytics.verifiedUsers || 0,
        activeListings: analytics.activeListings || 0,
        completedDeals: analytics.completedDeals || 0,
        reportedIssues: analytics.reportedIssues || 0,
        bannedUsers: analytics.bannedUsers || 0,
        generalUsers: analytics.generalUsers || 0,
        sellers: analytics.sellers || 0,
        premiumSellers: analytics.premiumSellers || 0,
        pendingListings: analytics.pendingListings || 0,
        suspendedListings: analytics.suspendedListings || 0,
        pendingVerifications: analytics.pendingVerifications || 0,
        trustScoreAverage: analytics.trustScoreAverage || 0,
        activeChats: analytics.activeChats || 0
      };
    }
    
    return null;
  },

  // Get deals per day for the last 7 days
  getDealsPerDay: async () => {
    const response = await apiCall('/admin/analytics');
    if (!response) return null;

    const data = await response.json();

    if (data.analytics && data.analytics.charts) {
      return data.analytics.charts.dealsPerDay || [];
    }
    
    return [];
  },

  // Get listings by category
  getListingByCategory: async () => {
    const response = await apiCall('/admin/analytics');
    if (!response) return null;

    const data = await response.json();

    if (data.analytics && data.analytics.charts) {
      return data.analytics.charts.listingsByCategory || [];
    }

    return [];
  },

  // Get campus activity
  getCampusActivity: async () => {
    const response = await apiCall('/admin/analytics');
    if (!response) return null;

    const data = await response.json();

    if (data.analytics && data.analytics.charts) {
      return data.analytics.charts.campusActivity || [];
    }
    
    return [];
  },

  // Get scam reports trend
  getScamReportsTrend: async () => {
    const response = await apiCall('/admin/analytics');
    if (!response) return null;

    const data = await response.json();

    if (data.analytics && data.analytics.charts) {
      return data.analytics.charts.scamReportsTrend || [];
    }

    return [];
  },
};
