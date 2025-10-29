'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    console.log('🚀 Début du seeder Roles...');
    
    // Nettoyer d'abord la table
    await queryInterface.bulkDelete('Roles', null, {});
    
    const rolesData = [
      {
        id: uuidv4(),
        role_name: "SuperAdmin",
        role_description: "Responsable global du système, avec tous les droits de gestion et configuration.",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        role_name: "Admin",
        role_description: "Gère les opérations du système et surveille les transactions.",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        role_name: "Staff",
        role_description: "Support opérationnel pour les administrateurs, aide à la gestion quotidienne.",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        role_name: "Client",
        role_description: "Utilisateur qui achète des billets pour des événements.",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        role_name: "Organisateur",
        role_description: "Crée et gère des événements, vend des billets.",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        role_name: "Collaborateur",
        role_description: "Assiste l'organisateur dans la gestion des événements.",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        role_name: "Chauffeur",
        role_description: "Service de transport pour les événements.",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    console.log(` Insertion de ${rolesData.length} rôles...`);
    
    const result = await queryInterface.bulkInsert('Roles', rolesData, {});
    console.log(` ${result} rôles insérés avec succès`);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Roles', null, {});
  }
};