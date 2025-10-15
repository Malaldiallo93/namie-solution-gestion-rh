#!/bin/bash

# 🧪 Script de Test Automatisé - Système de Gestion des Congés
# Namie Solution RH - Phase 2

echo "🧪 TESTS AUTOMATISÉS - SYSTÈME DE GESTION DES CONGÉS"
echo "=================================================="
echo ""

# Configuration
API_BASE="http://localhost:8000/api"
CURRENT_DATE=$(date +%Y-%m-%d)
FUTURE_DATE=$(date -d '+30 days' +%Y-%m-%d)
FAR_FUTURE_DATE=$(date -d '+60 days' +%Y-%m-%d)

# Couleurs pour l'affichage
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction d'affichage des résultats
print_result() {
    local test_name="$1"
    local result="$2"
    local expected="$3"
    
    if [[ "$result" == "$expected" ]]; then
        echo -e "${GREEN}✅ $test_name${NC}"
    else
        echo -e "${RED}❌ $test_name (Attendu: $expected, Reçu: $result)${NC}"
    fi
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Test 1: Vérification de l'état des services
echo -e "${BLUE}1️⃣ Test des Services${NC}"
echo "------------------------"

# Health check
HEALTH_STATUS=$(curl -s "$API_BASE/health" | jq -r '.status' 2>/dev/null)
print_result "API Health Check" "$HEALTH_STATUS" "healthy"

# Vérification des données de base
RULES_COUNT=$(curl -s "$API_BASE/leave-rules" | jq '.data | length' 2>/dev/null)
print_result "Règles de congés chargées" "$RULES_COUNT" "7"

PERIODS_COUNT=$(curl -s "$API_BASE/leave-periods" | jq '.data | length' 2>/dev/null)
print_result "Périodes de référence" "$PERIODS_COUNT" "3"

echo ""

# Test 2: Création d'employé test
echo -e "${BLUE}2️⃣ Test Création Employé${NC}"
echo "----------------------------"

EMPLOYEE_DATA='{
    "first_name": "Test",
    "last_name": "Employee",
    "email": "test.employee.'$(date +%s)'@namie.test",
    "hire_date": "2019-01-15",
    "position": "Testeur",
    "department": "QA",
    "salary": 45000,
    "phone": "0123456789"
}'

EMPLOYEE_RESPONSE=$(curl -s -X POST "$API_BASE/employees" \
    -H "Content-Type: application/json" \
    -d "$EMPLOYEE_DATA")

EMPLOYEE_ID=$(echo "$EMPLOYEE_RESPONSE" | jq -r '.data.id' 2>/dev/null)

if [[ "$EMPLOYEE_ID" != "null" && "$EMPLOYEE_ID" != "" ]]; then
    print_result "Création employé" "SUCCESS" "SUCCESS"
    print_info "ID Employé créé: $EMPLOYEE_ID"
else
    print_result "Création employé" "FAILED" "SUCCESS"
    echo "Réponse: $EMPLOYEE_RESPONSE"
    exit 1
fi

echo ""

# Test 3: Calcul des soldes
echo -e "${BLUE}3️⃣ Test Calcul des Soldes${NC}"
echo "-----------------------------"

# Calcul solde congés payés
BALANCE_REQUEST="{\"employee_id\": $EMPLOYEE_ID, \"year\": 2025}"
ANNUAL_BALANCE_RESPONSE=$(curl -s -X POST "$API_BASE/leave-balances" \
    -H "Content-Type: application/json" \
    -d "$BALANCE_REQUEST")

ANNUAL_DAYS=$(echo "$ANNUAL_BALANCE_RESPONSE" | jq -r '.data[0].allocated_days // .data.allocated_days' 2>/dev/null)
print_result "Calcul solde congés payés" "${ANNUAL_DAYS}" "27.5"

# Calcul solde RTT
RTT_REQUEST="{\"employee_id\": $EMPLOYEE_ID, \"year\": 2025, \"force_recalculate\": true}"
sleep 1 # Éviter les conflits
RTT_BALANCE_RESPONSE=$(curl -s -X POST "$API_BASE/leave-balances" \
    -H "Content-Type: application/json" \
    -d "$RTT_REQUEST")

print_info "Soldes calculés pour l'employé $EMPLOYEE_ID"

echo ""

# Test 4: Validation des règles
echo -e "${BLUE}4️⃣ Test Validation des Règles${NC}"
echo "--------------------------------"

# Test demande valide
VALID_REQUEST="{
    \"employee_id\": $EMPLOYEE_ID,
    \"type\": \"annual\",
    \"start_date\": \"$FUTURE_DATE\",
    \"end_date\": \"$FAR_FUTURE_DATE\",
    \"days_requested\": 5
}"

VALIDATION_RESPONSE=$(curl -s -X POST "$API_BASE/leaves/validate-request" \
    -H "Content-Type: application/json" \
    -d "$VALID_REQUEST")

IS_VALID=$(echo "$VALIDATION_RESPONSE" | jq -r '.data.valid' 2>/dev/null)
print_result "Validation demande valide" "$IS_VALID" "true"

