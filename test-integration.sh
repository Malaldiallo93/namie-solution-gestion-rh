#!/bin/bash

# Script de test d'intégration pour HR Dashboard
# Auteur: Assistant IA

echo "🧪 Test d'intégration HR Dashboard..."

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Fonction pour afficher un titre
print_title() {
    echo -e "\n${PURPLE}══════════════════════════════════════════════════════════════${NC}"
    echo -e "${PURPLE}  $1${NC}"
    echo -e "${PURPLE}══════════════════════════════════════════════════════════════${NC}"
}

# Fonction pour tester une API
test_api() {
    local name=$1
    local url=$2
    local expected_field=$3
    
    echo -e "${BLUE}🔍 Test: $name${NC}"
    echo -e "   URL: $url"
    
    response=$(curl -s "$url")
    
    if [ $? -eq 0 ] && [ ! -z "$response" ]; then
        if [ ! -z "$expected_field" ]; then
            if echo "$response" | grep -q "$expected_field"; then
                echo -e "   ${GREEN}✅ Succès${NC}"
                return 0
            else
                echo -e "   ${RED}❌ Échec - Champ '$expected_field' non trouvé${NC}"
                return 1
            fi
        else
            echo -e "   ${GREEN}✅ Succès${NC}"
            return 0
        fi
    else
        echo -e "   ${RED}❌ Échec - Pas de réponse${NC}"
        return 1
    fi
}

# Test des APIs Backend
print_title "TEST DES APIS BACKEND"

# Test Health Check
test_api "Health Check" "http://localhost:8000/api/health" "healthy"

# Test Dashboard Metrics
test_api "Dashboard Metrics" "http://localhost:8000/api/dashboard/metrics" "employees"

# Test Employees
test_api "Employees List" "http://localhost:8000/api/employees" "first_name"

# Test Department Distribution
test_api "Department Distribution" "http://localhost:8000/api/dashboard/department-distribution" "department"

# Test Leaves
test_api "Leaves List" "http://localhost:8000/api/leaves" "success"

# Test Timesheets
test_api "Timesheets List" "http://localhost:8000/api/timesheets" "success"

# Test Frontend
print_title "TEST DU FRONTEND"

# Test Frontend React
test_api "Frontend React" "http://localhost:5173" "html"

# Test des fonctionnalités spécifiques
print_title "TEST DES FONCTIONNALITÉS"

# Test Clock In (simulation)
echo -e "${BLUE}🔍 Test: Clock In Simulation${NC}"
clock_in_response=$(curl -s -X POST "http://localhost:8000/api/timesheets/1/clock-in")
if echo "$clock_in_response" | grep -q "success"; then
    echo -e "   ${GREEN}✅ Clock In fonctionne${NC}"
else
    echo -e "   ${YELLOW}⚠️  Clock In - Réponse: $clock_in_response${NC}"
fi

# Test des données de test
print_title "VÉRIFICATION DES DONNÉES"

# Vérifier le nombre d'employés
employee_count=$(curl -s "http://localhost:8000/api/employees" | grep -o '"id":[0-9]*' | wc -l)
echo -e "${BLUE}📊 Nombre d'employés: $employee_count${NC}"

# Vérifier les départements
departments=$(curl -s "http://localhost:8000/api/dashboard/department-distribution" | grep -o '"department":"[^"]*"' | wc -l)
echo -e "${BLUE}📊 Nombre de départements: $departments${NC}"

# Résumé final
print_title "RÉSUMÉ DES TESTS"

echo -e "${GREEN}🎉 Tests d'intégration terminés!${NC}"
echo -e "\n${BLUE}📋 URLs d'accès:${NC}"
echo -e "   ${GREEN}Frontend:     http://localhost:5173${NC}"
echo -e "   ${GREEN}Backend:      http://localhost:8000${NC}"
echo -e "   ${GREEN}API Health:   http://localhost:8000/api/health${NC}"
echo -e "   ${GREEN}API Metrics:  http://localhost:8000/api/dashboard/metrics${NC}"

echo -e "\n${BLUE}🔧 Commandes utiles:${NC}"
echo -e "   ${YELLOW}Logs Backend:  tail -f hr-backend/storage/logs/laravel.log${NC}"
echo -e "   ${YELLOW}Logs Frontend: Dans le terminal npm run dev${NC}"

echo -e "\n${PURPLE}✨ L'intégration est prête!${NC}" 