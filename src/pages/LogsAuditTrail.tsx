import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import MainLayout from '../components/MainLayout';
import { logsAPI } from '../services/logsService';

interface AdminLog {
  id: string;
  action: string;
  adminId: {
    name: string;
    email: string;
    role: string;
  };
  ipAddress: string;
  userAgent: string;
  details: any;
  createdAt: string;
}

const LogsAuditTrail: React.FC = () => {
  const { adminUser } = useAuth();
  const [logs, setLogs] = useState<AdminLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<AdminLog[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState<string>('all');
  const [filterAdmin, setFilterAdmin] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch logs from API
  const fetchLogs = async () => {
    try {
      setLoading(true);
      
      const filters = {
        search: searchTerm,
        action: filterAction,
        admin: filterAdmin,
        page,
        limit
      };
      
      const response = await logsAPI.getAdminLogs(filters);
      if (response && response.data) {
        setLogs(response.data);
        setFilteredLogs(response.data);
        setTotalPages(Math.ceil(response.total / limit));
      } else {
        setLogs([]);
        setFilteredLogs([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [searchTerm, filterAction, filterAdmin, page]);

  // Apply filters
  useEffect(() => {
    let result = [...logs];

    // Apply search filter
    if (searchTerm) {
      result = result.filter(log =>
        log.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.adminId.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.adminId.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply action filter
    if (filterAction !== 'all') {
      result = result.filter(log => log.action === filterAction);
    }

    // Apply admin filter
    if (filterAdmin !== 'all') {
      result = result.filter(log => log.adminId.email === filterAdmin);
    }

    setFilteredLogs(result);
  }, [searchTerm, filterAction, filterAdmin, logs]);

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

  // Get unique actions and admin users for filters
  const actions = Array.from(new Set(logs.map(log => log.action)));
  const admins = Array.from(new Set(logs.map(log => log.adminId.email)));

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:flex lg:items-center lg:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Logs & Audit Trail
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
                  placeholder="Search logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="action" className="block text-sm font-medium text-gray-700">
                Action Type
              </label>
              <div className="mt-1">
                <select
                  id="action"
                  name="action"
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2"
                  value={filterAction}
                  onChange={(e) => setFilterAction(e.target.value)}
                >
                  <option value="all">All Actions</option>
                  {actions.map((action, index) => (
                    <option key={index} value={action}>
                      {action.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="admin" className="block text-sm font-medium text-gray-700">
                Admin User
              </label>
              <div className="mt-1">
                <select
                  id="admin"
                  name="admin"
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2"
                  value={filterAdmin}
                  onChange={(e) => setFilterAdmin(e.target.value)}
                >
                  <option value="all">All Admins</option>
                  {admins.map((admin, index) => (
                    <option key={index} value={admin}>{admin}</option>
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
                  console.log('Export logs data');
                }}
              >
                Export Logs
              </button>
            </div>
          </div>
        </div>

        {/* Logs Table */}
        <div className="mt-6 bg-white shadow overflow-hidden rounded-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Admin
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  IP Address
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Details
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLogs.map((log, index) => (
                <tr key={log.id || `log-${index}`} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {log.action.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{log.adminId.name}</div>
                    <div className="text-sm text-gray-500">{log.adminId.role}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {log.ipAddress}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div className="max-w-xs truncate">
                      {log.details ? JSON.stringify(log.details) : 'No details'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredLogs.length === 0 && (
            <div className="text-center py-10">
              <p className="text-gray-500">No logs found matching your criteria</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">{(page - 1) * limit + 1}</span> to{' '}
            <span className="font-medium">
              {Math.min(page * limit, logs.length)}
            </span>{' '}
            of <span className="font-medium">{logs.length}</span> results
          </div>
          <div className="flex space-x-2">
            <button
              type="button"
              className={`inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                page === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </button>
            <button
              type="button"
              className={`inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                page === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default LogsAuditTrail;