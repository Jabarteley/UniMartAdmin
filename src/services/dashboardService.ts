import { apiCall } from '../utils/api';

// Dashboard API service
export const dashboardAPI = {
  // Get dashboard overview statistics
  getDashboardStats: async () => {
    const response = await apiCall('/admin/analytics');
    if (!response) return null;

    const data = await response.json();

    // Handle different possible response structures
    if (data.data && data.data.analytics) {
      // Handle structure where analytics is nested under data
      const analytics = data.data.analytics;
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
    } else {
      // Handle flattened structure
      const analytics = data.analytics || data;
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
  },

  // Get deals per day for the last 7 days
  getDealsPerDay: async () => {
    const response = await apiCall('/admin/analytics');
    if (!response) return null;

    const data = await response.json();

    if (data.data && data.data.dealsPerDay) {
      return data.data.dealsPerDay;
    } else if (data.dealsPerDay) {
      return data.dealsPerDay;
    } else if (data.data && data.data.analytics && data.data.analytics.charts) {
      return data.data.analytics.charts.dealsPerDay || [];
    } else {
      // Default to empty array if no matching structure found
      return [];
    }
  },

  // Get listings by category
  getListingByCategory: async () => {
    const response = await apiCall('/admin/analytics');
    if (!response) return null;

    const data = await response.json();

    if (data.data && data.data.listingsByCategory) {
      return data.data.listingsByCategory;
    } else if (data.listingsByCategory) {
      return data.listingsByCategory;
    } else if (data.data && data.data.analytics && data.data.analytics.charts) {
      return data.data.analytics.charts.listingsByCategory || [];
    } else {
      // Default to empty array if no matching structure found
      return [];
    }
  },

  // Get campus activity
  getCampusActivity: async () => {
    const response = await apiCall('/admin/analytics');
    if (!response) return null;

    const data = await response.json();

    if (data.data && data.data.campusActivity) {
      return data.data.campusActivity;
    } else if (data.campusActivity) {
      return data.campusActivity;
    } else if (data.data && data.data.analytics && data.data.analytics.charts) {
      return data.data.analytics.charts.campusActivity || [];
    } else {
      // Default to empty array if no matching structure found
      return [];
    }
  },

  // Get scam reports trend
  getScamReportsTrend: async () => {
    const response = await apiCall('/admin/analytics');
    if (!response) return null;

    const data = await response.json();

    if (data.data && data.data.scamReportsTrend) {
      return data.data.scamReportsTrend;
    } else if (data.scamReportsTrend) {
      return data.scamReportsTrend;
    } else if (data.data && data.data.analytics && data.data.analytics.charts) {
      return data.data.analytics.charts.scamReportsTrend || [];
    } else {
      // Default to empty array if no matching structure found
      return [];
    }
  },
};