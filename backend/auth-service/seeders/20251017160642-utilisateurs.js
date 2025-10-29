
'use strict';
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface, Sequelize) {
    console.log('Début du seeder Utilisateurs...');

    try {
      // Récupérer les IDs des rôles
      const roles = await queryInterface.sequelize.query(
        'SELECT id, role_name FROM "Roles";',
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
          roleId: rolesMap['Super Admin'],
          email: 'superadmin@projectapp.com',
          phone: '+1234567890',
          password: hashedPassword,
          nom: 'Admin',
          prenom: 'Super',

          status: 'actif',
          emailVerified: true,
          phoneVerified: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: uuidv4(),
          roleId: rolesMap['Organization Owner'],
          email: 'owner@company.com',
          phone: '+1234567891',
          password: hashedPassword,
          nom: 'Owner',
          prenom: 'Organization',
          status: 'actif',

          emailVerified: true,
          phoneVerified: true,

          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: uuidv4(),
          roleId: rolesMap['Organization Admin'],
          email: 'admin@company.com',
          phone: '+1234567892',
          password: hashedPassword,
          nom: 'Admin',
          prenom: 'Organization',

          status: 'actif',


          emailVerified: true,
          phoneVerified: true,


          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: uuidv4(),
          roleId: rolesMap['Project Manager'],
          email: 'manager@company.com',
          phone: '+1234567893',
          password: hashedPassword,
          nom: 'Manager',
          prenom: 'Project',

          status: 'actif',


          emailVerified: true,
          phoneVerified: true,


          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: uuidv4(),
          roleId: rolesMap['Team Lead'],
          email: 'lead@company.com',
          phone: '+1234567894',
          password: hashedPassword,
          nom: 'Lead',
          prenom: 'Team',

          status: 'actif',


          emailVerified: true,
          phoneVerified: true,


          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: uuidv4(),
          roleId: rolesMap['Member'],
          email: 'member1@company.com',
          phone: '+1234567895',
          password: hashedPassword,
          nom: 'Doe',
          prenom: 'John',

          status: 'actif',


          emailVerified: true,
          phoneVerified: true,


          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: uuidv4(),
          roleId: rolesMap['Viewer'],
          email: 'viewer@company.com',
          phone: '+1234567896',
          password: hashedPassword,
          nom: 'Only',
          prenom: 'View',

          status: 'actif',


          emailVerified: true,
          phoneVerified: true,


          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      console.log('Données utilisateurs à insérer:', JSON.stringify(usersData, null, 2));

      const result = await queryInterface.bulkInsert('Utilisateurs', usersData, {});
      console.log(`Seeder Utilisateurs terminé. ${result} enregistrements insérés.`);
    } catch (error) {
      console.error('Erreur lors du seeder Utilisateurs:', error);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    console.log('Suppression des données Utilisateurs...');
    await queryInterface.bulkDelete('Utilisateurs', null, {});
    console.log('Données Utilisateurs supprimées.');
  }
};