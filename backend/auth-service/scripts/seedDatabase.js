const { sequelize } = require('../models');
const roleSeeder = require('../seeders/001-create-roles');
const permissionSeeder = require('../seeders/002-create-permissions');
const userSeeder = require('../seeders/003-create-users');

async function seedDatabase() {
  try {
    console.log('🚀 Démarrage du seeding de la base de données...');
    
    // Vérifier la connexion à la base de données
    await sequelize.authenticate();
    console.log('✅ Connexion à la base de données établie');
    
    // Exécuter les seeders dans l'ordre
    console.log('📝 Création des rôles...');
    await roleSeeder.up(sequelize.getQueryInterface(), sequelize.Sequelize);
    
    console.log('📝 Création des permissions...');
    await permissionSeeder.up(sequelize.getQueryInterface(), sequelize.Sequelize);
    
    console.log('👥 Création des utilisateurs...');
    await userSeeder.up(sequelize.getQueryInterface(), sequelize.Sequelize);
    
    console.log('✅ Tous les seeders ont été exécutés avec succès !');
    
  } catch (error) {
    console.error('❌ Erreur lors du seeding:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

// Exécuter le script
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;