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
        perm_name: "user_add",
        perm_description: "Ajouter un utilisateur",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        perm_name: "user_update",
        perm_description: "Modifier un utilisateur",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        perm_name: "user_get",
        perm_description: "Voir un utilisateur",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        perm_name: "user_get_all",
        perm_description: "Voir tous les utilisateurs",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        perm_name: "user_delete",
        perm_description: "Supprimer un utilisateur",
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // ===== GESTION RÔLES =====
      {
        id: uuidv4(),
        perm_name: "role_add",
        perm_description: "Ajouter un rôle",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        perm_name: "role_update",
        perm_description: "Modifier un rôle",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        perm_name: "role_get",
        perm_description: "Voir un rôle",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        perm_name: "role_get_all",
        perm_description: "Voir tous les rôles",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        perm_name: "role_delete",
        perm_description: "Supprimer un rôle",
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // ===== GESTION PERMISSIONS =====
      {
        id: uuidv4(),
        perm_name: "permissions_add",
        perm_description: "Ajouter une permission",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        perm_name: "permissions_update",
        perm_description: "Modifier une permission",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        perm_name: "permissions_get",
        perm_description: "Voir une permission",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        perm_name: "permissions_get_all",
        perm_description: "Voir toutes les permissions",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        perm_name: "permissions_delete",
        perm_description: "Supprimer une permission",
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // ===== GESTION ÉVÉNEMENTS =====
      {
        id: uuidv4(),
        perm_name: "event_create",
        perm_description: "Créer un événement",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        perm_name: "event_update",
        perm_description: "Modifier un événement",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        perm_name: "event_get",
        perm_description: "Voir un événement",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        perm_name: "event_get_all",
        perm_description: "Voir tous les événements",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        perm_name: "event_delete",
        perm_description: "Supprimer un événement",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        perm_name: "event_publish",
        perm_description: "Publier/dépublier un événement",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        perm_name: "event_manage_tickets",
        perm_description: "Gérer les billets d'un événement",
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // ===== GESTION BILLETS =====
      {
        id: uuidv4(),
        perm_name: "ticket_create",
        perm_description: "Créer un type de billet",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        perm_name: "ticket_update",
        perm_description: "Modifier un type de billet",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        perm_name: "ticket_get",
        perm_description: "Voir un billet",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        perm_name: "ticket_get_all",
        perm_description: "Voir tous les billets",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        perm_name: "ticket_delete",
        perm_description: "Supprimer un type de billet",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        perm_name: "ticket_sell",
        perm_description: "Vendre des billets",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        perm_name: "ticket_validate",
        perm_description: "Valider des billets à l'entrée",
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // ===== GESTION PAIEMENTS =====
      {
        id: uuidv4(),
        perm_name: "payment_process",
        perm_description: "Traiter les paiements",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        perm_name: "payment_view",
        perm_description: "Voir les transactions",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        perm_name: "payment_refund",
        perm_description: "Effectuer des remboursements",
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // ===== RAPPORTS ET STATISTIQUES =====
      {
        id: uuidv4(),
        perm_name: "reports_view",
        perm_description: "Voir les rapports",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        perm_name: "stats_view",
        perm_description: "Voir les statistiques",
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // ===== GESTION LIEUX ET TRANSPORTS =====
      {
        id: uuidv4(),
        perm_name: "venue_manage",
        perm_description: "Gérer les lieux d'événements",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        perm_name: "transport_manage",
        perm_description: "Gérer les services de transport",
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