'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    console.log('Début du seeder Permissions pour la gestion de projets...');
    
    const permissionsData = [
      // Permissions Organisation
      {
        id: uuidv4(),
        perm_name: 'organization:read',
        perm_description: 'Lire les informations de l\'organisation',
        
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        perm_name: 'organization:write',
        perm_description: 'Modifier les informations de l\'organisation',
        
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        perm_name: 'organization:delete',
        perm_description: 'Supprimer l\'organisation',
        
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        perm_name: 'organization:manage_members',
        perm_description: 'Gérer les membres de l\'organisation',
        
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Permissions Projets
      {
        id: uuidv4(),
        perm_name: 'project:create',
        perm_description: 'Créer de nouveaux projets',
        
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        perm_name: 'project:read',
        perm_description: 'Voir les projets',
        
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        perm_name: 'project:write',
        perm_description: 'Modifier les projets',
       
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        perm_name: 'project:delete',
        perm_description: 'Supprimer les projets',
       
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        perm_name: 'project:manage_members',
        perm_description: 'Gérer les membres du projet',
        
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Permissions Tâches
      {
        id: uuidv4(),
        perm_name: 'task:create',
        perm_description: 'Créer de nouvelles tâches',
        
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        perm_name: 'task:read',
        perm_description: 'Voir les tâches',
        
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        perm_name: 'task:write',
        perm_description: 'Modifier les tâches',
        
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        perm_name: 'task:delete',
        perm_description: 'Supprimer les tâches',
        
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        perm_name: 'task:assign',
        perm_description: 'Assigner des tâches',
        
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Permissions Commentaires
      {
        id: uuidv4(),
        perm_name: 'comment:create',
        perm_description: 'Créer des commentaires',
        
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        perm_name: 'comment:read',
        perm_description: 'Lire les commentaires',
        
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        perm_name: 'comment:write',
        perm_description: 'Modifier les commentaires',
        
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        perm_name: 'comment:delete',
        perm_description: 'Supprimer les commentaires',
        
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Permissions Utilisateurs
      {
        id: uuidv4(),
        perm_name: 'user:manage',
        perm_description: 'Gérer les utilisateurs',
        
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        perm_name: 'user:invite',
        perm_description: 'Inviter des utilisateurs',
        
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    console.log('Données à insérer:', JSON.stringify(permissionsData, null, 2));
    
    const result = await queryInterface.bulkInsert('Permissions', permissionsData, {});
    console.log(`Seeder Permissions terminé. ${result} enregistrements insérés.`);
  },

  async down(queryInterface, Sequelize) {
    console.log('Suppression des données Permissions...');
    await queryInterface.bulkDelete('Permissions', null, {});
    console.log('Données Permissions supprimées.');
  }
};