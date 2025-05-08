import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Contexts
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MusicPlayer from './components/MusicPlayer';

// Pages
import HomePage from './pages/HomePage';
import SongList from './pages/SongList';
import SongDetail from './pages/SongDetail';
import AddSong from './pages/AddSong';
import EditSong from './pages/EditSong';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Profile from './pages/Profile';

// Types
import type { Song } from './types/Song';

// Protected route component
interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectPath?: string;
}

const ProtectedRoute = ({ children, redirectPath = '/login' }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }
  
  return <>{children}</>;
};

// Main App component wrapped with providers
const AppWithProviders = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </AuthProvider>
  );
};

// App content with access to contexts
const AppContent = () => {
  const { isAuthenticated } = useAuth();
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  
  return (
    <Router>
      <div className="flex flex-col min-h-screen w-full bg-gray-900 text-white">
        <Navbar />
        <main className="flex-grow w-full container mx-auto px-4 py-6 md:py-8">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<HomePage onSelectSong={setCurrentSong} />} />
            <Route path="/songs" element={<SongList onSelectSong={setCurrentSong} />} />
            <Route path="/songs/:id" element={<SongDetail onSelectSong={setCurrentSong} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            
            {/* Protected routes */}
            <Route 
              path="/add-song" 
              element={
                <ProtectedRoute>
                  <AddSong />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/edit-song/:id" 
              element={
                <ProtectedRoute>
                  <EditSong />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />

            {/* 404 route */}
            <Route path="*" element={
              <div className="text-center py-20">
                <h1 className="text-4xl font-bold text-white mb-4">404</h1>
                <p className="text-gray-400 mb-8">Page not found</p>
              </div>
            } />
          </Routes>
        </main>
        {currentSong && <MusicPlayer song={currentSong} />}
        <Footer />
      </div>
    </Router>
  );
};

export default AppWithProviders;