# Test demande invalide (préavis insuffisant)
INVALID_REQUEST="{
    \"employee_id\": $EMPLOYEE_ID,
    \"type\": \"annual\",
    \"start_date\": \"$(date -d '+5 days' +%Y-%m-%d)\",
    \"end_date\": \"$(date -d '+19 days' +%Y-%m-%d)\",
    \"days_requested\": 15
}"

INVALID_VALIDATION=$(curl -s -X POST "$API_BASE/leaves/validate-request" \
    -H "Content-Type: application/json" \
    -d "$INVALID_REQUEST")

IS_INVALID=$(echo "$INVALID_VALIDATION" | jq -r '.data.valid' 2>/dev/null)
print_result "Validation demande invalide" "$IS_INVALID" "false"

echo ""

# Test 5: Création de demande de congé
echo -e "${BLUE}5️⃣ Test Création Demande de Congé${NC}"
echo "------------------------------------"

LEAVE_REQUEST="{
    \"employee_id\": $EMPLOYEE_ID,
    \"type\": \"annual\",
    \"start_date\": \"$FUTURE_DATE\",
    \"end_date\": \"$(date -d '+34 days' +%Y-%m-%d)\",
    \"days_requested\": 5,
    \"reason\": \"Test congés automatisé\"
}"

LEAVE_RESPONSE=$(curl -s -X POST "$API_BASE/leaves" \
    -H "Content-Type: application/json" \
    -d "$LEAVE_REQUEST")

LEAVE_ID=$(echo "$LEAVE_RESPONSE" | jq -r '.data.id' 2>/dev/null)

if [[ "$LEAVE_ID" != "null" && "$LEAVE_ID" != "" ]]; then
    print_result "Création demande de congé" "SUCCESS" "SUCCESS"
    print_info "ID Demande créée: $LEAVE_ID"
else
    print_result "Création demande de congé" "FAILED" "SUCCESS"
    echo "Réponse: $LEAVE_RESPONSE"
fi

echo ""

# Test 6: Gestion des absences
echo -e "${BLUE}6️⃣ Test Gestion des Absences${NC}"
echo "-------------------------------"

ABSENCE_REQUEST="{
    \"employee_id\": $EMPLOYEE_ID,
    \"start_date\": \"$(date -d 'yesterday' +%Y-%m-%d)\",
    \"end_date\": \"$(date -d 'yesterday' +%Y-%m-%d)\",
    \"reason\": \"Test absence automatisé\",
    \"is_sick\": true
}"

ABSENCE_RESPONSE=$(curl -s -X POST "$API_BASE/absences" \
    -H "Content-Type: application/json" \
    -d "$ABSENCE_REQUEST")

ABSENCE_ID=$(echo "$ABSENCE_RESPONSE" | jq -r '.data.id' 2>/dev/null)

if [[ "$ABSENCE_ID" != "null" && "$ABSENCE_ID" != "" ]]; then
    print_result "Création absence" "SUCCESS" "SUCCESS"
    print_info "ID Absence créée: $ABSENCE_ID"
    
    # Vérifier le type d'absence
    ABSENCE_TYPE=$(echo "$ABSENCE_RESPONSE" | jq -r '.data.absence_type' 2>/dev/null)
    print_result "Type d'absence (déclarée à temps)" "$ABSENCE_TYPE" "justified"
else
    print_result "Création absence" "FAILED" "SUCCESS"
fi

echo ""

# Test 7: Statistiques finales
echo -e "${BLUE}7️⃣ Statistiques Finales${NC}"
echo "---------------------------"

# Compter les employés
TOTAL_EMPLOYEES=$(curl -s "$API_BASE/employees" | jq '.data | length' 2>/dev/null)
print_info "Total employés: $TOTAL_EMPLOYEES"

# Compter les demandes de congés
TOTAL_LEAVES=$(curl -s "$API_BASE/leaves" | jq '.data | length' 2>/dev/null)
print_info "Total demandes de congés: $TOTAL_LEAVES"

# Compter les absences
TOTAL_ABSENCES=$(curl -s "$API_BASE/absences" | jq '.data | length' 2>/dev/null)
print_info "Total absences: $TOTAL_ABSENCES"

echo ""

# Nettoyage (optionnel)
echo -e "${YELLOW}🧹 Nettoyage${NC}"
echo "-------------"

read -p "Voulez-vous supprimer les données de test créées ? (y/N) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if [[ "$LEAVE_ID" != "null" && "$LEAVE_ID" != "" ]]; then
        curl -s -X DELETE "$API_BASE/leaves/$LEAVE_ID" > /dev/null
        print_info "Demande de congé supprimée"
    fi
    
    if [[ "$ABSENCE_ID" != "null" && "$ABSENCE_ID" != "" ]]; then
        curl -s -X DELETE "$API_BASE/absences/$ABSENCE_ID" > /dev/null
        print_info "Absence supprimée"
    fi
    
    if [[ "$EMPLOYEE_ID" != "null" && "$EMPLOYEE_ID" != "" ]]; then
        curl -s -X DELETE "$API_BASE/employees/$EMPLOYEE_ID" > /dev/null
        print_info "Employé de test supprimé"
    fi
fi

echo ""
echo -e "${GREEN}🎉 Tests terminés !${NC}"
echo "Consultez les résultats ci-dessus pour vérifier le bon fonctionnement du système."
echo ""
echo "📖 Pour des tests plus détaillés, consultez GUIDE-TEST-CONGES.md"
