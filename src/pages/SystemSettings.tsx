import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import MainLayout from '../components/MainLayout';
import { settingsAPI } from '../services/settingsService';

const SystemSettings: React.FC = () => {
  const { adminUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'general' | 'deals' | 'verification' | 'notifications'>('general');

  // General settings
  const [generalSettings, setGeneralSettings] = useState({
    dealConfirmationTimeout: 24,
    maxActiveChatsPerUser: 10,
    maxListingsPerUser: 10,
    userRatingThreshold: 3.0,
    scamDetectionEnabled: true,
    autoBanScammers: true
  });

  // Deal settings
  const [dealSettings, setDealSettings] = useState({
    confirmationTimeoutHours: 24,
    maxNegotiationRounds: 5,
    requireEscrow: false,
    escrowPercentage: 0.05,
    maxDealAmount: 1000000,
    disputeResolutionDays: 7
  });

  // Verification settings
  const [verificationSettings, setVerificationSettings] = useState({
    requireVerificationForListings: true,
    requireVerificationForDeals: false,
    verificationValidityDays: 365,
    allowStudentEmails: true,
    allowedUniversities: ['University of Technology', 'State College', 'University of Arts']
  });

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotificationsEnabled: true,
    pushNotificationsEnabled: true,
    smsNotificationsEnabled: false,
    notificationFrequency: 'immediate',
    autoMuteSpamUsers: true
  });

  // New settings based on UniMart requirements
  const [monetizationSettings, setMonetizationSettings] = useState({
    sellerSignUpFee: 5000, // in naira
    premiumSellerFee: 10000, // in naira
    commissionPercentage: 2.5, // of deal amount
    expensiveItemThreshold: 100000, // items above this get reviewed
    freeListingsPerSeller: 5
  });

  const [safetySettings, setSafetySettings] = useState({
    trustScoreThreshold: 70, // minimum trust score for certain actions
    requirePhoneVerification: false,
    enableChatDisclaimers: true,
    maxTrustScoreIncrease: 5,
    maxTrustScoreDecrease: 10
  });

  // Fetch settings from API
  const fetchSettings = async () => {
    try {
      setLoading(true);
      // In a real implementation, we would fetch settings from the API
      // const response = await settingsAPI.getGeneralSettings();
      // if (response) {
      //   setGeneralSettings(response.general);
      //   setDealSettings(response.deals);
      //   setVerificationSettings(response.verification);
      //   setNotificationSettings(response.notifications);
      // }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // Handle saving settings
  const handleSaveSettings = async () => {
    try {
      setLoading(true);
      // In a real implementation, we would call the API to save settings
      // const response = await settingsAPI.updateGeneralSettings({
      //   general: generalSettings,
      //   deals: dealSettings,
      //   verification: verificationSettings,
      //   notifications: notificationSettings
      // });
      console.log('Settings saved', {
        general: generalSettings,
        deals: dealSettings,
        verification: verificationSettings,
        notifications: notificationSettings
      });
      setLoading(false);
    } catch (error) {
      console.error('Error saving settings:', error);
      setLoading(false);
    }
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

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:flex lg:items-center lg:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              System Settings
            </h2>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-4 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('general')}
              className={`${
                activeTab === 'general'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              General
            </button>
            <button
              onClick={() => setActiveTab('deals')}
              className={`${
                activeTab === 'deals'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Deals
            </button>
            <button
              onClick={() => setActiveTab('verification')}
              className={`${
                activeTab === 'verification'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Verification
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`${
                activeTab === 'notifications'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Notifications
            </button>
          </nav>
        </div>

        {/* Settings Content */}
        <div className="mt-6 bg-white shadow overflow-hidden rounded-md p-6">
          {activeTab === 'general' && (
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-6">General Settings</h3>
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="dealConfirmationTimeout" className="block text-sm font-medium text-gray-700">
                    Deal Confirmation Timeout (hours)
                  </label>
                  <div className="mt-1">
                    <input
                      type="number"
                      name="dealConfirmationTimeout"
                      id="dealConfirmationTimeout"
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2"
                      value={generalSettings.dealConfirmationTimeout}
                      onChange={(e) => setGeneralSettings({
                        ...generalSettings,
                        dealConfirmationTimeout: parseInt(e.target.value) || 0
                      })}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="maxActiveChatsPerUser" className="block text-sm font-medium text-gray-700">
                    Max Active Chats Per User
                  </label>
                  <div className="mt-1">
                    <input
                      type="number"
                      name="maxActiveChatsPerUser"
                      id="maxActiveChatsPerUser"
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2"
                      value={generalSettings.maxActiveChatsPerUser}
                      onChange={(e) => setGeneralSettings({
                        ...generalSettings,
                        maxActiveChatsPerUser: parseInt(e.target.value) || 0
                      })}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="maxListingsPerUser" className="block text-sm font-medium text-gray-700">
                    Max Listings Per User
                  </label>
                  <div className="mt-1">
                    <input
                      type="number"
                      name="maxListingsPerUser"
                      id="maxListingsPerUser"
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2"
                      value={generalSettings.maxListingsPerUser}
                      onChange={(e) => setGeneralSettings({
                        ...generalSettings,
                        maxListingsPerUser: parseInt(e.target.value) || 0
                      })}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="userRatingThreshold" className="block text-sm font-medium text-gray-700">
                    User Rating Threshold
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <input
                      type="number"
                      name="userRatingThreshold"
                      id="userRatingThreshold"
                      step="0.1"
                      className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-3 pr-12 sm:text-sm border-gray-300 rounded-md"
                      value={generalSettings.userRatingThreshold}
                      onChange={(e) => setGeneralSettings({
                        ...generalSettings,
                        userRatingThreshold: parseFloat(e.target.value) || 0
                      })}
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">/ 5</span>
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="scamDetectionEnabled"
                        name="scamDetectionEnabled"
                        type="checkbox"
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                        checked={generalSettings.scamDetectionEnabled}
                        onChange={(e) => setGeneralSettings({
                          ...generalSettings,
                          scamDetectionEnabled: e.target.checked
                        })}
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="scamDetectionEnabled" className="font-medium text-gray-700">
                        Enable Scam Detection
                      </label>
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="autoBanScammers"
                        name="autoBanScammers"
                        type="checkbox"
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                        checked={generalSettings.autoBanScammers}
                        onChange={(e) => setGeneralSettings({
                          ...generalSettings,
                          autoBanScammers: e.target.checked
                        })}
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="autoBanScammers" className="font-medium text-gray-700">
                        Automatically Ban Scammers
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'deals' && (
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-6">Deal Settings</h3>
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="confirmationTimeoutHours" className="block text-sm font-medium text-gray-700">
                    Confirmation Timeout (hours)
                  </label>
                  <div className="mt-1">
                    <input
                      type="number"
                      name="confirmationTimeoutHours"
                      id="confirmationTimeoutHours"
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2"
                      value={dealSettings.confirmationTimeoutHours}
                      onChange={(e) => setDealSettings({
                        ...dealSettings,
                        confirmationTimeoutHours: parseInt(e.target.value) || 0
                      })}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="maxNegotiationRounds" className="block text-sm font-medium text-gray-700">
                    Max Negotiation Rounds
                  </label>
                  <div className="mt-1">
                    <input
                      type="number"
                      name="maxNegotiationRounds"
                      id="maxNegotiationRounds"
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2"
                      value={dealSettings.maxNegotiationRounds}
                      onChange={(e) => setDealSettings({
                        ...dealSettings,
                        maxNegotiationRounds: parseInt(e.target.value) || 0
                      })}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="maxDealAmount" className="block text-sm font-medium text-gray-700">
                    Max Deal Amount (₦)
                  </label>
                  <div className="mt-1">
                    <input
                      type="number"
                      name="maxDealAmount"
                      id="maxDealAmount"
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2"
                      value={dealSettings.maxDealAmount}
                      onChange={(e) => setDealSettings({
                        ...dealSettings,
                        maxDealAmount: parseInt(e.target.value) || 0
                      })}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="disputeResolutionDays" className="block text-sm font-medium text-gray-700">
                    Dispute Resolution (days)
                  </label>
                  <div className="mt-1">
                    <input
                      type="number"
                      name="disputeResolutionDays"
                      id="disputeResolutionDays"
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2"
                      value={dealSettings.disputeResolutionDays}
                      onChange={(e) => setDealSettings({
                        ...dealSettings,
                        disputeResolutionDays: parseInt(e.target.value) || 0
                      })}
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="requireEscrow"
                        name="requireEscrow"
                        type="checkbox"
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                        checked={dealSettings.requireEscrow}
                        onChange={(e) => setDealSettings({
                          ...dealSettings,
                          requireEscrow: e.target.checked
                        })}
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="requireEscrow" className="font-medium text-gray-700">
                        Require Escrow for Deals
                      </label>
                    </div>
                  </div>
                </div>

                {dealSettings.requireEscrow && (
                  <div className="sm:col-span-2">
                    <label htmlFor="escrowPercentage" className="block text-sm font-medium text-gray-700">
                      Escrow Percentage (%)
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <input
                        type="number"
                        name="escrowPercentage"
                        id="escrowPercentage"
                        step="0.01"
                        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-3 pr-12 sm:text-sm border-gray-300 rounded-md"
                        value={dealSettings.escrowPercentage}
                        onChange={(e) => setDealSettings({
                          ...dealSettings,
                          escrowPercentage: parseFloat(e.target.value) || 0
                        })}
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">% of deal amount</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'verification' && (
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-6">Verification Settings</h3>
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="verificationValidityDays" className="block text-sm font-medium text-gray-700">
                    Verification Validity (days)
                  </label>
                  <div className="mt-1">
                    <input
                      type="number"
                      name="verificationValidityDays"
                      id="verificationValidityDays"
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2"
                      value={verificationSettings.verificationValidityDays}
                      onChange={(e) => setVerificationSettings({
                        ...verificationSettings,
                        verificationValidityDays: parseInt(e.target.value) || 0
                      })}
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="requireVerificationForListings"
                        name="requireVerificationForListings"
                        type="checkbox"
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                        checked={verificationSettings.requireVerificationForListings}
                        onChange={(e) => setVerificationSettings({
                          ...verificationSettings,
                          requireVerificationForListings: e.target.checked
                        })}
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="requireVerificationForListings" className="font-medium text-gray-700">
                        Require Verification for Listings
                      </label>
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="requireVerificationForDeals"
                        name="requireVerificationForDeals"
                        type="checkbox"
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                        checked={verificationSettings.requireVerificationForDeals}
                        onChange={(e) => setVerificationSettings({
                          ...verificationSettings,
                          requireVerificationForDeals: e.target.checked
                        })}
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="requireVerificationForDeals" className="font-medium text-gray-700">
                        Require Verification for Deals
                      </label>
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="allowStudentEmails"
                        name="allowStudentEmails"
                        type="checkbox"
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                        checked={verificationSettings.allowStudentEmails}
                        onChange={(e) => setVerificationSettings({
                          ...verificationSettings,
                          allowStudentEmails: e.target.checked
                        })}
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="allowStudentEmails" className="font-medium text-gray-700">
                        Allow Student Email Verification
                      </label>
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="allowedUniversities" className="block text-sm font-medium text-gray-700">
                    Allowed Universities
                  </label>
                  <textarea
                    id="allowedUniversities"
                    name="allowedUniversities"
                    rows={4}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 mt-1"
                    value={verificationSettings.allowedUniversities.join('\n')}
                    onChange={(e) => setVerificationSettings({
                      ...verificationSettings,
                      allowedUniversities: e.target.value.split('\n').filter(u => u.trim() !== '')
                    })}
                    placeholder="Enter one university per line"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-6">Notification Settings</h3>
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="emailNotificationsEnabled"
                        name="emailNotificationsEnabled"
                        type="checkbox"
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                        checked={notificationSettings.emailNotificationsEnabled}
                        onChange={(e) => setNotificationSettings({
                          ...notificationSettings,
                          emailNotificationsEnabled: e.target.checked
                        })}
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="emailNotificationsEnabled" className="font-medium text-gray-700">
                        Enable Email Notifications
                      </label>
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="pushNotificationsEnabled"
                        name="pushNotificationsEnabled"
                        type="checkbox"
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                        checked={notificationSettings.pushNotificationsEnabled}
                        onChange={(e) => setNotificationSettings({
                          ...notificationSettings,
                          pushNotificationsEnabled: e.target.checked
                        })}
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="pushNotificationsEnabled" className="font-medium text-gray-700">
                        Enable Push Notifications
                      </label>
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="smsNotificationsEnabled"
                        name="smsNotificationsEnabled"
                        type="checkbox"
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                        checked={notificationSettings.smsNotificationsEnabled}
                        onChange={(e) => setNotificationSettings({
                          ...notificationSettings,
                          smsNotificationsEnabled: e.target.checked
                        })}
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="smsNotificationsEnabled" className="font-medium text-gray-700">
                        Enable SMS Notifications
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="notificationFrequency" className="block text-sm font-medium text-gray-700">
                    Notification Frequency
                  </label>
                  <div className="mt-1">
                    <select
                      id="notificationFrequency"
                      name="notificationFrequency"
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2"
                      value={notificationSettings.notificationFrequency}
                      onChange={(e) => setNotificationSettings({
                        ...notificationSettings,
                        notificationFrequency: e.target.value
                      })}
                    >
                      <option value="immediate">Immediate</option>
                      <option value="daily">Daily Digest</option>
                      <option value="weekly">Weekly Digest</option>
                    </select>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="autoMuteSpamUsers"
                        name="autoMuteSpamUsers"
                        type="checkbox"
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                        checked={notificationSettings.autoMuteSpamUsers}
                        onChange={(e) => setNotificationSettings({
                          ...notificationSettings,
                          autoMuteSpamUsers: e.target.checked
                        })}
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="autoMuteSpamUsers" className="font-medium text-gray-700">
                        Automatically Mute Spam Users
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Save Button */}
        <div className="mt-6 bg-white shadow overflow-hidden rounded-md p-6">
          <div className="flex justify-end">
            <button
              type="button"
              className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={handleSaveSettings}
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default SystemSettings;