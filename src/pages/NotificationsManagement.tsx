import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import MainLayout from '../components/MainLayout';
import { notificationAPI } from '../services/notificationService';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'system-wide' | 'campus-specific' | 'category-specific';
  campus?: string;
  category?: string;
  createdAt: string;
  sentAt?: string;
  status: 'draft' | 'scheduled' | 'sent';
  recipients: number;
}

const NotificationsManagement: React.FC = () => {
  const { adminUser } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newNotification, setNewNotification] = useState({
    title: '',
    message: '',
    type: 'system-wide' as 'system-wide' | 'campus-specific' | 'category-specific',
    campus: '',
    category: '',
  });
  const [showSendModal, setShowSendModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch notifications from API
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const filters = {
        search: searchTerm,
        type: filterType,
        status: filterStatus
      };

      const response = await notificationAPI.getNotifications(filters);
      if (response && response.data) {
        setNotifications(response.data);
        setFilteredNotifications(response.data);
      } else {
        setNotifications([]);
        setFilteredNotifications([]);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Apply filters
  useEffect(() => {
    fetchNotifications();
  }, [searchTerm, filterType, filterStatus]);

  const handleCreateNotification = async () => {
    if (newNotification.title && newNotification.message) {
      try {
        const notificationData = {
          title: newNotification.title,
          message: newNotification.message,
          type: newNotification.type,
          ...(newNotification.campus && { campus: newNotification.campus }),
          ...(newNotification.category && { category: newNotification.category }),
          status: 'draft'
        };

        const response = await notificationAPI.createNotification(notificationData);
        if (response) {
          // Refresh the notifications list
          await fetchNotifications();
        }

        setNewNotification({
          title: '',
          message: '',
          type: 'system-wide',
          campus: '',
          category: '',
        });
        setShowCreateModal(false);
      } catch (error) {
        console.error('Error creating notification:', error);
      }
    }
  };

  const sendNotification = (notification: Notification) => {
    setSelectedNotification(notification);
    setShowSendModal(true);
  };

  const confirmSend = async () => {
    if (selectedNotification) {
      try {
        const response = await notificationAPI.sendNotification(selectedNotification.id);
        if (response) {
          // Refresh the notifications list
          await fetchNotifications();
        }
      } catch (error) {
        console.error('Error sending notification:', error);
      } finally {
        setShowSendModal(false);
      }
    }
  };

  // Get unique campuses and categories for filters
  const campuses = Array.from(new Set(notifications.map(n => n.campus).filter(Boolean) as string[]));
  const categories = Array.from(new Set(notifications.map(n => n.category).filter(Boolean) as string[]));
  const notificationTypes = ['system-wide', 'campus-specific', 'category-specific'];
  const notificationStatuses = ['draft', 'scheduled', 'sent'];

  if (!adminUser) {
    return <div>Not authenticated</div>;
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:flex lg:items-center lg:justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                Notifications Management
              </h2>
            </div>
            <div className="mt-5 flex lg:mt-0 lg:ml-4">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={() => setShowCreateModal(true)}
              >
                Create Notification
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="mt-6 bg-white shadow overflow-hidden rounded-md p-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-4">
              <div>
                <label htmlFor="search" className="block text-sm font-medium text-gray-700">
                  Search
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="search"
                    id="search"
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2"
                    placeholder="Search notifications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                  Type
                </label>
                <div className="mt-1">
                  <select
                    id="type"
                    name="type"
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                  >
                    <option value="all">All Types</option>
                    {notificationTypes.map((type, index) => (
                      <option key={index} value={type}>
                        {type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <div className="mt-1">
                  <select
                    id="status"
                    name="status"
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="all">All Statuses</option>
                    {notificationStatuses.map((status, index) => (
                      <option key={index} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={() => {
                    // Export functionality would go here
                    console.log('Export notifications data');
                  }}
                >
                  Export Data
                </button>
              </div>
            </div>
          </div>

          {/* Notifications Table */}
          <div className="mt-6 bg-white shadow overflow-hidden rounded-md">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Target
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Recipients
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredNotifications.map((notification) => (
                  <tr key={notification.id}>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{notification.title}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">{notification.message}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {notification.type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {notification.type === 'system-wide' && 'All Users'}
                      {notification.type === 'campus-specific' && `Campus: ${notification.campus}`}
                      {notification.type === 'category-specific' && `Category: ${notification.category}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {notification.recipients} users
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        notification.status === 'draft' 
                          ? 'bg-gray-100 text-gray-800' 
                          : notification.status === 'scheduled'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                      }`}>
                        {notification.status.charAt(0).toUpperCase() + notification.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {notification.createdAt}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {}} // View details would go here
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          View
                        </button>
                        {notification.status === 'draft' && (
                          <button
                            onClick={() => sendNotification(notification)}
                            className="text-green-600 hover:text-green-900"
                          >
                            Send
                          </button>
                        )}
                        {notification.status === 'draft' && (
                          <button
                            onClick={() => {}} // Edit would go here
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Edit
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredNotifications.length === 0 && (
              <div className="text-center py-10">
                <p className="text-gray-500">No notifications found matching your criteria</p>
              </div>
            )}
          </div>
        </div>
      

      {/* Create Notification Modal */}
      {showCreateModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Create New Notification
                    </h3>
                    <div className="mt-4 space-y-4">
                      <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                          Title
                        </label>
                        <input
                          type="text"
                          name="title"
                          id="title"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          value={newNotification.title}
                          onChange={(e) => setNewNotification({...newNotification, title: e.target.value})}
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                          Message
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          rows={4}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          value={newNotification.message}
                          onChange={(e) => setNewNotification({...newNotification, message: e.target.value})}
                        ></textarea>
                      </div>
                      
                      <div>
                        <label htmlFor="notificationType" className="block text-sm font-medium text-gray-700">
                          Type
                        </label>
                        <select
                          id="notificationType"
                          name="notificationType"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          value={newNotification.type}
                          onChange={(e) => setNewNotification({
                            ...newNotification, 
                            type: e.target.value as 'system-wide' | 'campus-specific' | 'category-specific',
                            campus: e.target.value === 'campus-specific' ? newNotification.campus : '',
                            category: e.target.value === 'category-specific' ? newNotification.category : ''
                          })}
                        >
                          <option value="system-wide">System-wide</option>
                          <option value="campus-specific">Campus-specific</option>
                          <option value="category-specific">Category-specific</option>
                        </select>
                      </div>
                      
                      {newNotification.type === 'campus-specific' && (
                        <div>
                          <label htmlFor="campus" className="block text-sm font-medium text-gray-700">
                            Campus
                          </label>
                          <select
                            id="campus"
                            name="campus"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            value={newNotification.campus}
                            onChange={(e) => setNewNotification({...newNotification, campus: e.target.value})}
                          >
                            <option value="">Select Campus</option>
                            <option value="University of Technology">University of Technology</option>
                            <option value="State College">State College</option>
                            <option value="University of Arts">University of Arts</option>
                          </select>
                        </div>
                      )}
                      
                      {newNotification.type === 'category-specific' && (
                        <div>
                          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                            Category
                          </label>
                          <select
                            id="category"
                            name="category"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            value={newNotification.category}
                            onChange={(e) => setNewNotification({...newNotification, category: e.target.value})}
                          >
                            <option value="">Select Category</option>
                            <option value="Electronics">Electronics</option>
                            <option value="Textbooks">Textbooks</option>
                            <option value="Furniture">Furniture</option>
                            <option value="Clothing">Clothing</option>
                            <option value="Dorm Essentials">Dorm Essentials</option>
                            <option value="Appliances">Appliances</option>
                          </select>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleCreateNotification}
                >
                  Create Draft
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Send Notification Modal */}
      {showSendModal && selectedNotification && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Send Notification
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Send the notification "{selectedNotification.title}" to {selectedNotification.recipients || 'target audience'}?
                      </p>
                      
                      <div className="mt-4">
                        <div className="text-sm font-medium text-gray-700 mb-2">Notification Details:</div>
                        <div className="bg-gray-50 p-3 rounded-md text-sm">
                          <div><span className="font-medium">Title:</span> {selectedNotification.title}</div>
                          <div><span className="font-medium">Message:</span> {selectedNotification.message}</div>
                          <div><span className="font-medium">Type:</span> {selectedNotification.type}</div>
                          <div><span className="font-medium">Target:</span> 
                            {selectedNotification.type === 'system-wide' && ' All Users'}
                            {selectedNotification.type === 'campus-specific' && ` Campus: ${selectedNotification.campus}`}
                            {selectedNotification.type === 'category-specific' && ` Category: ${selectedNotification.category}`}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={confirmSend}
                >
                  Send Notification
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowSendModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default NotificationsManagement;