import React from 'react';
import { useAuth } from './hooks/useAuth';
import Auth from './components/Auth';
import TaskManager from './components/TaskManager';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return user ? <TaskManager /> : <Auth />;
}

export default App;