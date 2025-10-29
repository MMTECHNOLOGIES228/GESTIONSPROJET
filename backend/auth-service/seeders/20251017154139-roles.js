'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    console.log('Début du seeder Roles...');
    
    const rolesData = [
      {
        id: uuidv4(),
        role_name: 'Superadmin',
        role_description: 'Administrateur suprême avec tous les droits',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        role_name: 'Admin',
        role_description: 'Administrateur de la plateforme',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        role_name: 'Formateur',
        role_description: 'Formateur pouvant créer des cours',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        role_name: 'Etudiant',
        role_description: 'Étudiant suivant des cours',
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