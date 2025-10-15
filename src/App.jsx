import React from 'react';
import { Routes, Route } from 'react-router-dom';
import authService from './services/authService';

import './css/style.css';
import './charts/ChartjsConfig';

import HRDashboard from './pages/HRDashboard';
import TimeTracking from './pages/TimeTracking';
import Employees from './pages/Employees';
import EmployeesMain from './pages/employees/EmployeesMain';
import CongesAbsences from './pages/employees/CongesAbsences';
import FeuillesTemps from './pages/employees/FeuillesTemps';
import BulletinsPaie from './pages/employees/BulletinsPaie';
import NotesFrais from './pages/employees/NotesFrais';
import TalentsFormations from './pages/employees/TalentsFormations';
import Departements from './pages/employees/Departements';
import Documents from './pages/Documents';
import Home from './pages/Home';
import Presence from './pages/Presence';
import Profile from './pages/Profile';
import Requests from './pages/Requests';
import Permissions from './pages/Permissions';
import Announcements from './pages/Announcements';
import MyTeam from './pages/MyTeam';
import Login from './pages/Login';
import Register from './pages/Register';
import AuthCallback from './pages/AuthCallback';

import Header from './partials/Header';
import Sidebar from './partials/Sidebar';

function App() {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  // Vérifier si l'utilisateur est connecté
  React.useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await authService.checkAuthStatus();
      setIsAuthenticated(isAuth);
    };
    
    checkAuth();
  }, []);

  // Fonction pour forcer la vérification de l'authentification
  const forceAuthCheck = async () => {
    const isAuth = await authService.checkAuthStatus();
    setIsAuthenticated(isAuth);
  };

  // Si l'utilisateur n'est pas connecté, afficher la page de connexion ou d'inscription
  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/register" element={<Register onRegister={forceAuthCheck} />} />
        <Route path="/auth/callback" element={<AuthCallback onAuthSuccess={forceAuthCheck} />} />
        <Route path="*" element={<Login onLogin={forceAuthCheck} />} />
      </Routes>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/*  Site header */}
        <Header 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen} 
          onLogout={async () => {
            await authService.logout();
            setIsAuthenticated(false);
          }}
        />

        <main>
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<HRDashboard />} />
              <Route path="/presence" element={<Presence />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/requests" element={<Requests />} />
            <Route path="/permissions" element={<Permissions />} />
              <Route path="/announcements" element={<Announcements />} />
              <Route path="/my-team" element={<MyTeam />} />
              <Route path="/time-tracking" element={<TimeTracking />} />
              <Route path="/conges-absences" element={<CongesAbsences />} />
              <Route path="/feuilles-temps" element={<FeuillesTemps />} />
              <Route path="/bulletins-paie" element={<BulletinsPaie />} />
              <Route path="/notes-frais" element={<NotesFrais />} />
              <Route path="/talents-formations" element={<TalentsFormations />} />
              <Route path="/documents" element={<Documents />} />
              <Route path="/employees" element={<Employees />}>
                <Route index element={<EmployeesMain />} />
                <Route path="departements" element={<Departements />} />
              </Route>
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
