import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import MainLayout from '../components/MainLayout';
import { reportsAPI } from '../services/reportService';

interface Report {
  id: string;
  type: 'Non-payment' | 'Item not delivered' | 'Fake listing' | 'Harassment' | 'Scam attempt';
  reportedUsers: string[]; // Array of user IDs involved
  chatContext: string;
  evidenceImages: string[];
  reportAge: string;
  status: 'Pending' | 'In Review' | 'Resolved';
  createdAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
  resolutionNote?: string;
}

const ReportsDisputeResolution: React.FC = () => {
  const { adminUser } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showResolutionModal, setShowResolutionModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [resolutionAction, setResolutionAction] = useState<'dismiss' | 'warn' | 'suspend' | 'ban'>('dismiss');
  const [resolutionNote, setResolutionNote] = useState('');
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch reports from API
  const fetchReports = async () => {
    try {
      setLoading(true);
      const filters = {
        search: searchTerm,
        type: filterType,
        status: filterStatus
      };

      const response = await reportsAPI.getReports(filters);
      if (response && response.data) {
        setReports(response.data);
        setFilteredReports(response.data);
      } else {
        setReports([]);
        setFilteredReports([]);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // Apply filters
  useEffect(() => {
    fetchReports();
  }, [searchTerm, filterType, filterStatus]);

  const handleResolution = (report: Report, action: 'dismiss' | 'warn' | 'suspend' | 'ban') => {
    setSelectedReport(report);
    setResolutionAction(action);
    setShowResolutionModal(true);
  };

  const confirmResolution = async () => {
    if (selectedReport) {
      try {
        // Prepare targets array based on the selected report
        const targets = selectedReport.reportedUsers.map(userId => ({
          userId,
          action: resolutionAction
        }));

        const response = await reportsAPI.resolveReport(
          selectedReport.id,
          resolutionAction,
          resolutionNote,
          targets
        );

        if (response) {
          // Refresh the reports list
          await fetchReports();
        }
      } catch (error) {
        console.error('Error resolving report:', error);
      } finally {
        setShowResolutionModal(false);
        setResolutionNote('');
      }
    }
  };

  const showImage = (image: string) => {
    setSelectedImage(image);
    setShowImageModal(true);
  };

  // Get unique report types for filter
  const reportTypes = Array.from(new Set(reports.map(report => report.type)));

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
                Reports & Dispute Resolution
              </h2>
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
                    placeholder="Report ID, User ID, or Type"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                  Report Type
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
                    {reportTypes.map((type, index) => (
                      <option key={index} value={type}>{type}</option>
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
                    <option value="Pending">Pending</option>
                    <option value="In Review">In Review</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={() => {
                    // Export functionality would go here
                    console.log('Export reports data');
                  }}
                >
                  Export Data
                </button>
              </div>
            </div>
          </div>

          {/* Reports Table */}
          <div className="mt-6 bg-white shadow overflow-hidden rounded-md">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Report ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Users Involved
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Evidence
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Age
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredReports.map((report) => (
                  <tr key={report.id} className={report.status === 'Pending' ? 'bg-yellow-50' : report.status === 'Resolved' ? 'bg-green-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {report.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {report.type}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {report.reportedUsers.map(user => (
                        <div key={user} className="font-medium">{user}</div>
                      ))}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {report.evidenceImages.length > 0 ? (
                        <div className="flex space-x-1">
                          {report.evidenceImages.map((img, idx) => (
                            <button 
                              key={idx}
                              className="text-indigo-600 hover:text-indigo-900"
                              onClick={() => showImage(img)}
                            >
                              #{idx + 1}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400">No images</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {report.reportAge}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        report.status === 'Pending' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : report.status === 'In Review'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-green-100 text-green-800'
                      }`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {}} // View details would go here
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          View
                        </button>
                        {report.status === 'Pending' && (
                          <>
                            <button
                              onClick={() => handleResolution(report, 'dismiss')}
                              className="text-gray-600 hover:text-gray-900"
                            >
                              Dismiss
                            </button>
                            <button
                              onClick={() => handleResolution(report, 'warn')}
                              className="text-yellow-600 hover:text-yellow-900"
                            >
                              Warn
                            </button>
                            <button
                              onClick={() => handleResolution(report, 'suspend')}
                              className="text-orange-600 hover:text-orange-900"
                            >
                              Suspend
                            </button>
                            <button
                              onClick={() => handleResolution(report, 'ban')}
                              className="text-red-600 hover:text-red-900"
                            >
                              Ban
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredReports.length === 0 && (
              <div className="text-center py-10">
                <p className="text-gray-500">No reports found matching your criteria</p>
              </div>
            )}
          </div>
        </div>
     

      {/* Resolution Modal */}
      {showResolutionModal && selectedReport && (
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
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {resolutionAction === 'dismiss' 
                        ? 'Dismiss Report' 
                        : resolutionAction === 'warn'
                          ? 'Warn User(s)'
                          : resolutionAction === 'suspend'
                            ? 'Suspend User(s)'
                            : 'Ban User'}
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        {resolutionAction === 'dismiss' 
                          ? `Dismiss report "${selectedReport.type}" (ID: ${selectedReport.id})?`
                          : resolutionAction === 'warn'
                            ? `Issue warning for report "${selectedReport.type}" (ID: ${selectedReport.id})?`
                            : resolutionAction === 'suspend'
                              ? `Suspend users involved in report "${selectedReport.type}" (ID: ${selectedReport.id})?`
                              : `Permanently ban user from report "${selectedReport.type}" (ID: ${selectedReport.id})?`}
                      </p>
                      
                      <div className="mt-4">
                        <div className="text-sm font-medium text-gray-700 mb-2">Report Details:</div>
                        <div className="bg-gray-50 p-3 rounded-md text-sm">
                          <div><span className="font-medium">Type:</span> {selectedReport.type}</div>
                          <div><span className="font-medium">Users:</span> {selectedReport.reportedUsers.join(', ')}</div>
                          <div><span className="font-medium">Context:</span> {selectedReport.chatContext}</div>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <label htmlFor="resolutionNote" className="block text-sm font-medium text-gray-700">
                          Resolution Note (Internal)
                        </label>
                        <textarea
                          id="resolutionNote"
                          name="resolutionNote"
                          rows={3}
                          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          value={resolutionNote}
                          onChange={(e) => setResolutionNote(e.target.value)}
                          placeholder="Add internal notes about this resolution..."
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm ${
                    resolutionAction === 'dismiss' 
                      ? 'bg-gray-600 hover:bg-gray-700 focus:ring-gray-500' 
                      : resolutionAction === 'warn'
                        ? 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500'
                        : resolutionAction === 'suspend'
                          ? 'bg-orange-600 hover:bg-orange-700 focus:ring-orange-500'
                          : 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                  }`}
                  onClick={confirmResolution}
                >
                  {resolutionAction === 'dismiss' 
                    ? 'Dismiss Report' 
                    : resolutionAction === 'warn'
                      ? 'Warn User(s)'
                      : resolutionAction === 'suspend'
                        ? 'Suspend User(s)'
                        : 'Ban User'}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => {
                    setShowResolutionModal(false);
                    setResolutionNote('');
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {showImageModal && (
        <div className="fixed z-50 inset-0 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 transition-opacity" aria-hidden="true">
            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>

          <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="w-full">
                  <img
                    src={selectedImage}
                    alt="Evidence"
                    className="max-w-full h-auto rounded-md"
                  />
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="button"
                className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                onClick={() => setShowImageModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default ReportsDisputeResolution;