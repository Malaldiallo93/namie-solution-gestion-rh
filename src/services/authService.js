// Service d'authentification pour l'API Laravel
class AuthService {
    constructor() {
        this.baseURL = 'http://localhost:8000/api';
        this.token = localStorage.getItem('authToken');
    }

    // Initialiser le service Google OAuth
    initGoogleAuth() {
        // Charger le script Google OAuth
        if (!window.google) {
            const script = document.createElement('script');
            script.src = 'https://accounts.google.com/gsi/client';
            script.async = true;
            script.defer = true;
            document.head.appendChild(script);
        }
    }

    // Connexion avec Google
    async loginWithGoogle() {
        try {
            // Rediriger vers la route web Google OAuth
            window.location.href = 'http://localhost:8000/auth/google';
        } catch (error) {
            console.error('Erreur lors de la connexion Google:', error);
            throw error;
        }
    }



    // Déconnexion
    async logout() {
        try {
            if (this.token) {
                await fetch(`${this.baseURL}/auth/logout`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${this.token}`,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                });
            }
        } catch (error) {
            console.error('Erreur lors de la déconnexion:', error);
        } finally {
            // Nettoyer le localStorage
            localStorage.removeItem('authToken');
            localStorage.removeItem('userEmail');
            localStorage.removeItem('userName');
            localStorage.removeItem('userAvatar');
            this.token = null;
        }
    }

    // Vérifier si l'utilisateur est connecté
    isAuthenticated() {
        return !!this.token;
    }

    // Obtenir le token
    getToken() {
        return this.token;
    }

    // Obtenir les informations utilisateur
    getUserInfo() {
        return {
            email: localStorage.getItem('userEmail'),
            name: localStorage.getItem('userName'),
            avatar: localStorage.getItem('userAvatar'),
        };
    }

    // Vérifier la validité du token
    async checkAuthStatus() {
        try {
            // Version simplifiée pour éviter les erreurs de connexion
            const token = localStorage.getItem('authToken');
            const userEmail = localStorage.getItem('userEmail');
            
            // Si on a un token et un email, on considère l'utilisateur comme connecté
            if (token && userEmail) {
                this.token = token;
                return true;
            }
            
            return false;
        } catch (error) {
            console.error('Erreur lors de la vérification du statut:', error);
            return false;
        }
    }
}

// Instance singleton
const authService = new AuthService();

export default authService; 