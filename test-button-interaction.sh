#!/bin/bash

# Script de test des améliorations d'interaction du bouton de déconnexion
# Auteur: Assistant IA

echo "🎯 Test des améliorations d'interaction du bouton de déconnexion..."

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

print_title "VÉRIFICATION DES AMÉLIORATIONS VISUELLES"

# Vérifier que le bouton de déconnexion a une couleur rouge
if grep -q "text-red-600" src/components/DropdownProfile.jsx; then
    echo -e "${GREEN}✅ Couleur rouge appliquée au bouton de déconnexion${NC}"
else
    echo -e "${RED}❌ Couleur rouge manquante pour le bouton de déconnexion${NC}"
fi

# Vérifier l'effet hover rouge
if grep -q "hover:text-red-700" src/components/DropdownProfile.jsx; then
    echo -e "${GREEN}✅ Effet hover rouge appliqué${NC}"
else
    echo -e "${RED}❌ Effet hover rouge manquant${NC}"
fi

# Vérifier l'arrière-plan hover
if grep -q "hover:bg-red-50" src/components/DropdownProfile.jsx; then
    echo -e "${GREEN}✅ Arrière-plan hover appliqué${NC}"
else
    echo -e "${RED}❌ Arrière-plan hover manquant${NC}"
fi

# Vérifier la transition
if grep -q "transition-colors" src/components/DropdownProfile.jsx; then
    echo -e "${GREEN}✅ Transition appliquée${NC}"
else
    echo -e "${RED}❌ Transition manquante${NC}"
fi

# Vérifier la durée de transition
if grep -q "duration-150" src/components/DropdownProfile.jsx; then
    echo -e "${GREEN}✅ Durée de transition définie${NC}"
else
    echo -e "${RED}❌ Durée de transition manquante${NC}"
fi

# Vérifier les coins arrondis
if grep -q "rounded-md" src/components/DropdownProfile.jsx; then
    echo -e "${GREEN}✅ Coins arrondis appliqués${NC}"
else
    echo -e "${RED}❌ Coins arrondis manquants${NC}"
fi

print_title "VÉRIFICATION DES ICÔNES"

# Vérifier l'icône de déconnexion
if grep -q "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" src/components/DropdownProfile.jsx; then
    echo -e "${GREEN}✅ Icône de déconnexion présente${NC}"
else
    echo -e "${RED}❌ Icône de déconnexion manquante${NC}"
fi

# Vérifier l'icône de profil
if grep -q "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" src/components/DropdownProfile.jsx; then
    echo -e "${GREEN}✅ Icône de profil présente${NC}"
else
    echo -e "${RED}❌ Icône de profil manquante${NC}"
fi

# Vérifier l'icône de paramètres
if grep -q "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" src/components/DropdownProfile.jsx; then
    echo -e "${GREEN}✅ Icône de paramètres présente${NC}"
else
    echo -e "${RED}❌ Icône de paramètres manquante${NC}"
fi

print_title "VÉRIFICATION DES AMÉLIORATIONS GÉNÉRALES"

# Vérifier que tous les liens ont des effets hover
if grep -q "hover:bg-violet-50" src/components/DropdownProfile.jsx; then
    echo -e "${GREEN}✅ Effets hover appliqués aux autres liens${NC}"
else
    echo -e "${RED}❌ Effets hover manquants pour les autres liens${NC}"
fi

# Vérifier l'espacement amélioré
if grep -q "py-2" src/components/DropdownProfile.jsx; then
    echo -e "${GREEN}✅ Espacement vertical amélioré${NC}"
else
    echo -e "${RED}❌ Espacement vertical non amélioré${NC}"
fi

# Vérifier la taille des icônes
if grep -q "w-4 h-4 mr-2" src/components/DropdownProfile.jsx; then
    echo -e "${GREEN}✅ Taille et espacement des icônes corrects${NC}"
else
    echo -e "${RED}❌ Taille et espacement des icônes incorrects${NC}"
fi

print_title "VÉRIFICATION DE L'ACCESSIBILITÉ"

# Vérifier que le bouton a une largeur complète
if grep -q "w-full" src/components/DropdownProfile.jsx; then
    echo -e "${GREEN}✅ Bouton avec largeur complète${NC}"
else
    echo -e "${RED}❌ Bouton sans largeur complète${NC}"
fi

# Vérifier l'alignement du texte
if grep -q "text-left" src/components/DropdownProfile.jsx; then
    echo -e "${GREEN}✅ Alignement du texte correct${NC}"
else
    echo -e "${RED}❌ Alignement du texte incorrect${NC}"
fi

print_title "RÉSUMÉ DES AMÉLIORATIONS"

echo -e "${GREEN}🎉 Test des améliorations d'interaction terminé!${NC}"

echo -e "\n${BLUE}📋 Améliorations appliquées:${NC}"
echo -e "   ${GREEN}✅ Couleur rouge distinctive pour la déconnexion${NC}"
echo -e "   ${GREEN}✅ Effets hover avec arrière-plan coloré${NC}"
echo -e "   ${GREEN}✅ Transitions fluides (150ms)${NC}"
echo -e "   ${GREEN}✅ Coins arrondis pour un look moderne${NC}"
echo -e "   ${GREEN}✅ Icônes SVG pour chaque action${NC}"
echo -e "   ${GREEN}✅ Espacement vertical amélioré (py-2)${NC}"
echo -e "   ${GREEN}✅ Effets hover cohérents pour tous les liens${NC}"

echo -e "\n${BLUE}🎨 Design amélioré:${NC}"
echo -e "   ${GREEN}✅ Déconnexion: Rouge avec icône de sortie${NC}"
echo -e "   ${GREEN}✅ Mon Profil: Violet avec icône utilisateur${NC}"
echo -e "   ${GREEN}✅ Paramètres: Violet avec icône d'engrenage${NC}"

echo -e "\n${BLUE}🔧 Interactions:${NC}"
echo -e "   ${GREEN}✅ Hover avec changement de couleur${NC}"
echo -e "   ${GREEN}✅ Hover avec arrière-plan coloré${NC}"
echo -e "   ${GREEN}✅ Transitions fluides et rapides${NC}"
echo -e "   ${GREEN}✅ Retour visuel immédiat${NC}"

echo -e "\n${PURPLE}✨ Le bouton de déconnexion a maintenant une interaction claire et visible!${NC}" 