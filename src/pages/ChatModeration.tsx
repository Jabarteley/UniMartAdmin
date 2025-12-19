import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import MainLayout from '../components/MainLayout';
import { chatAPI } from '../services/chatService';
import { Chat, Message } from '../types';

// Updated interface to match new backend schema
interface ReportedChat {
  id: string;
  chatId: string;
  reportedUsers: string[];
  messages: Message[];
  reportType: string;
  reportReason: string;
  reportDate: string;
  status: 'PENDING' | 'REVIEWED' | 'RESOLVED';
  listingId: string;
  buyerId: string;
  sellerId: string;
}

const ChatModeration: React.FC = () => {
  const { adminUser } = useAuth();
  const [reportedChats, setReportedChats] = useState<ReportedChat[]>([]);
  const [filteredChats, setFilteredChats] = useState<ReportedChat[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedChat, setSelectedChat] = useState<ReportedChat | null>(null);
  const [showChatModal, setShowChatModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState<'warn' | 'suspend' | 'ban'>('warn');
  const [actionReason, setActionReason] = useState('');
  const [loading, setLoading] = useState(true);
  const [totalChats, setTotalChats] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch reported chats from API
  const fetchReportedChats = async () => {
    try {
      setLoading(true);
      const filters = {
        search: searchTerm,
        status: filterStatus,
        page: currentPage,
        limit: 10
      };

      // Note: In a real implementation, we would have an API call for reported chats
      // const response = await chatAPI.getReportedChats(filters);
      // if (response && response.data) {
      //   setReportedChats(response.data);
      //   setFilteredChats(response.data);
      //   setTotalChats(response.total || 0);
      //   setTotalPages(response.pages || 1);
      // } else {
      setReportedChats([]);
      setFilteredChats([]);
      setTotalChats(0);
      setTotalPages(1);
      // }
    } catch (error) {
      console.error('Error fetching reported chats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportedChats();
  }, [searchTerm, filterStatus, currentPage]);

  // Apply filters
  useEffect(() => {
    let result = [...reportedChats];

    // Apply search filter
    if (searchTerm) {
      result = result.filter(chat =>
        chat.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chat.reportReason.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chat.reportedUsers.some(user => user.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply status filter
    if (filterStatus !== 'all') {
      result = result.filter(chat => chat.status === filterStatus);
    }

    setFilteredChats(result);
  }, [searchTerm, filterStatus, reportedChats]);

  // Handle chat action
  const handleChatAction = () => {
    if (!selectedChat) return;

    // In a real implementation, we would call an API to take action
    console.log(`Taking action: ${actionType} on chat ${selectedChat.id} for reason: ${actionReason}`);

    // Close modal and refresh data
    setShowActionModal(false);
    setSelectedChat(null);
    setActionReason('');
    fetchReportedChats();
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
              Chat Moderation
            </h2>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Reported Chats</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">{totalChats}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          
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
                    <dt className="text-sm font-medium text-gray-500 truncate">Pending Review</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {reportedChats.filter(c => c.status === 'PENDING').length}
                      </div>
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Resolved</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {reportedChats.filter(c => c.status === 'RESOLVED').length}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-6 bg-white shadow overflow-hidden rounded-md p-6">
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-3">
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
                  placeholder="Chat ID or report reason"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
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
                  <option value="PENDING">Pending</option>
                  <option value="REVIEWED">Reviewed</option>
                  <option value="RESOLVED">Resolved</option>
                </select>
              </div>
            </div>

            <div className="flex items-end">
              <button
                onClick={fetchReportedChats}
                className="w-full inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>

        {/* Reported Chats Table */}
        <div className="mt-6 bg-white shadow overflow-hidden rounded-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Chat
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Users Involved
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Report Type
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Report Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredChats.map((chat) => (
                <tr key={chat.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">Chat ID: {chat.chatId}</div>
                      <div className="text-sm text-gray-500">Listing: {chat.listingId}</div>
                      <div className="text-xs text-gray-400">
                        Buyer: {chat.buyerId}, Seller: {chat.sellerId}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {chat.reportedUsers.join(', ')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {chat.reportType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(chat.reportDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      chat.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      chat.status === 'REVIEWED' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {chat.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setSelectedChat(chat);
                          setShowChatModal(true);
                        }}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        View
                      </button>
                      <button
                        onClick={() => {
                          setSelectedChat(chat);
                          setActionType('warn');
                          setShowActionModal(true);
                        }}
                        className="text-yellow-600 hover:text-yellow-900"
                      >
                        Warn
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredChats.length === 0 && (
            <div className="text-center py-10">
              <p className="text-gray-500">No reported chats found matching your criteria</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-4">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  currentPage === 1 ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  currentPage === totalPages ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{(currentPage - 1) * 10 + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(currentPage * 10, totalChats)}
                  </span>{' '}
                  of <span className="font-medium">{totalChats}</span> results
                </p>
              </div>
              <div>
                <nav
                  className="relative z-0 inline-flex rounded-md shadow-sm -space-x-1"
                  aria-label="Pagination"
                >
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${
                      currentPage === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    Previous
                  </button>
                  {[...Array(Math.min(5, totalPages)).keys()].map((i) => {
                    const pageNum = Math.min(totalPages, Math.max(1, currentPage - 2)) + i;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === pageNum
                            ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 text-sm font-medium ${
                      currentPage === totalPages
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Chat Details Modal */}
      {showChatModal && selectedChat && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Chat Details: {selectedChat.chatId}
                    </h3>
                    <div className="mt-4">
                      <div className="border-b border-gray-200 pb-4 mb-4">
                        <div className="grid grid-cols-1 gap-y-2 gap-x-4 sm:grid-cols-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Listing ID</label>
                            <div className="mt-1 text-sm text-gray-900">{selectedChat.listingId}</div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Buyer ID</label>
                            <div className="mt-1 text-sm text-gray-900">{selectedChat.buyerId}</div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Seller ID</label>
                            <div className="mt-1 text-sm text-gray-900">{selectedChat.sellerId}</div>
                          </div>
                        </div>
                        <div className="mt-2">
                          <label className="block text-sm font-medium text-gray-700">Report Type</label>
                          <div className="mt-1 text-sm text-gray-900">{selectedChat.reportType}</div>
                        </div>
                        <div className="mt-2">
                          <label className="block text-sm font-medium text-gray-700">Report Reason</label>
                          <div className="mt-1 text-sm text-gray-900">{selectedChat.reportReason}</div>
                        </div>
                      </div>

                      {/* Chat Messages */}
                      <div className="mt-4">
                        <h4 className="text-md font-medium text-gray-900 mb-2">Messages</h4>
                        <div className="border border-gray-200 rounded-md max-h-96 overflow-y-auto">
                          {selectedChat.messages.map((message) => (
                            <div 
                              key={message.id} 
                              className={`p-4 border-b border-gray-200 ${
                                message.senderId === selectedChat.buyerId ? 'bg-blue-50' : 'bg-green-50'
                              }`}
                            >
                              <div className="flex justify-between">
                                <div className="font-medium">
                                  {message.senderId === selectedChat.buyerId ? 'Buyer' : 'Seller'} 
                                  <span className="text-xs text-gray-500 ml-2">
                                    ({message.senderId})
                                  </span>
                                </div>
                                <div className="text-xs text-gray-500">
                                  {new Date(message.sentAt).toLocaleString()}
                                </div>
                              </div>
                              <div className="mt-1">{message.message}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => {
                    setShowChatModal(false);
                    setSelectedChat(null);
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Modal */}
      {showActionModal && selectedChat && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Take Action on Chat {selectedChat.chatId}
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Take action against users involved in this chat:
                      </p>
                      
                      <div className="mt-4">
                        <label htmlFor="action-type" className="block text-sm font-medium text-gray-700">
                          Action Type
                        </label>
                        <select
                          id="action-type"
                          name="action-type"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          value={actionType}
                          onChange={(e) => setActionType(e.target.value as 'warn' | 'suspend' | 'ban')}
                        >
                          <option value="warn">Issue Warning</option>
                          <option value="suspend">Suspend User(s)</option>
                          <option value="ban">Ban User(s)</option>
                        </select>
                      </div>
                      
                      <div className="mt-4">
                        <label htmlFor="action-reason" className="block text-sm font-medium text-gray-700">
                          Reason for Action
                        </label>
                        <textarea
                          id="action-reason"
                          name="action-reason"
                          rows={3}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          value={actionReason}
                          onChange={(e) => setActionReason(e.target.value)}
                          placeholder="Enter reason for taking this action..."
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleChatAction}
                >
                  Confirm Action
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => {
                    setShowActionModal(false);
                    setSelectedChat(null);
                  }}
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

export default ChatModeration;