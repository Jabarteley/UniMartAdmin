import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { WebSocketProvider } from './context/WebSocketContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/UserManagement';
import ListingsManagement from './pages/ListingsManagement';
import DealsMonitoring from './pages/DealsMonitoring';
import ReportsDisputeResolution from './pages/ReportsDisputeResolution';
import VerificationManagement from './pages/VerificationManagement';
import ChatModeration from './pages/ChatModeration';
import RatingsTrustSystem from './pages/RatingsTrustSystem';
import NotificationsManagement from './pages/NotificationsManagement';
import ContentManagement from './pages/ContentManagement';
import AnalyticsInsights from './pages/AnalyticsInsights';
import SystemSettings from './pages/SystemSettings';
import LogsAuditTrail from './pages/LogsAuditTrail';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <WebSocketProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/dashboard" element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } />
              <Route path="/users" element={
                <PrivateRoute>
                  <UserManagement />
                </PrivateRoute>
              } />
              <Route path="/listings" element={
                <PrivateRoute>
                  <ListingsManagement />
                </PrivateRoute>
              } />
              <Route path="/deals" element={
                <PrivateRoute>
                  <DealsMonitoring />
                </PrivateRoute>
              } />
              <Route path="/reports" element={
                <PrivateRoute>
                  <ReportsDisputeResolution />
                </PrivateRoute>
              } />
              <Route path="/verification" element={
                <PrivateRoute>
                  <VerificationManagement />
                </PrivateRoute>
              } />
              <Route path="/chat" element={
                <PrivateRoute>
                  <ChatModeration />
                </PrivateRoute>
              } />
              <Route path="/ratings" element={
                <PrivateRoute>
                  <RatingsTrustSystem />
                </PrivateRoute>
              } />
              <Route path="/notifications" element={
                <PrivateRoute>
                  <NotificationsManagement />
                </PrivateRoute>
              } />
              <Route path="/content" element={
                <PrivateRoute>
                  <ContentManagement />
                </PrivateRoute>
              } />
              <Route path="/analytics" element={
                <PrivateRoute>
                  <AnalyticsInsights />
                </PrivateRoute>
              } />
              <Route path="/settings" element={
                <PrivateRoute>
                  <SystemSettings />
                </PrivateRoute>
              } />
              <Route path="/logs" element={
                <PrivateRoute>
                  <LogsAuditTrail />
                </PrivateRoute>
              } />
            </Routes>
          </div>
        </Router>
      </WebSocketProvider>
    </AuthProvider>
  );
}

export default App;