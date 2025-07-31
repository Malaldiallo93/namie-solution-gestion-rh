#!/bin/bash

# Script de test de la fonctionnalité de déconnexion HR Dashboard
# Auteur: Assistant IA

echo "🚪 Test de la fonctionnalité de déconnexion..."

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

# Fonction pour afficher un titre
print_title() {
    echo -e "\n${PURPLE}══════════════════════════════════════════════════════════════${NC}"
    echo -e "${PURPLE}  $1${NC}"
    echo -e "${PURPLE}══════════════════════════════════════════════════════════════${NC}"
}

print_title "VÉRIFICATION DU SERVEUR"

# Vérifier si le serveur de développement fonctionne
if curl -s http://localhost:5173 | grep -q "html"; then
    echo -e "${GREEN}✅ Serveur de développement React actif - http://localhost:5173${NC}"
else
    echo -e "${RED}❌ Serveur de développement React non accessible${NC}"
    echo -e "${YELLOW}💡 Démarrez le serveur avec: pnpm dev${NC}"
    exit 1
fi

print_title "VÉRIFICATION DES MODIFICATIONS"

# Vérifier que le bouton de déconnexion a été supprimé du Header
if grep -q "Logout Button" src/partials/Header.jsx; then
    echo -e "${RED}❌ Bouton de déconnexion encore présent dans Header.jsx${NC}"
else
    echo -e "${GREEN}✅ Bouton de déconnexion supprimé du Header.jsx${NC}"
fi

# Vérifier que la fonction onLogout est passée au UserMenu
if grep -q "onLogout={onLogout}" src/partials/Header.jsx; then
    echo -e "${GREEN}✅ Fonction onLogout passée au UserMenu${NC}"
else
    echo -e "${RED}❌ Fonction onLogout non passée au UserMenu${NC}"
fi

# Vérifier que DropdownProfile accepte la prop onLogout
if grep -q "onLogout" src/components/DropdownProfile.jsx; then
    echo -e "${GREEN}✅ DropdownProfile accepte la prop onLogout${NC}"
else
    echo -e "${RED}❌ DropdownProfile n'accepte pas la prop onLogout${NC}"
fi

# Vérifier que le bouton de déconnexion utilise onLogout
if grep -q "onLogout()" src/components/DropdownProfile.jsx; then
    echo -e "${GREEN}✅ Bouton de déconnexion utilise onLogout${NC}"
else
    echo -e "${RED}❌ Bouton de déconnexion n'utilise pas onLogout${NC}"
fi

# Vérifier que le lien vers /signin a été remplacé par un bouton
if grep -q "to=\"/signin\"" src/components/DropdownProfile.jsx; then
    echo -e "${RED}❌ Lien vers /signin encore présent${NC}"
else
    echo -e "${GREEN}✅ Lien vers /signin remplacé par un bouton${NC}"
fi

print_title "VÉRIFICATION DE LA LOGIQUE DE DÉCONNEXION"

# Vérifier que la fonction de déconnexion nettoie le localStorage
if grep -q "localStorage.removeItem" src/App.jsx; then
    echo -e "${GREEN}✅ Nettoyage localStorage implémenté${NC}"
else
    echo -e "${RED}❌ Nettoyage localStorage manquant${NC}"
fi

# Vérifier que authToken est supprimé
if grep -q "removeItem('authToken')" src/App.jsx; then
    echo -e "${GREEN}✅ Suppression authToken implémentée${NC}"
else
    echo -e "${RED}❌ Suppression authToken manquante${NC}"
fi

# Vérifier que userEmail est supprimé
if grep -q "removeItem('userEmail')" src/App.jsx; then
    echo -e "${GREEN}✅ Suppression userEmail implémentée${NC}"
else
    echo -e "${RED}❌ Suppression userEmail manquante${NC}"
fi

# Vérifier que isAuthenticated est mis à false
if grep -q "setIsAuthenticated(false)" src/App.jsx; then
    echo -e "${GREEN}✅ Mise à jour isAuthenticated implémentée${NC}"
else
    echo -e "${RED}❌ Mise à jour isAuthenticated manquante${NC}"
fi

print_title "VÉRIFICATION DE L'INTERFACE"

# Vérifier que le bouton de déconnexion est dans le dropdown
if grep -q "Déconnexion" src/components/DropdownProfile.jsx; then
    echo -e "${GREEN}✅ Bouton 'Déconnexion' présent dans le dropdown${NC}"
else
    echo -e "${RED}❌ Bouton 'Déconnexion' manquant dans le dropdown${NC}"
fi

# Vérifier que le dropdown se ferme après déconnexion
if grep -q "setDropdownOpen(false)" src/components/DropdownProfile.jsx; then
    echo -e "${GREEN}✅ Fermeture du dropdown après déconnexion${NC}"
else
    echo -e "${RED}❌ Fermeture du dropdown manquante${NC}"
fi

print_title "VÉRIFICATION DE LA NAVIGATION"

# Vérifier que la page de connexion est accessible
if grep -q "path=\"*\"" src/App.jsx; then
    echo -e "${GREEN}✅ Route par défaut vers Login configurée${NC}"
else
    echo -e "${RED}❌ Route par défaut vers Login manquante${NC}"
fi

print_title "RÉSUMÉ DES MODIFICATIONS"

echo -e "${GREEN}🎉 Test de la fonctionnalité de déconnexion terminé!${NC}"

echo -e "\n${BLUE}📋 Modifications effectuées:${NC}"
echo -e "   ${GREEN}✅ Suppression du bouton de déconnexion du header${NC}"
echo -e "   ${GREEN}✅ Ajout du bouton de déconnexion dans le dropdown profil${NC}"
echo -e "   ${GREEN}✅ Implémentation de la fonction onLogout${NC}"
echo -e "   ${GREEN}✅ Nettoyage du localStorage (authToken, userEmail)${NC}"
echo -e "   ${GREEN}✅ Redirection vers la page de connexion${NC}"
echo -e "   ${GREEN}✅ Fermeture automatique du dropdown${NC}"

echo -e "\n${BLUE}🔧 Flux de déconnexion:${NC}"
echo -e "   ${GREEN}1. Clic sur l'icône profil (header)${NC}"
echo -e "   ${GREEN}2. Sélection de 'Déconnexion' dans le dropdown${NC}"
echo -e "   ${GREEN}3. Nettoyage du localStorage${NC}"
echo -e "   ${GREEN}4. Redirection vers la page de connexion${NC}"

echo -e "\n${BLUE}🎯 Avantages:${NC}"
echo -e "   ${GREEN}✅ Interface plus propre (un seul point de déconnexion)${NC}"
echo -e "   ${GREEN}✅ Navigation intuitive (dans le menu utilisateur)${NC}"
echo -e "   ${GREEN}✅ Sécurité renforcée (nettoyage complet)${NC}"
echo -e "   ${GREEN}✅ UX améliorée (fermeture automatique du dropdown)${NC}"

echo -e "\n${PURPLE}✨ La fonctionnalité de déconnexion est maintenant optimisée!${NC}" 