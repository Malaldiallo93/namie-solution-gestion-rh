# 🧪 **Guide de Test Complet - Système de Gestion des Congés**

## **📋 Table des Matières**

1. [Préparation de l'Environnement](#1-préparation-de-lenvironnement)
2. [Test des Soldes de Congés](#2-test-des-soldes-de-congés)
3. [Test des Règles de Validation](#3-test-des-règles-de-validation)
4. [Test du Workflow d'Approbation](#4-test-du-workflow-dapprobation)
5. [Test de Gestion des Absences](#5-test-de-gestion-des-absences)
6. [Test des APIs via Interface](#6-test-des-apis-via-interface)
7. [Scénarios de Test Complets](#7-scénarios-de-test-complets)

---

## **1. Préparation de l'Environnement**

### **🚀 Démarrage des Services**

```bash
# Dans le répertoire racine du projet
./start-all.sh
```

Vérifiez que les services sont actifs :
- **Frontend** : http://localhost:5173
- **Backend** : http://localhost:8000
- **API Health** : http://localhost:8000/api/health

### **📊 Vérification des Données de Base**

```bash
cd hr-backend

# Vérifier les règles de congés
curl -s "http://localhost:8000/api/leave-rules" | jq '.data | length'
# Devrait retourner : 7

# Vérifier les périodes de référence
curl -s "http://localhost:8000/api/leave-periods" | jq '.data | length'
# Devrait retourner : 3

# Vérifier les employés
curl -s "http://localhost:8000/api/employees" | jq '.data | length'
# Devrait retourner : 13+
```

---

## **2. Test des Soldes de Congés**

### **🧮 Calcul Automatique des Soldes**

#### **Test 1 : Employé avec 5+ ans d'ancienneté**

```bash
# Créer un employé test avec ancienneté
curl -X POST "http://localhost:8000/api/employees" \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Marie",
    "last_name": "Martin",
    "email": "marie.martin@namie.test",
    "hire_date": "2018-01-15",
    "position": "Manager",
    "department": "RH",
    "salary": 55000,
    "phone": "0123456789"
  }' | jq '.data.id'

# Noter l'ID retourné (ex: 14)
EMPLOYEE_ID=14

# Calculer les soldes pour cet employé
curl -X POST "http://localhost:8000/api/leave-balances" \
  -H "Content-Type: application/json" \
  -d "{
    \"employee_id\": $EMPLOYEE_ID,
    \"year\": 2025
  }" | jq '.data'
```

**✅ Résultat Attendu :**
- **Congés payés** : 27.5 jours (25 + 2.5 bonus ancienneté)
- **RTT** : 12 jours (5+ ans d'ancienneté)

#### **Test 2 : Consultation des Soldes**

```bash
# Consulter les soldes calculés
curl -s "http://localhost:8000/api/leave-balances?employee_id=$EMPLOYEE_ID&year=2025" | jq '.data'
```

---

## **3. Test des Règles de Validation**

### **🔍 Validation des Demandes de Congés**

#### **Test 3 : Demande Valide (Préavis OK)**

```bash
# Demande avec préavis suffisant (20 jours)
curl -X POST "http://localhost:8000/api/leaves/validate-request" \
  -H "Content-Type: application/json" \
  -d "{
    \"employee_id\": $EMPLOYEE_ID,
    \"type\": \"annual\",
    \"start_date\": \"$(date -d '+20 days' +%Y-%m-%d)\",
    \"end_date\": \"$(date -d '+24 days' +%Y-%m-%d)\",
    \"days_requested\": 5
  }" | jq '.'
```

**✅ Résultat Attendu :**
```json
{
  "success": true,
  "data": {
    "valid": true,
    "errors": [],
    "warnings": [],
    "requires_hr_approval": false
  }
}
```

#### **Test 4 : Demande Invalide (Préavis Insuffisant)**

```bash
# Demande avec préavis insuffisant (5 jours pour 15 jours de congés)
curl -X POST "http://localhost:8000/api/leaves/validate-request" \
  -H "Content-Type: application/json" \
  -d "{
    \"employee_id\": $EMPLOYEE_ID,
    \"type\": \"annual\",
    \"start_date\": \"$(date -d '+5 days' +%Y-%m-%d)\",
    \"end_date\": \"$(date -d '+19 days' +%Y-%m-%d)\",
    \"days_requested\": 15
  }" | jq '.'
```

**✅ Résultat Attendu :**
```json
{
  "success": true,
  "data": {
    "valid": false,
    "errors": ["Préavis de 1 mois requis pour les congés de plus de 5 jours"],
    "warnings": [],
    "requires_hr_approval": false
  }
}
```

#### **Test 5 : Demande Nécessitant Approbation RH**

```bash
# Demande de plus de 10 jours consécutifs
curl -X POST "http://localhost:8000/api/leaves/validate-request" \
  -H "Content-Type: application/json" \
  -d "{
    \"employee_id\": $EMPLOYEE_ID,
    \"type\": \"annual\",
    \"start_date\": \"$(date -d '+35 days' +%Y-%m-%d)\",
    \"end_date\": \"$(date -d '+49 days' +%Y-%m-%d)\",
    \"days_requested\": 15
  }" | jq '.'
```

**✅ Résultat Attendu :**
```json
{
  "data": {
    "requires_hr_approval": true
  }
}
```

---

## **4. Test du Workflow d'Approbation**

### **📝 Création et Approbation de Demandes**

#### **Test 6 : Créer une Demande de Congé**

```bash
# Créer une demande valide
curl -X POST "http://localhost:8000/api/leaves" \
  -H "Content-Type: application/json" \
  -d "{
    \"employee_id\": $EMPLOYEE_ID,
    \"type\": \"annual\",
    \"start_date\": \"$(date -d '+30 days' +%Y-%m-%d)\",
    \"end_date\": \"$(date -d '+34 days' +%Y-%m-%d)\",
    \"days_requested\": 5,
    \"reason\": \"Congés d'été\"
  }" | jq '.data.id'

# Noter l'ID de la demande
LEAVE_ID=5
```

#### **Test 7 : Consulter la Demande**

```bash
curl -s "http://localhost:8000/api/leaves/$LEAVE_ID" | jq '.data | {id, status, approval_level, requires_hr_approval, working_days}'
```

#### **Test 8 : Workflow d'Approbation Manager**

```bash
# Simuler l'approbation par un manager
curl -X POST "http://localhost:8000/api/leaves/$LEAVE_ID/process-approval" \
  -H "Content-Type: application/json" \
  -d '{
    "decision": "approve",
    "comments": "Congés approuvés par le manager"
  }' | jq '.data | {status, approval_level}'
```

---

## **5. Test de Gestion des Absences**

### **⚠️ Déclaration et Validation d'Absences**

#### **Test 9 : Déclarer une Absence Justifiée**

```bash
# Absence déclarée dans les temps
curl -X POST "http://localhost:8000/api/absences" \
  -H "Content-Type: application/json" \
  -d "{
    \"employee_id\": $EMPLOYEE_ID,
    \"start_date\": \"$(date -d 'yesterday' +%Y-%m-%d)\",
    \"end_date\": \"$(date -d 'yesterday' +%Y-%m-%d)\",
    \"reason\": \"Maladie\",
    \"is_sick\": true
  }" | jq '.data.id'

ABSENCE_ID=1
```

#### **Test 10 : Consulter l'Absence**

```bash
curl -s "http://localhost:8000/api/absences/$ABSENCE_ID" | jq '.data | {absence_type, declared_on_time, medical_certificate_required, requires_action}'
```

#### **Test 11 : Absences Nécessitant Attention**

```bash
curl -s "http://localhost:8000/api/absences/requires-attention" | jq '.count'
```

---

## **6. Test des APIs via Interface**

### **🖥️ Tests dans le Navigateur**

1. **Accédez à l'application** : http://localhost:5173

2. **Page Employés** :
   - Vérifiez la liste des employés
   - Consultez les détails d'un employé
   - Vérifiez les soldes de congés affichés

3. **Page Congés** :
   - Créez une nouvelle demande
   - Vérifiez les validations en temps réel
   - Testez les différents types de congés

4. **Page Absences** :
   - Déclarez une absence
   - Uploadez un justificatif (si implémenté)
   - Consultez l'historique

---

## **7. Scénarios de Test Complets**

### **🎯 Scénario A : Employé Expérimenté**

```bash
# 1. Créer employé senior (8 ans d'ancienneté)
curl -X POST "http://localhost:8000/api/employees" \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Pierre",
    "last_name": "Durand",
    "email": "pierre.durand@namie.test",
    "hire_date": "2016-03-01",
    "position": "Directeur",
    "department": "Direction",
    "salary": 75000
  }' | jq '.data.id'

SENIOR_ID=15

# 2. Calculer soldes (devrait avoir 27.5j + 12j RTT)
curl -X POST "http://localhost:8000/api/leave-balances" \
  -H "Content-Type: application/json" \
  -d "{\"employee_id\": $SENIOR_ID, \"year\": 2025}"

# 3. Demander 3 semaines de congés (nécessite approbation RH)
curl -X POST "http://localhost:8000/api/leaves" \
  -H "Content-Type: application/json" \
  -d "{
    \"employee_id\": $SENIOR_ID,
    \"type\": \"annual\",
    \"start_date\": \"2025-07-15\",
    \"end_date\": \"2025-08-05\",
    \"days_requested\": 21,
    \"reason\": \"Congés d'été obligatoires\"
  }"
```

### **🎯 Scénario B : Nouveau Employé**

```bash
# 1. Créer nouvel employé (6 mois d'ancienneté)
curl -X POST "http://localhost:8000/api/employees" \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Sophie",
    "last_name": "Bernard",
    "email": "sophie.bernard@namie.test",
    "hire_date": "2025-02-01",
    "position": "Stagiaire",
    "department": "IT",
    "salary": 25000
  }' | jq '.data.id'

JUNIOR_ID=16

# 2. Calculer soldes (devrait avoir 25j + 8j RTT)
curl -X POST "http://localhost:8000/api/leave-balances" \
  -H "Content-Type: application/json" \
  -d "{\"employee_id\": $JUNIOR_ID, \"year\": 2025}"

# 3. Demander RTT avec préavis court (devrait être accepté)
curl -X POST "http://localhost:8000/api/leaves" \
  -H "Content-Type: application/json" \
  -d "{
    \"employee_id\": $JUNIOR_ID,
    \"type\": \"rtt\",
    \"start_date\": \"$(date -d '+10 days' +%Y-%m-%d)\",
    \"end_date\": \"$(date -d '+10 days' +%Y-%m-%d)\",
    \"days_requested\": 1,
    \"reason\": \"RTT\"
  }"
```

---

## **📊 Vérifications Finales**

### **Statistiques Globales**

```bash
# Nombre total d'employés
curl -s "http://localhost:8000/api/employees" | jq '.data | length'

# Nombre de règles actives
curl -s "http://localhost:8000/api/leave-rules" | jq '.data | map(select(.is_active)) | length'

# Soldes calculés
curl -s "http://localhost:8000/api/leave-balances?employee_id=1&year=2025" | jq '.data'

# Demandes en attente
curl -s "http://localhost:8000/api/leaves" | jq '.data | map(select(.status == "pending")) | length'
```

---

## **🔧 Dépannage**

### **Problèmes Courants**

1. **Erreur 404 sur les APIs** :
   ```bash
   php artisan route:list | grep leave
   ```

2. **Données manquantes** :
   ```bash
   php artisan db:seed --class=LeaveRuleSeeder
   php artisan db:seed --class=LeavePeriodSeeder
   ```

3. **Permissions manquantes** :
   ```bash
   php artisan tinker
   >>> User::first()->assignRole('super_admin')
   ```

---

## **✅ Checklist de Validation**

- [ ] Services démarrés (Frontend + Backend)
- [ ] Données de base créées (règles + périodes)
- [ ] Calcul des soldes fonctionnel
- [ ] Validation des règles opérationnelle
- [ ] Workflow d'approbation testé
- [ ] Gestion des absences fonctionnelle
- [ ] APIs accessibles et répondent correctement
- [ ] Interface utilisateur cohérente avec l'API

---

**🎉 Félicitations !** Si tous les tests passent, votre système de gestion des congés Namie est **pleinement opérationnel** et prêt pour la production !
