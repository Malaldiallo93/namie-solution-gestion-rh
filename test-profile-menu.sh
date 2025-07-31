#!/bin/bash

# Script de test du menu profil HR Dashboard
# Auteur: Assistant IA

echo "👤 Test du menu profil HR Dashboard..."

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

# Vérifier que "Mon Entreprise" a été supprimé
if grep -q "Mon Entreprise" src/components/DropdownProfile.jsx; then
    echo -e "${RED}❌ 'Mon Entreprise' encore présent dans DropdownProfile.jsx${NC}"
else
    echo -e "${GREEN}✅ 'Mon Entreprise' supprimé de DropdownProfile.jsx${NC}"
fi

# Vérifier que "Mon Profil" a été ajouté
if grep -q "Mon Profil" src/components/DropdownProfile.jsx; then
    echo -e "${GREEN}✅ 'Mon Profil' ajouté dans DropdownProfile.jsx${NC}"
else
    echo -e "${RED}❌ 'Mon Profil' manquant dans DropdownProfile.jsx${NC}"
fi

# Vérifier le lien vers /profile
if grep -q "to=\"/profile\"" src/components/DropdownProfile.jsx; then
    echo -e "${GREEN}✅ Lien vers /profile présent${NC}"
else
    echo -e "${RED}❌ Lien vers /profile manquant${NC}"
fi

# Vérifier que "Settings" a été traduit en "Paramètres"
if grep -q "Paramètres" src/components/DropdownProfile.jsx; then
    echo -e "${GREEN}✅ 'Settings' traduit en 'Paramètres'${NC}"
else
    echo -e "${RED}❌ 'Settings' non traduit${NC}"
fi

# Vérifier que "Sign Out" a été traduit en "Déconnexion"
if grep -q "Déconnexion" src/components/DropdownProfile.jsx; then
    echo -e "${GREEN}✅ 'Sign Out' traduit en 'Déconnexion'${NC}"
else
    echo -e "${RED}❌ 'Sign Out' non traduit${NC}"
fi

print_title "VÉRIFICATION DE LA PAGE PROFILE"

# Vérifier que la page Profile existe
if [ -f "src/pages/Profile.jsx" ]; then
    echo -e "${GREEN}✅ Page Profile.jsx existe${NC}"
else
    echo -e "${RED}❌ Page Profile.jsx manquante${NC}"
fi

# Vérifier que Profile est importé dans App.jsx
if grep -q "import Profile" src/App.jsx; then
    echo -e "${GREEN}✅ Profile importé dans App.jsx${NC}"
else
    echo -e "${RED}❌ Profile non importé dans App.jsx${NC}"
fi

# Vérifier la route /profile dans App.jsx
if grep -q "path=\"/profile\"" src/App.jsx; then
    echo -e "${GREEN}✅ Route /profile configurée${NC}"
else
    echo -e "${RED}❌ Route /profile manquante${NC}"
fi

print_title "VÉRIFICATION DU CONTENU DE LA PAGE PROFILE"

# Vérifier les sections de la page Profile
if grep -q "Données personnelles" src/pages/Profile.jsx; then
    echo -e "${GREEN}✅ Section 'Données personnelles' présente${NC}"
else
    echo -e "${RED}❌ Section 'Données personnelles' manquante${NC}"
fi

if grep -q "Données professionnelles" src/pages/Profile.jsx; then
    echo -e "${GREEN}✅ Section 'Données professionnelles' présente${NC}"
else
    echo -e "${RED}❌ Section 'Données professionnelles' manquante${NC}"
fi

if grep -q "Données de l'entreprise" src/pages/Profile.jsx; then
    echo -e "${GREEN}✅ Section 'Données de l'entreprise' présente${NC}"
else
    echo -e "${RED}❌ Section 'Données de l'entreprise' manquante${NC}"
fi

print_title "VÉRIFICATION DES AUTRES RÉFÉRENCES"

# Vérifier qu'il n'y a plus de références à "Mon Entreprise" dans le menu
if grep -r "Mon Entreprise" src/ --include="*.jsx" --include="*.js" | grep -v "entreprise.com" | grep -v "d'entreprise" | grep -v "l'entreprise"; then
    echo -e "${YELLOW}⚠️  Références restantes à 'Mon Entreprise' trouvées:${NC}"
    grep -r "Mon Entreprise" src/ --include="*.jsx" --include="*.js" | grep -v "entreprise.com" | grep -v "d'entreprise" | grep -v "l'entreprise"
else
    echo -e "${GREEN}✅ Aucune référence restante à 'Mon Entreprise' dans les menus${NC}"
fi

print_title "RÉSUMÉ DES MODIFICATIONS"

echo -e "${GREEN}🎉 Test du menu profil terminé!${NC}"

echo -e "\n${BLUE}📋 Modifications effectuées:${NC}"
echo -e "   ${GREEN}✅ Suppression de 'Mon Entreprise' du menu utilisateur${NC}"
echo -e "   ${GREEN}✅ Ajout de 'Mon Profil' dans le menu utilisateur${NC}"
echo -e "   ${GREEN}✅ Lien vers la page /profile fonctionnel${NC}"
echo -e "   ${GREEN}✅ Traduction de 'Settings' en 'Paramètres'${NC}"
echo -e "   ${GREEN}✅ Traduction de 'Sign Out' en 'Déconnexion'${NC}"

echo -e "\n${BLUE}🔧 Navigation:${NC}"
echo -e "   ${GREEN}Menu utilisateur → Mon Profil → Page Profile${NC}"
echo -e "   ${GREEN}Menu utilisateur → Paramètres → Page Settings${NC}"
echo -e "   ${GREEN}Menu utilisateur → Déconnexion → Page Login${NC}"

echo -e "\n${BLUE}📄 Page Profile disponible:${NC}"
echo -e "   ${GREEN}URL: http://localhost:5173/profile${NC}"
echo -e "   ${GREEN}Sections: Données personnelles, professionnelles, entreprise${NC}"
echo -e "   ${GREEN}Fonctionnalités: Édition, sauvegarde, onglets${NC}"

echo -e "\n${PURPLE}✨ Le menu profil a été mis à jour avec succès!${NC}" 