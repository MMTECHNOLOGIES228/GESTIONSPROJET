'use strict';
const bcrypt = require('bcryptjs');

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
          id: require('uuid').v4(),
          nom: 'Super',
          prenom: 'Admin',
          email: 'superadmin@bg-elearning.com',
          password: hashedPassword,
          phone: '+1234567890',
          roleId: roleMap['Superadmin'],
          status: 'actif',
          emailVerified: true,
          phoneVerified: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: require('uuid').v4(),
          nom: 'Admin',
          prenom: 'System',
          email: 'admin@bg-elearning.com',
          password: hashedPassword,
          phone: '+1234567891',
          roleId: roleMap['Admin'],
          status: 'actif',
          emailVerified: true,
          phoneVerified: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: require('uuid').v4(),
          nom: 'Jean',
          prenom: 'Formateur',
          email: 'formateur@bg-elearning.com',
          password: hashedPassword,
          phone: '+1234567892',
          roleId: roleMap['Formateur'],
          status: 'actif',
          emailVerified: true,
          phoneVerified: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: require('uuid').v4(),
          nom: 'Marie',
          prenom: 'Etudiante',
          email: 'etudiant@bg-elearning.com',
          password: hashedPassword,
          phone: '+1234567893',
          roleId: roleMap['Etudiant'],
          status: 'actif',
          emailVerified: true,
          phoneVerified: true,
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