'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    console.log('🚀 Début du seeder Permissions...');
    
    // Nettoyer d'abord la table
    await queryInterface.bulkDelete('Permissions', null, {});
    
    const permissionsData = [
      // ===== GESTION UTILISATEURS =====
      {
        id: uuidv4(),
        perm_name: 'gestion_utilisateurs',
        perm_description: 'Peut gérer tous les utilisateurs',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        perm_name: 'voir_utilisateurs',
        perm_description: 'Peut voir la liste des utilisateurs',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        perm_name: 'creer_utilisateur',
        perm_description: 'Peut créer de nouveaux utilisateurs',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        perm_name: 'modifier_utilisateur',
        perm_description: 'Peut modifier les informations utilisateur',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        perm_name: 'supprimer_utilisateur',
        perm_description: 'Peut supprimer des utilisateurs',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        perm_name: 'activer_desactiver_utilisateur',
        perm_description: 'Peut activer/désactiver des comptes utilisateur',
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // ===== GESTION COURS =====
      {
        id: uuidv4(),
        perm_name: 'gestion_cours',
        perm_description: 'Peut gérer tous les cours',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        perm_name: 'voir_cours',
        perm_description: 'Peut voir la liste des cours',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        perm_name: 'creer_cours',
        perm_description: 'Peut créer des cours',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        perm_name: 'modifier_cours',
        perm_description: 'Peut modifier les cours',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        perm_name: 'supprimer_cours',
        perm_description: 'Peut supprimer des cours',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        perm_name: 'publier_cours',
        perm_description: 'Peut publier/dépublier des cours',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        perm_name: 'moderer_cours',
        perm_description: 'Peut modérer le contenu des cours',
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // ===== GESTION CONTENU PÉDAGOGIQUE =====
      {
        id: uuidv4(),
        perm_name: 'gestion_contenu',
        perm_description: 'Peut gérer le contenu pédagogique',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        perm_name: 'ajouter_module',
        perm_description: 'Peut ajouter des modules aux cours',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        perm_name: 'ajouter_lecon',
        perm_description: 'Peut ajouter des leçons aux modules',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        perm_name: 'upload_fichiers',
        perm_description: 'Peut uploader des fichiers multimédias',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        perm_name: 'gerer_ressources',
        perm_description: 'Peut gérer les ressources pédagogiques',
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // ===== INTERACTION ÉTUDIANTS =====
      {
        id: uuidv4(),
        perm_name: 'suivre_cours',
        perm_description: 'Peut suivre des cours',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        perm_name: 's_inscrire_cours',
        perm_description: 'Peut s\'inscrire à des cours',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        perm_name: 'acces_contenu',
        perm_description: 'Peut accéder au contenu des cours',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        perm_name: 'completer_lecon',
        perm_description: 'Peut marquer les leçons comme complétées',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        perm_name: 'passer_quiz',
        perm_description: 'Peut passer les quiz et évaluations',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        perm_name: 'voir_progression',
        perm_description: 'Peut voir sa progression dans les cours',
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // ===== ÉVALUATIONS ET CERTIFICATS =====
      {
        id: uuidv4(),
        perm_name: 'creer_quiz',
        perm_description: 'Peut créer des quiz et évaluations',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        perm_name: 'corriger_quiz',
        perm_description: 'Peut corriger les quiz des étudiants',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        perm_name: 'gerer_certificats',
        perm_description: 'Peut gérer les certificats de formation',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        perm_name: 'generer_certificat',
        perm_description: 'Peut générer des certificats',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        perm_name: 'voir_notes',
        perm_description: 'Peut voir les notes et résultats',
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // ===== GESTION RÔLES ET PERMISSIONS =====
      {
        id: uuidv4(),
        perm_name: 'gestion_roles',
        perm_description: 'Peut gérer les rôles et permissions',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        perm_name: 'attribuer_roles',
        perm_description: 'Peut attribuer des rôles aux utilisateurs',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        perm_name: 'gerer_permissions',
        perm_description: 'Peut gérer les permissions des rôles',
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // ===== ADMINISTRATION SYSTÈME =====
      {
        id: uuidv4(),
        perm_name: 'administration_systeme',
        perm_description: 'Accès à l\'administration complète du système',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        perm_name: 'voir_statistiques',
        perm_description: 'Peut voir les statistiques de la plateforme',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        perm_name: 'gerer_parametres',
        perm_description: 'Peut gérer les paramètres de la plateforme',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        perm_name: 'backup_restore',
        perm_description: 'Peut faire des sauvegardes et restaurations',
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // ===== COMMUNICATION =====
      {
        id: uuidv4(),
        perm_name: 'gerer_forum',
        perm_description: 'Peut gérer les forums de discussion',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        perm_name: 'moderer_forum',
        perm_description: 'Peut modérer les messages du forum',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        perm_name: 'envoyer_notifications',
        perm_description: 'Peut envoyer des notifications aux utilisateurs',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        perm_name: 'gerer_messagerie',
        perm_description: 'Peut gérer la messagerie interne',
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // ===== FINANCIER =====
      {
        id: uuidv4(),
        perm_name: 'gerer_paiements',
        perm_description: 'Peut gérer les paiements et abonnements',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        perm_name: 'voir_rapports_financiers',
        perm_description: 'Peut voir les rapports financiers',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        perm_name: 'gerer_tarifs',
        perm_description: 'Peut gérer les tarifs des cours',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    console.log(` Insertion de ${permissionsData.length} permissions...`);
    
    const result = await queryInterface.bulkInsert('Permissions', permissionsData, {});
    console.log(` ${result} permissions insérées avec succès`);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Permissions', null, {});
  }
};