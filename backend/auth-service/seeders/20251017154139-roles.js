'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    console.log('Début du seeder Roles...');

    const rolesData = [
      {
        id: uuidv4(),
        role_name: 'Super Admin',
        role_description: 'Administrateur suprême avec tous les droits sur toutes les organisations',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        role_name: 'Organization Owner',
        role_description: 'Propriétaire de l\'organisation avec tous les droits dans son organisation',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        role_name: 'Organization Admin',
        role_description: 'Administrateur de l\'organisation avec des droits étendus',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        role_name: 'Project Manager',
        role_description: 'Gestionnaire de projets pouvant créer et gérer des projets',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        role_name: 'Team Lead',
        role_description: 'Responsable d\'équipe pouvant assigner des tâches',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        role_name: 'Member',
        role_description: 'Membre standard pouvant travailler sur les tâches',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        role_name: 'Viewer',
        role_description: 'Observateur avec accès en lecture seule',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];


    console.log('Données à insérer:', JSON.stringify(rolesData, null, 2));

    const result = await queryInterface.bulkInsert('Roles', rolesData, {});
    console.log(`Seeder Roles terminé. ${result} enregistrements insérés.`);
  },

  async down(queryInterface, Sequelize) {
    console.log('Suppression des données Roles...');
    await queryInterface.bulkDelete('Roles', null, {});
    console.log('Données Roles supprimées.');
  }
};