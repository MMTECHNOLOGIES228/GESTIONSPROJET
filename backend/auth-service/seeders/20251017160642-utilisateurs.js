'use strict';
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface, Sequelize) {
    console.log('Début du seeder Utilisateurs...');

    // Récupérer les IDs des rôles
    const roles = await queryInterface.sequelize.query(
      'SELECT id, role_name FROM Roles;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    console.log('Rôles trouvés:', roles);

      if (roles.length === 0) {
        throw new Error('Aucun rôle trouvé dans la base de données. Exécutez d\'abord le seeder des rôles.');
      }


    const rolesMap = {};
    roles.forEach(role => {
      rolesMap[role.role_name] = role.id;
    });

    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const usersData = [
      {
        id: uuidv4(),
        username: 'superadmin',
        email: 'superadmin@projectapp.com',
        password_hash: hashedPassword,
        first_name: 'Super',
        last_name: 'Admin',
        phone_number: '+1234567890',
        is_verified: true,
        is_active: true,
        role_id: rolesMap['Super Admin'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        username: 'orgowner',
        email: 'owner@company.com',
        password_hash: hashedPassword,
        first_name: 'Organization',
        last_name: 'Owner',
        phone_number: '+1234567891',
        is_verified: true,
        is_active: true,
        role_id: rolesMap['Organization Owner'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        username: 'projectmanager',
        email: 'manager@company.com',
        password_hash: hashedPassword,
        first_name: 'Project',
        last_name: 'Manager',
        phone_number: '+1234567892',
        is_verified: true,
        is_active: true,
        role_id: rolesMap['Project Manager'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        username: 'teamlead',
        email: 'lead@company.com',
        password_hash: hashedPassword,
        first_name: 'Team',
        last_name: 'Lead',
        phone_number: '+1234567893',
        is_verified: true,
        is_active: true,
        role_id: rolesMap['Team Lead'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        username: 'member1',
        email: 'member1@company.com',
        password_hash: hashedPassword,
        first_name: 'John',
        last_name: 'Doe',
        phone_number: '+1234567894',
        is_verified: true,
        is_active: true,
        role_id: rolesMap['Member'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        username: 'viewer1',
        email: 'viewer@company.com',
        password_hash: hashedPassword,
        first_name: 'View',
        last_name: 'Only',
        phone_number: '+1234567895',
        is_verified: true,
        is_active: true,
        role_id: rolesMap['Viewer'],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    console.log('Données utilisateurs à insérer:', JSON.stringify(usersData, null, 2));
    
    const result = await queryInterface.bulkInsert('Utilisateurs', usersData, {});
    console.log(`Seeder Utilisateurs terminé. ${result} enregistrements insérés.`);
  },

  async down(queryInterface, Sequelize) {
    console.log('Suppression des données Utilisateurs...');
    await queryInterface.bulkDelete('Utilisateurs', null, {});
    console.log('Données Utilisateurs supprimées.');
  }
};