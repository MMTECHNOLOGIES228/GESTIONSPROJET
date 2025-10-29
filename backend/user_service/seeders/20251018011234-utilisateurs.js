'use strict';
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    console.log('🚀 Début du seeder Utilisateurs...');
    
    try {
      // Récupérer les rôles existants
      const [roles] = await queryInterface.sequelize.query(
        'SELECT id, role_name FROM "Roles"'
      );
      
      console.log('👥 Rôles trouvés:', roles);

      // Créer un mapping des noms de rôles vers leurs IDs
      const roleMap = {};
      roles.forEach(role => {
        roleMap[role.role_name] = role.id;
      });

      console.log('🗺️ Mapping des rôles:', roleMap);

      const hashedPassword = await bcrypt.hash('password123', 10);
      
      const utilisateursData = [
        {
          id: uuidv4(),
          nom: 'Super',
          prenom: 'Admin',
          email: 'superadmin@event-system.com',
          password: hashedPassword,
          phone: '+1234567890',
          roleId: roleMap['SuperAdmin'],
          status: 'actif',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: uuidv4(),
          nom: 'Admin',
          prenom: 'System',
          email: 'admin@event-system.com',
          password: hashedPassword,
          phone: '+1234567891',
          roleId: roleMap['Admin'],
          status: 'actif',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: uuidv4(),
          nom: 'Pierre',
          prenom: 'Organisateur',
          email: 'organisateur@event-system.com',
          password: hashedPassword,
          phone: '+1234567892',
          roleId: roleMap['Organisateur'],
          status: 'actif',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: uuidv4(),
          nom: 'Sophie',
          prenom: 'Collaboratrice',
          email: 'collaborateur@event-system.com',
          password: hashedPassword,
          phone: '+1234567893',
          roleId: roleMap['Collaborateur'],
          status: 'actif',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: uuidv4(),
          nom: 'Jean',
          prenom: 'Client',
          email: 'client@event-system.com',
          password: hashedPassword,
          phone: '+1234567894',
          roleId: roleMap['Client'],
          status: 'actif',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: uuidv4(),
          nom: 'Marc',
          prenom: 'Chauffeur',
          email: 'chauffeur@event-system.com',
          password: hashedPassword,
          phone: '+1234567895',
          roleId: roleMap['Chauffeur'],
          status: 'actif',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: uuidv4(),
          nom: 'Luc',
          prenom: 'Staff',
          email: 'staff@event-system.com',
          password: hashedPassword,
          phone: '+1234567896',
          roleId: roleMap['Staff'],
          status: 'actif',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      console.log('📝 Données utilisateurs à insérer:', utilisateursData);

      // Nettoyer d'abord la table
      await queryInterface.bulkDelete('Utilisateurs', null, {});

      // Insérer les utilisateurs
      const result = await queryInterface.bulkInsert('Utilisateurs', utilisateursData, {});
      console.log(` ${result} utilisateurs insérés avec succès`);

    } catch (error) {
      console.error(' Erreur dans le seeder Utilisateurs:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Utilisateurs', null, {});
  }
};