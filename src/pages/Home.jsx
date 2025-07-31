import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const shortcuts = [
  { label: 'Annonces', icon: (
    <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M3 10v6a2 2 0 0 0 2 2h3l4 4V4l-4 4H5a2 2 0 0 0-2 2z"/><path d="M19 12v-2a2 2 0 0 0-2-2h-1"/></svg>
  ) },
  { label: 'Présence', icon: (
    <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
  ) },
  { label: 'Mon équipe', icon: (
    <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
  ) },
  { label: 'Absences', icon: (
    <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="16" y1="11" x2="22" y2="11"/></svg>
  ) },
  { label: 'Documents', icon: (
    <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h6a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z"/></svg>
  ) },
  { label: 'Demandes', icon: (
    <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M9 9h6M9 13h6M9 17h6"/></svg>
  ) },
  { label: 'Mon profil', icon: (
    <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="7" r="4"/><path d="M5.5 21a10.94 10.94 0 0 1 13 0"/></svg>
  ) },
];

function getDateFr() {
  return new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

function formatChrono(sec) {
  const h = String(Math.floor(sec / 3600)).padStart(2, '0');
  const m = String(Math.floor((sec % 3600) / 60)).padStart(2, '0');
  const s = String(sec % 60).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

function PointageInteractif() {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const intervalRef = useRef();

  useEffect(() => {
    if (running && !finished) {
      intervalRef.current = setInterval(() => setSeconds(s => s + 1), 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, finished]);

  const handleLancer = () => {
    setStarted(true);
    setRunning(true);
  };
  const handlePause = () => setRunning(false);
  const handleContinue = () => setRunning(true);
  const handleSortir = () => {
    setRunning(false);
    setFinished(true);
  };

  let etat = 'Prêt';
  if (started && running && !finished) etat = 'En cours';
  else if (started && !running && !finished) etat = 'En pause';
  else if (finished) etat = 'Terminé';

  return (
    <div className="flex flex-col items-center gap-2 bg-white rounded-xl shadow px-6 py-4 mb-8 mx-auto w-fit border border-gray-100">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-gray-400">
          <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        </span>
        <span className="text-gray-400">
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="10" r="3"/><path d="M12 2v2m0 16v2m10-10h-2M4 12H2m15.07 7.07l-1.42-1.42M6.93 6.93L5.51 5.51m12.02 0l-1.42 1.42M6.93 17.07l-1.42 1.42"/></svg>
        </span>
        <span className="font-mono text-lg text-gray-700 tracking-widest">{formatChrono(seconds)}</span>
        <span className={`ml-4 px-2 py-0.5 rounded text-xs font-semibold ${etat === 'En cours' ? 'bg-green-100 text-green-700' : etat === 'En pause' ? 'bg-yellow-100 text-yellow-700' : etat === 'Terminé' ? 'bg-gray-200 text-gray-500' : 'bg-blue-100 text-blue-700'}`}>{etat}</span>
      </div>
      <div className="flex gap-2 mt-2">
        {!started && !finished && (
          <button onClick={handleLancer} className="px-4 py-1.5 rounded bg-blue-500 text-white font-medium hover:bg-blue-600">Lancer</button>
        )}
        {started && running && !finished && (
          <button onClick={handlePause} className="px-4 py-1.5 rounded bg-yellow-100 text-yellow-700 font-medium hover:bg-yellow-200">Pause</button>
        )}
        {started && !running && !finished && (
          <button onClick={handleContinue} className="px-4 py-1.5 rounded bg-green-100 text-green-700 font-medium hover:bg-green-200">Continuer</button>
        )}
        {started && !finished && (
          <button onClick={handleSortir} className="px-4 py-1.5 rounded bg-gray-200 text-gray-700 font-medium hover:bg-gray-300">Sortir</button>
        )}
      </div>
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();

  // Récupérer les informations de l'utilisateur connecté
  const userName = localStorage.getItem('userName') || 'Utilisateur';
  const userEmail = localStorage.getItem('userEmail') || '';
  const userFirstName = localStorage.getItem('userFirstName') || '';
  const userLastName = localStorage.getItem('userLastName') || '';
  const userCompany = localStorage.getItem('userCompany') || '';
  const userRole = localStorage.getItem('userRole') || '';
  
  // Générer les initiales pour l'avatar
  const getInitials = () => {
    if (userFirstName && userLastName) {
      return `${userFirstName.charAt(0)}${userLastName.charAt(0)}`.toUpperCase();
    } else if (userName) {
      return userName.split(' ').map(n => n.charAt(0)).join('').toUpperCase();
    }
    return 'U';
  };

  const handleShortcutClick = (label) => {
    switch (label) {
      case 'Absences':
        navigate('/conges-absences');
        break;
      case 'Présence':
        navigate('/presence');
        break;
      case 'Mon profil':
        navigate('/profile');
        break;
      case 'Demandes':
        navigate('/requests');
        break;
      case 'Annonces':
        navigate('/announcements');
        break;
      case 'Documents':
        navigate('/documents');
        break;
      case 'Mon équipe':
        navigate('/my-team');
        break;
      default:
        // Pour les autres boutons, on peut ajouter la navigation plus tard
        console.log(`Navigation vers ${label} non encore implémentée`);
        break;
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-10">
      <div className="bg-gradient-to-b from-blue-100 to-white rounded-2xl p-8 mb-8 flex flex-col items-center shadow-sm">
        <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold mb-4">{getInitials()}</div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Bienvenue sur Namie</h1>
        <div className="text-gray-500 mb-2">Bonjour {userName}</div>
        {userCompany && <div className="text-gray-400 mb-1">{userCompany}</div>}
        {userRole && <div className="text-gray-400 mb-2">{userRole}</div>}
        <div className="text-gray-400 mb-4">Aujourd'hui {getDateFr()}</div>
        <PointageInteractif />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {shortcuts.map((s, i) => (
          <div 
            key={s.label} 
            className="flex flex-col items-center bg-white rounded-xl shadow p-6 hover:shadow-md transition cursor-pointer border border-gray-100"
            onClick={() => handleShortcutClick(s.label)}
          >
            <div className="mb-2 text-blue-600">{s.icon}</div>
            <div className="text-base font-medium text-gray-700">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="text-center text-gray-400 mt-10 text-sm">Actions rapides</div>
    </div>
  );
} 