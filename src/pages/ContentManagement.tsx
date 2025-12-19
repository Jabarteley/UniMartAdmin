import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import MainLayout from '../components/MainLayout';
import { cmsAPI } from '../services/cmsService';

interface Banner {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface HomePageContent {
  id: string;
  section: 'featured-categories' | 'promotional-messages' | 'safety-tips';
  title: string;
  content: string;
  items: any[]; // For featured categories
  isActive: boolean;
  updatedAt: string;
}

const ContentManagement: React.FC = () => {
  const { adminUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'banners' | 'homePage' | 'promotions'>('banners');
  const [banners, setBanners] = useState<Banner[]>([]);
  const [homePageContent, setHomePageContent] = useState<HomePageContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBannerModal, setShowBannerModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [bannerForm, setBannerForm] = useState({
    title: '',
    content: '',
    imageUrl: '',
    isActive: true
  });

  // Fetch content from API
  const fetchContent = async () => {
    try {
      setLoading(true);
      
      // Fetch banners
      const bannersResponse = await cmsAPI.getBanners();
      if (bannersResponse && bannersResponse.data) {
        setBanners(bannersResponse.data);
      }
      
      // Fetch home page content
      const homePageResponse = await cmsAPI.getHomePageContent();
      if (homePageResponse && homePageResponse.data) {
        setHomePageContent(homePageResponse.data);
      }
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const handleSaveBanner = async () => {
    try {
      if (editingBanner) {
        // Update existing banner
        const response = await cmsAPI.updateBanner(editingBanner.id, bannerForm);
        if (response) {
          // Refresh content
          await fetchContent();
        }
      } else {
        // Create new banner
        const response = await cmsAPI.createBanner(bannerForm);
        if (response) {
          // Refresh content
          await fetchContent();
        }
      }
      
      setShowBannerModal(false);
      resetBannerForm();
    } catch (error) {
      console.error('Error saving banner:', error);
    }
  };

  const handleToggleBanner = async (id: string, currentStatus: boolean) => {
    try {
      const response = await cmsAPI.updateBanner(id, { isActive: !currentStatus });
      if (response) {
        // Refresh content
        await fetchContent();
      }
    } catch (error) {
      console.error('Error toggling banner:', error);
    }
  };

  const resetBannerForm = () => {
    setBannerForm({
      title: '',
      content: '',
      imageUrl: '',
      isActive: true
    });
    setEditingBanner(null);
  };

  const openEditBanner = (banner: Banner) => {
    setEditingBanner(banner);
    setBannerForm({
      title: banner.title,
      content: banner.content,
      imageUrl: banner.imageUrl,
      isActive: banner.isActive
    });
    setShowBannerModal(true);
  };

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
              Content Management System
            </h2>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-4 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'banners'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('banners')}
            >
              Banners
            </button>
            <button
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'homePage'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('homePage')}
            >
              Home Page Content
            </button>
            <button
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'promotions'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('promotions')}
            >
              Promotions
            </button>
          </nav>
        </div>

        {activeTab === 'banners' && (
          <div className="mt-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-gray-900">App Banners</h3>
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={() => {
                  resetBannerForm();
                  setShowBannerModal(true);
                }}
              >
                Add Banner
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {banners.map((banner) => (
                <div key={banner.id} className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    {banner.imageUrl && (
                      <div className="mb-4">
                        <img
                          src={banner.imageUrl}
                          alt={banner.title}
                          className="w-full h-32 object-cover rounded-md"
                        />
                      </div>
                    )}
                    <h3 className="text-lg font-medium text-gray-900">{banner.title}</h3>
                    <p className="mt-2 text-sm text-gray-500">{banner.content}</p>
                    <div className="mt-4 flex justify-between items-center">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        banner.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {banner.isActive ? 'Active' : 'Inactive'}
                      </span>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openEditBanner(banner)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleToggleBanner(banner.id, banner.isActive)}
                          className={`${
                            banner.isActive ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'
                          }`}
                        >
                          {banner.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'homePage' && (
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Home Page Content</h3>
            <div className="grid grid-cols-1 gap-6">
              {homePageContent.map((content) => (
                <div key={content.id} className="bg-white shadow overflow-hidden rounded-md p-6">
                  <div className="flex justify-between">
                    <h4 className="text-md font-medium text-gray-900 capitalize">{content.section.replace('-', ' ')}</h4>
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      content.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {content.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-500">{content.content}</p>
                    {content.items && content.items.length > 0 && (
                      <div className="mt-4">
                        <h5 className="text-sm font-medium text-gray-700">Items:</h5>
                        <ul className="mt-2 space-y-1">
                          {content.items.map((item: any, index: number) => (
                            <li key={index} className="text-sm text-gray-500">
                              {typeof item === 'string' ? item : JSON.stringify(item)}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <div className="mt-4">
                      <button
                        onClick={() => {}} // Edit functionality would go here
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Edit Content
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'promotions' && (
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Promotional Messages</h3>
            <div className="bg-white shadow overflow-hidden rounded-md">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Content
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
                  {/* Promotional messages would be listed here */}
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Welcome Back!
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      Special discounts for returning students this semester
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => {}} // Edit functionality would go here
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Banner Modal */}
      {showBannerModal && (
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
                      {editingBanner ? 'Edit Banner' : 'Create New Banner'}
                    </h3>
                    <div className="mt-4 space-y-4">
                      <div>
                        <label htmlFor="bannerTitle" className="block text-sm font-medium text-gray-700">
                          Title
                        </label>
                        <input
                          type="text"
                          name="bannerTitle"
                          id="bannerTitle"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          value={bannerForm.title}
                          onChange={(e) => setBannerForm({...bannerForm, title: e.target.value})}
                        />
                      </div>

                      <div>
                        <label htmlFor="bannerContent" className="block text-sm font-medium text-gray-700">
                          Content
                        </label>
                        <textarea
                          id="bannerContent"
                          name="bannerContent"
                          rows={3}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          value={bannerForm.content}
                          onChange={(e) => setBannerForm({...bannerForm, content: e.target.value})}
                        ></textarea>
                      </div>

                      <div>
                        <label htmlFor="bannerImageUrl" className="block text-sm font-medium text-gray-700">
                          Image URL
                        </label>
                        <input
                          type="text"
                          name="bannerImageUrl"
                          id="bannerImageUrl"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          value={bannerForm.imageUrl}
                          onChange={(e) => setBannerForm({...bannerForm, imageUrl: e.target.value})}
                        />
                      </div>

                      <div className="flex items-center">
                        <input
                          id="bannerActive"
                          name="bannerActive"
                          type="checkbox"
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          checked={bannerForm.isActive}
                          onChange={(e) => setBannerForm({...bannerForm, isActive: e.target.checked})}
                        />
                        <label htmlFor="bannerActive" className="ml-2 block text-sm text-gray-900">
                          Active
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleSaveBanner}
                >
                  {editingBanner ? 'Update Banner' : 'Create Banner'}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => {
                    setShowBannerModal(false);
                    resetBannerForm();
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

export default ContentManagement;