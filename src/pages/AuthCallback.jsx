import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import authService from '../services/authService';

function AuthCallback({ onAuthSuccess }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const success = searchParams.get('success');
        const token = searchParams.get('token');
        const userData = searchParams.get('user');

        if (success === 'true' && token && userData) {
          // Stocker les données d'authentification
          const user = JSON.parse(userData);
          localStorage.setItem('authToken', token);
          localStorage.setItem('userEmail', user.email);
          localStorage.setItem('userName', user.name);
          localStorage.setItem('userAvatar', user.avatar);
          
          // Mettre à jour le service d'authentification
          authService.token = token;
          
          // Notifier le parent
          if (onAuthSuccess) {
            onAuthSuccess();
          }
          
          // Rediriger vers la page d'accueil
          navigate('/');
        } else {
          // Erreur d'authentification
          console.error('Erreur lors de l\'authentification Google');
          navigate('/');
        }
      } catch (error) {
        console.error('Erreur lors du traitement du callback:', error);
        navigate('/');
      }
    };

    handleCallback();
  }, [searchParams, onAuthSuccess, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">
          Connexion en cours...
        </h2>
        <p className="text-gray-500">
          Traitement de votre authentification Google
        </p>
      </div>
    </div>
  );
}

export default AuthCallback; 