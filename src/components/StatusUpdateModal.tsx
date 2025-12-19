import React from 'react';

interface StatusUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userName: string;
  onConfirm: (status: string, reason?: string, duration?: string, newRole?: string, newSellerType?: string) => void;
}

const StatusUpdateModal: React.FC<StatusUpdateModalProps> = ({ 
  isOpen, 
  onClose, 
  userId, 
  userName, 
  onConfirm 
}) => {
  if (!isOpen) return null;

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const status = formData.get('status') as string;
    const reason = formData.get('reason') as string;
    const role = formData.get('role') as string;
    const sellerType = formData.get('sellerType') as string;
    
    onConfirm(status, reason, undefined, role, sellerType);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Update User Status: {userName}
        </h3>
        
        <form onSubmit={handleConfirm}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Action
            </label>
            <select 
              name="status" 
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            >
              <option value="">Select Action</option>
              <option value="suspend">Suspend User</option>
              <option value="unsuspend">Unsuspend User</option>
              <option value="ban">Ban User</option>
              <option value="unban">Unban User</option>
              <option value="warn">Warn User</option>
              <option value="downgrade-seller">Downgrade Seller</option>
              <option value="upgrade-premium">Approve Premium</option>
              <option value="reject-premium">Reject Premium</option>
              <option value="update-role">Update Role</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Role (if applicable)
            </label>
            <select 
              name="role" 
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">Keep Current</option>
              <option value="GENERAL">General User</option>
              <option value="SELLER">Seller</option>
              <option value="PREMIUM_SELLER">Premium Seller</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Seller Type (if applicable)
            </label>
            <select 
              name="sellerType" 
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">Keep Current</option>
              <option value="NONE">None</option>
              <option value="NORMAL">Normal</option>
              <option value="PREMIUM">Premium</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reason (optional)
            </label>
            <textarea 
              name="reason"
              rows={3}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Enter reason for action..."
            ></textarea>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Confirm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StatusUpdateModal;