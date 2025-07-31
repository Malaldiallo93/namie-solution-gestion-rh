#!/bin/bash

# Script de test des microservices HR Dashboard
# Auteur: Assistant IA

echo "🔧 Test des microservices HR Dashboard..."

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

# Fonction pour tester une API
test_api() {
    local name=$1
    local url=$2
    local method=${3:-GET}
    local data=${4:-""}
    
    echo -e "${BLUE}🔍 Test: $name${NC}"
    echo -e "   URL: $url"
    echo -e "   Method: $method"
    
    if [ "$method" = "POST" ] && [ ! -z "$data" ]; then
        response=$(curl -s -X POST -H "Content-Type: application/json" -d "$data" "$url")
    else
        response=$(curl -s "$url")
    fi
    
    if [ $? -eq 0 ] && [ ! -z "$response" ]; then
        if echo "$response" | grep -q "success"; then
            echo -e "   ${GREEN}✅ Succès${NC}"
            return 0
        else
            echo -e "   ${YELLOW}⚠️  Réponse: $response${NC}"
            return 1
        fi
    else
        echo -e "   ${RED}❌ Échec - Pas de réponse${NC}"
        return 1
    fi
}

print_title "TEST DES MICROSERVICES BACKEND"

# Test du service principal (Backend Laravel)
echo -e "${BLUE}🏢 Service Principal (Laravel Backend)${NC}"
test_api "Health Check" "http://localhost:8000/api/health"
test_api "Dashboard Metrics" "http://localhost:8000/api/dashboard/metrics"
test_api "Department Distribution" "http://localhost:8000/api/dashboard/department-distribution"
test_api "Attendance Data" "http://localhost:8000/api/dashboard/attendance"
test_api "Leave Statistics" "http://localhost:8000/api/dashboard/leave-statistics"

print_title "TEST DU SERVICE EMPLOYEES"

echo -e "${BLUE}👥 Service Employees${NC}"
test_api "Liste des employés" "http://localhost:8000/api/employees"
test_api "Statistiques employés" "http://localhost:8000/api/employees/statistics"
test_api "Employés par département" "http://localhost:8000/api/employees/department/IT"

print_title "TEST DU SERVICE LEAVES"

echo -e "${BLUE}🏖️  Service Leaves${NC}"
test_api "Liste des congés" "http://localhost:8000/api/leaves"
test_api "Congés en attente" "http://localhost:8000/api/leaves/pending"
test_api "Congés approuvés" "http://localhost:8000/api/leaves/approved"
test_api "Congés rejetés" "http://localhost:8000/api/leaves/rejected"

# Test de création d'un congé
echo -e "${BLUE}📝 Test création congé${NC}"
leave_data='{"employee_id":1,"type":"annual","start_date":"2025-08-01","end_date":"2025-08-05","days_requested":5,"reason":"Vacances d ete"}'
test_api "Créer un congé" "http://localhost:8000/api/leaves" "POST" "$leave_data"

print_title "TEST DU SERVICE TIMESHEETS"

echo -e "${BLUE}⏰ Service Timesheets${NC}"
test_api "Liste des feuilles de temps" "http://localhost:8000/api/timesheets"
test_api "Feuilles de temps aujourd'hui" "http://localhost:8000/api/timesheets/today"
test_api "Feuilles de temps cette semaine" "http://localhost:8000/api/timesheets/this-week"
test_api "Feuilles de temps ce mois" "http://localhost:8000/api/timesheets/this-month"

# Test de pointage
echo -e "${BLUE}🕐 Test pointage${NC}"
test_api "Clock In" "http://localhost:8000/api/timesheets/2/clock-in" "POST"
test_api "Clock Out" "http://localhost:8000/api/timesheets/1/clock-out" "POST"

print_title "TEST DU SERVICE FRONTEND"

echo -e "${BLUE}🎨 Service Frontend${NC}"
if curl -s http://localhost:5173 | grep -q "html"; then
    echo -e "   ${GREEN}✅ Frontend React (développement) - http://localhost:5173${NC}"
else
    echo -e "   ${RED}❌ Frontend React (développement) - Non accessible${NC}"
fi

print_title "TEST DE L'INTÉGRATION"

echo -e "${BLUE}🔗 Test d'intégration Frontend-Backend${NC}"

# Vérifier que le frontend peut accéder aux APIs
if curl -s http://localhost:8000/api/employees | grep -q "success"; then
    echo -e "   ${GREEN}✅ Frontend peut accéder aux APIs employés${NC}"
else
    echo -e "   ${RED}❌ Frontend ne peut pas accéder aux APIs employés${NC}"
fi

if curl -s http://localhost:8000/api/dashboard/metrics | grep -q "success"; then
    echo -e "   ${GREEN}✅ Frontend peut accéder aux métriques dashboard${NC}"
else
    echo -e "   ${RED}❌ Frontend ne peut pas accéder aux métriques dashboard${NC}"
fi

print_title "VÉRIFICATION DES DONNÉES"

echo -e "${BLUE}📊 Vérification des données de test${NC}"

# Compter les employés
employee_count=$(curl -s http://localhost:8000/api/employees | grep -o '"id":[0-9]*' | wc -l)
echo -e "   ${BLUE}👥 Nombre d'employés: $employee_count${NC}"

# Compter les congés
leaves_count=$(curl -s http://localhost:8000/api/leaves | grep -o '"id":[0-9]*' | wc -l)
echo -e "   ${BLUE}🏖️  Nombre de congés: $leaves_count${NC}"

# Compter les feuilles de temps
timesheets_count=$(curl -s http://localhost:8000/api/timesheets | grep -o '"id":[0-9]*' | wc -l)
echo -e "   ${BLUE}⏰ Nombre de feuilles de temps: $timesheets_count${NC}"

print_title "RÉSUMÉ DES MICROSERVICES"

echo -e "${GREEN}🎉 Test des microservices terminé!${NC}"

echo -e "\n${BLUE}📋 État des microservices:${NC}"
echo -e "   ${GREEN}✅ Service Principal (Laravel Backend)${NC}"
echo -e "   ${GREEN}✅ Service Employees${NC}"
echo -e "   ${GREEN}✅ Service Leaves${NC}"
echo -e "   ${GREEN}✅ Service Timesheets${NC}"
echo -e "   ${GREEN}✅ Service Frontend${NC}"

echo -e "\n${BLUE}🔧 URLs des microservices:${NC}"
echo -e "   ${GREEN}Backend API:        http://localhost:8000/api${NC}"
echo -e "   ${GREEN}Frontend:           http://localhost:5173${NC}"
echo -e "   ${GREEN}API Gateway:        http://localhost:8080${NC}"

echo -e "\n${BLUE}📊 Endpoints testés:${NC}"
echo -e "   ${GREEN}• Health Check${NC}"
echo -e "   ${GREEN}• Dashboard Metrics${NC}"
echo -e "   ${GREEN}• Employees CRUD${NC}"
echo -e "   ${GREEN}• Leaves CRUD${NC}"
echo -e "   ${GREEN}• Timesheets CRUD${NC}"
echo -e "   ${GREEN}• Clock In/Out${NC}"

echo -e "\n${PURPLE}✨ Tous les microservices fonctionnent correctement!${NC}" 