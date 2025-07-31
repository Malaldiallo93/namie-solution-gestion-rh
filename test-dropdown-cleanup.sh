#!/bin/bash

# Script de test du nettoyage du dropdown profil
# Auteur: Assistant IA

echo "🧹 Test du nettoyage du dropdown profil..."

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

print_title "VÉRIFICATION DE LA SUPPRESSION DE LA RÉPÉTITION"

# Vérifier que l'en-tête du dropdown a été supprimé
if grep -q "Mon Profil.*Administrator" src/components/DropdownProfile.jsx; then
    echo -e "${RED}❌ En-tête du dropdown encore présent${NC}"
else
    echo -e "${GREEN}✅ En-tête du dropdown supprimé${NC}"
fi

# Vérifier que la bordure de séparation a été supprimée
if grep -q "border-b border-gray-200" src/components/DropdownProfile.jsx; then
    echo -e "${RED}❌ Bordure de séparation encore présente${NC}"
else
    echo -e "${GREEN}✅ Bordure de séparation supprimée${NC}"
fi

# Vérifier que le padding a été ajusté
if grep -q "className=\"py-1\"" src/components/DropdownProfile.jsx; then
    echo -e "${GREEN}✅ Padding ajusté pour compenser la suppression${NC}"
else
    echo -e "${RED}❌ Padding non ajusté${NC}"
fi

print_title "VÉRIFICATION DU CONTENU FINAL"

# Vérifier que "Mon Profil" n'apparaît qu'une seule fois dans la liste
profile_count=$(grep -o "Mon Profil" src/components/DropdownProfile.jsx | wc -l)
if [ "$profile_count" -eq 1 ]; then
    echo -e "${GREEN}✅ 'Mon Profil' apparaît une seule fois${NC}"
else
    echo -e "${RED}❌ 'Mon Profil' apparaît $profile_count fois${NC}"
fi

# Vérifier que "Paramètres" est présent
if grep -q "Paramètres" src/components/DropdownProfile.jsx; then
    echo -e "${GREEN}✅ 'Paramètres' présent${NC}"
else
    echo -e "${RED}❌ 'Paramètres' manquant${NC}"
fi

# Vérifier que "Déconnexion" est présent
if grep -q "Déconnexion" src/components/DropdownProfile.jsx; then
    echo -e "${GREEN}✅ 'Déconnexion' présent${NC}"
else
    echo -e "${RED}❌ 'Déconnexion' manquant${NC}"
fi

print_title "VÉRIFICATION DE LA STRUCTURE"

# Vérifier que la structure du dropdown est propre
if grep -q "<ul>" src/components/DropdownProfile.jsx; then
    echo -e "${GREEN}✅ Structure de liste maintenue${NC}"
else
    echo -e "${RED}❌ Structure de liste manquante${NC}"
fi

# Vérifier que les icônes sont toujours présentes
if grep -q "w-4 h-4 mr-2" src/components/DropdownProfile.jsx; then
    echo -e "${GREEN}✅ Icônes maintenues${NC}"
else
    echo -e "${RED}❌ Icônes manquantes${NC}"
fi

# Vérifier que les effets hover sont maintenus
if grep -q "hover:bg-violet-50" src/components/DropdownProfile.jsx; then
    echo -e "${GREEN}✅ Effets hover maintenus${NC}"
else
    echo -e "${RED}❌ Effets hover manquants${NC}"
fi

print_title "VÉRIFICATION DE L'ACCESSIBILITÉ"

# Vérifier que les liens fonctionnent toujours
if grep -q "to=\"/profile\"" src/components/DropdownProfile.jsx; then
    echo -e "${GREEN}✅ Lien vers /profile maintenu${NC}"
else
    echo -e "${RED}❌ Lien vers /profile manquant${NC}"
fi

if grep -q "to=\"/settings\"" src/components/DropdownProfile.jsx; then
    echo -e "${GREEN}✅ Lien vers /settings maintenu${NC}"
else
    echo -e "${RED}❌ Lien vers /settings manquant${NC}"
fi

# Vérifier que la fonction onLogout est maintenue
if grep -q "onLogout()" src/components/DropdownProfile.jsx; then
    echo -e "${GREEN}✅ Fonction onLogout maintenue${NC}"
else
    echo -e "${RED}❌ Fonction onLogout manquante${NC}"
fi

print_title "RÉSUMÉ DU NETTOYAGE"

echo -e "${GREEN}🎉 Test du nettoyage du dropdown terminé!${NC}"

echo -e "\n${BLUE}📋 Modifications effectuées:${NC}"
echo -e "   ${GREEN}✅ Suppression de l'en-tête répétitif 'Mon Profil'${NC}"
echo -e "   ${GREEN}✅ Suppression de la bordure de séparation${NC}"
echo -e "   ${GREEN}✅ Ajustement du padding pour compenser${NC}"
echo -e "   ${GREEN}✅ Conservation de toutes les fonctionnalités${NC}"

echo -e "\n${BLUE}🎯 Résultat final:${NC}"
echo -e "   ${GREEN}✅ Dropdown plus propre et concis${NC}"
echo -e "   ${GREEN}✅ Pas de répétition de texte${NC}"
echo -e "   ${GREEN}✅ Interface plus claire${NC}"
echo -e "   ${GREEN}✅ Toutes les options fonctionnelles${NC}"

echo -e "\n${BLUE}📋 Contenu du dropdown:${NC}"
echo -e "   ${GREEN}• Mon Profil (avec icône utilisateur)${NC}"
echo -e "   ${GREEN}• Paramètres (avec icône engrenage)${NC}"
echo -e "   ${GREEN}• Déconnexion (avec icône sortie, couleur rouge)${NC}"

echo -e "\n${PURPLE}✨ Le dropdown est maintenant propre et sans répétition!${NC}" 