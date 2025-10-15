# 🧪 **Tests Manuels Rapides - Système de Gestion des Congés**

## **🚀 Tests Immédiats (5 minutes)**

### **1. Vérification des Services**

```bash
# Vérifier que l'API fonctionne
curl -s "http://localhost:8000/api/health" | jq '.'

# Résultat attendu :
# {
#   "status": "healthy",
#   "timestamp": "2025-08-16T12:XX:XX.XXXXXXZ"
# }
```

### **2. Test des Données de Base**

```bash
# Vérifier les règles de congés
curl -s "http://localhost:8000/api/leave-rules" | jq '.data | length'
# Résultat attendu : 7

# Vérifier les employés existants
curl -s "http://localhost:8000/api/employees" | jq '.data | length'
# Résultat attendu : 13+

# Voir un employé spécifique
curl -s "http://localhost:8000/api/employees/1" | jq '.data | {id, first_name, last_name, hire_date}'
```

### **3. Test Calcul des Soldes**

```bash
# Calculer les soldes pour l'employé ID 1
curl -X POST "http://localhost:8000/api/leave-balances" \
  -H "Content-Type: application/json" \
  -d '{
    "employee_id": 1,
    "year": 2025
  }' | jq '.data'

# Consulter les soldes calculés
curl -s "http://localhost:8000/api/leave-balances?employee_id=1&year=2025" | jq '.data'
```

### **4. Test Validation Simple**

```bash
# Test validation demande valide (avec dates fixes)
curl -X POST "http://localhost:8000/api/leaves/validate-request" \
  -H "Content-Type: application/json" \
  -d '{
    "employee_id": 1,
    "type": "annual",
    "start_date": "2025-09-15",
    "end_date": "2025-09-19",
    "days_requested": 5
  }' | jq '.data'

# Résultat attendu : {"valid": true, "requires_hr_approval": false}
```

### **5. Test Création Demande**

```bash
# Créer une demande de congé
curl -X POST "http://localhost:8000/api/leaves" \
  -H "Content-Type: application/json" \
  -d '{
    "employee_id": 1,
    "type": "annual",
    "start_date": "2025-09-15",
    "end_date": "2025-09-19",
    "days_requested": 5,
    "reason": "Test manuel congés"
  }' | jq '.data | {id, status, approval_level, working_days}'
```

### **6. Test Absence**

```bash
# Déclarer une absence
curl -X POST "http://localhost:8000/api/absences" \
  -H "Content-Type: application/json" \
  -d '{
    "employee_id": 1,
    "start_date": "2025-08-15",
    "end_date": "2025-08-15",
    "reason": "Test absence manuelle",
    "is_sick": true
  }' | jq '.data | {id, absence_type, declared_on_time, medical_certificate_required}'
```

---

## **🖥️ Tests Interface Utilisateur**

### **Accès à l'Application**
1. **Ouvrez** : http://localhost:5173
2. **Vérifiez** que la page se charge correctement

### **Navigation Rapide**
1. **Dashboard** : Vérifiez les statistiques affichées
2. **Employés** : Consultez la liste et les détails
3. **Congés** : Testez le formulaire de demande
4. **Absences** : Testez la déclaration d'absence

---

## **✅ Checklist de Validation Rapide**

### **APIs Fonctionnelles**
- [ ] `/api/health` retourne "healthy"
- [ ] `/api/employees` retourne la liste
- [ ] `/api/leave-rules` retourne 7 règles
- [ ] `/api/leave-balances` calcule correctement
- [ ] `/api/leaves` crée des demandes
- [ ] `/api/absences` enregistre les absences

### **Logique Métier**
- [ ] Calcul soldes selon ancienneté (25j + bonus)
- [ ] RTT selon ancienneté (8j/10j/12j)
- [ ] Validation préavis (15j ou 1 mois)
- [ ] Approbation RH si >10 jours
- [ ] Certificat médical si maladie >3j

### **Interface Utilisateur**
- [ ] Pages se chargent sans erreur
- [ ] Formulaires fonctionnels
- [ ] Données affichées correctement
- [ ] Navigation fluide

---

## **🎯 Tests de Scénarios Réels**

### **Scénario A : Employé Expérimenté**
```bash
# 1. Voir les employés avec ancienneté
curl -s "http://localhost:8000/api/employees" | jq '.data[] | select(.hire_date < "2020-01-01") | {id, first_name, last_name, hire_date}'

# 2. Calculer soldes pour un employé ancien (ex: ID 2)
curl -X POST "http://localhost:8000/api/leave-balances" -H "Content-Type: application/json" -d '{"employee_id": 2, "year": 2025}' | jq '.data'

# 3. Demander longues vacances (>10j = approbation RH)
curl -X POST "http://localhost:8000/api/leaves/validate-request" -H "Content-Type: application/json" -d '{
  "employee_id": 2,
  "type": "annual", 
  "start_date": "2025-07-15",
  "end_date": "2025-08-05",
  "days_requested": 21
}' | jq '.data.requires_hr_approval'
# Résultat attendu : true
```

### **Scénario B : Validation des Erreurs**
```bash
# Test préavis insuffisant
curl -X POST "http://localhost:8000/api/leaves/validate-request" -H "Content-Type: application/json" -d '{
  "employee_id": 1,
  "type": "annual",
  "start_date": "2025-08-20",
  "end_date": "2025-09-05",
  "days_requested": 15
}' | jq '.data | {valid, errors}'
# Résultat attendu : valid: false, erreur préavis
```

---

## **📊 Résultats Attendus**

### **Soldes Typiques**
- **Employé 0-5 ans** : 25j congés + 8-10j RTT
- **Employé 5+ ans** : 27.5j congés + 12j RTT
- **Employé 10+ ans** : 30j congés + 12j RTT

### **Règles de Validation**
- **Préavis** : 15j pour ≤5j, 1 mois pour >5j
- **Approbation RH** : >10j consécutifs, congés spéciaux
- **Certificat médical** : Maladie ≥4j
- **Période été** : 2 semaines minimum juillet-août

### **Workflow**
- **Demande** → **Validation règles** → **Approbation manager** → **Approbation RH** (si nécessaire) → **Déduction solde**

---

## **🚨 Dépannage Rapide**

### **Si l'API ne répond pas**
```bash
# Vérifier les services
ps aux | grep php
ps aux | grep node

# Redémarrer si nécessaire
./stop-all.sh
./start-all.sh
```

### **Si données manquantes**
```bash
cd hr-backend
php artisan db:seed --class=LeaveRuleSeeder
php artisan db:seed --class=LeavePeriodSeeder
```

### **Si erreurs de validation**
```bash
# Vérifier les logs
tail -f hr-backend/storage/logs/laravel.log
```

---

**🎉 Si tous ces tests passent, votre système de gestion des congés est 100% fonctionnel !**

**📖 Pour des tests plus approfondis, consultez :**
- `GUIDE-TEST-CONGES.md` - Guide détaillé
- `GUIDE-TEST-INTERFACE.md` - Tests interface utilisateur
