# 🖥️ **Guide de Test Interface Utilisateur - Congés**

## **🚀 Démarrage Rapide**

1. **Lancez l'application** :
   ```bash
   ./start-all.sh
   ```

2. **Accédez à l'interface** : http://localhost:5173

---

## **📋 Tests par Page**

### **1. Page Dashboard (Accueil)**

**🎯 À vérifier :**
- [ ] Statistiques des congés affichées
- [ ] Alertes pour demandes en attente
- [ ] Graphiques de répartition des congés
- [ ] Indicateurs de soldes globaux

**💡 Actions de test :**
- Vérifiez que les chiffres correspondent aux données réelles
- Cliquez sur les graphiques pour voir les détails

### **2. Page Employés**

**🎯 À vérifier :**
- [ ] Liste complète des employés
- [ ] Numéros matricule format NAM-YYYY-XXXX
- [ ] Informations d'ancienneté correctes
- [ ] Soldes de congés par employé

**💡 Actions de test :**
1. **Créer un nouvel employé** :
   - Nom : "Test User"
   - Email : test.user@namie.test
   - Date d'embauche : 2020-01-15 (pour avoir de l'ancienneté)
   - Poste : "Testeur"
   - Département : "QA"

2. **Vérifier le calcul automatique** :
   - Solde congés payés : 27.5 jours (25 + 2.5 ancienneté)
   - Solde RTT : 12 jours (5+ ans d'ancienneté)

### **3. Page Congés**

**🎯 À vérifier :**
- [ ] Formulaire de demande de congé
- [ ] Validation en temps réel des règles
- [ ] Liste des demandes existantes
- [ ] Statuts d'approbation

**💡 Actions de test :**

#### **Test A : Demande Valide**
1. **Créer une demande** :
   - Type : Congés payés
   - Du : Dans 30 jours
   - Au : Dans 34 jours (5 jours)
   - Motif : "Test congés d'été"

2. **Vérifier** :
   - ✅ Validation automatique réussie
   - ✅ Pas d'approbation RH requise
   - ✅ Statut : "En attente d'approbation manager"

#### **Test B : Demande Invalide**
1. **Créer une demande** :
   - Type : Congés payés
   - Du : Dans 5 jours
   - Au : Dans 19 jours (15 jours)
   - Motif : "Test préavis court"

2. **Vérifier** :
   - ❌ Erreur : "Préavis de 1 mois requis"
   - ❌ Bouton "Soumettre" désactivé

#### **Test C : Demande Nécessitant RH**
1. **Créer une demande** :
   - Type : Congés payés
   - Du : Dans 60 jours
   - Au : Dans 80 jours (21 jours)
   - Motif : "Longues vacances"

2. **Vérifier** :
   - ⚠️ Warning : "Approbation RH requise (>10 jours)"
   - ✅ Demande créée avec niveau "Manager + RH"

### **4. Page Absences**

**🎯 À vérifier :**
- [ ] Formulaire de déclaration d'absence
- [ ] Calcul automatique "déclaré à temps"
- [ ] Gestion des certificats médicaux
- [ ] Liste des absences avec statuts

**💡 Actions de test :**

#### **Test A : Absence Déclarée à Temps**
1. **Déclarer une absence** :
   - Date : Hier
   - Heure de déclaration : Maintenant (avant 9h si possible)
   - Motif : "Maladie"
   - Type : Maladie (cocher)

2. **Vérifier** :
   - ✅ Type : "Justifiée"
   - ✅ "Déclarée à temps" : Oui
   - ✅ Certificat médical : Non requis (1 jour)

#### **Test B : Absence Injustifiée**
1. **Déclarer une absence** :
   - Date : Il y a 3 jours
   - Motif : "Absence non prévue"

2. **Vérifier** :
   - ❌ Type : "Injustifiée"
   - ❌ "Déclarée à temps" : Non
   - ⚠️ Retenue salariale calculée

### **5. Page Mon Équipe (Manager)**

**🎯 À vérifier :**
- [ ] Demandes en attente d'approbation
- [ ] Historique des décisions
- [ ] Alertes d'absences injustifiées
- [ ] Soldes d'équipe

**💡 Actions de test :**
1. **Approuver une demande** :
   - Cliquer sur "Approuver"
   - Ajouter un commentaire
   - Vérifier le changement de statut

2. **Rejeter une demande** :
   - Cliquer sur "Rejeter"
   - Motif obligatoire
   - Notification à l'employé

---

## **🔍 Points de Contrôle Critiques**

### **Calculs Automatiques**
- [ ] Soldes selon ancienneté corrects
- [ ] Déduction automatique lors d'approbation
- [ ] Remboursement lors d'annulation
- [ ] Calcul des jours ouvrés (hors weekends/fériés)

### **Règles Métier**
- [ ] Préavis 15j pour <5j, 1 mois pour >5j
- [ ] Approbation RH pour >10j consécutifs
- [ ] Certificat médical dès 4j d'arrêt
- [ ] Période d'été obligatoire (juillet-août)

### **Workflow d'Approbation**
- [ ] Manager → RH si nécessaire
- [ ] Notifications automatiques
- [ ] Historique des approbations
- [ ] Annulation possible avant validation

### **Gestion des Erreurs**
- [ ] Messages d'erreur clairs
- [ ] Validation côté client
- [ ] Gestion des cas limites
- [ ] Feedback utilisateur approprié

---

## **🎯 Scénarios de Test Complets**

### **Scénario 1 : Employé Senior (5+ ans)**
1. Créer employé avec date d'embauche 2018
2. Vérifier soldes : 27.5j congés + 12j RTT
3. Demander 3 semaines d'été → Approbation RH
4. Demander 1j RTT → Approbation manager seule

### **Scénario 2 : Nouveau Employé (<2 ans)**
1. Créer employé récent (2024)
2. Vérifier soldes : 25j congés + 8j RTT
3. Demander congés avec préavis court → Rejet
4. Déclarer absence tardive → Injustifiée

### **Scénario 3 : Manager RH**
1. Voir toutes les demandes en attente
2. Approuver demandes standards
3. Traiter demandes nécessitant RH
4. Consulter absences nécessitant attention

---

## **📊 Indicateurs de Réussite**

### **Performance**
- [ ] Pages se chargent en <2 secondes
- [ ] Calculs instantanés
- [ ] Pas d'erreurs console
- [ ] Interface responsive

### **Fonctionnalité**
- [ ] Toutes les règles métier respectées
- [ ] Workflow complet fonctionnel
- [ ] Notifications appropriées
- [ ] Audit trail complet

### **Expérience Utilisateur**
- [ ] Interface intuitive
- [ ] Messages d'aide clairs
- [ ] Feedback visuel approprié
- [ ] Navigation fluide

---

## **🚨 Que Faire en Cas de Problème**

### **Erreurs d'API**
1. Vérifier que le backend fonctionne : http://localhost:8000/api/health
2. Consulter les logs : `tail -f hr-backend/storage/logs/laravel.log`
3. Redémarrer les services : `./stop-all.sh && ./start-all.sh`

### **Données Manquantes**
```bash
cd hr-backend
php artisan db:seed --class=LeaveRuleSeeder
php artisan db:seed --class=LeavePeriodSeeder
```

### **Interface Non Responsive**
1. Vider le cache navigateur
2. Vérifier la console développeur
3. Redémarrer le frontend : `npm run dev`

---

**✅ Validation Finale**

Si tous ces tests passent, votre système de gestion des congés est **entièrement fonctionnel** et prêt pour vos utilisateurs !

**📞 Support** : Consultez les logs et guides techniques pour tout problème technique.
