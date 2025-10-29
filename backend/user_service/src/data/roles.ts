const roles = [
    {
        role_name: "SuperAdmin",
        role_description: "Responsable global du système, avec tous les droits de gestion et configuration.",
        created: new Date()
    },
    {
        role_name: "Admin",
        role_description: "Gère les opérations du système et surveille les transactions.",
        created: new Date()
    },
    {
        role_name: "Staff",
        role_description: "Support opérationnel pour les administrateurs, aide à la gestion quotidienne.",
        created: new Date()
    },
    {
        role_name: "Client",
        role_description: "Utilisateur qui soumet des demandes de publication de statuts à des influenceurs.",
        created: new Date()
    },
    {
        role_name: "Influenceur",
        role_description: "Personne proposant des services de publication de statuts WhatsApp contre rémunération.",
        created: new Date()
    },
    {
        role_name: "Marchand",
        role_description: "Utilisateur ou entreprise utilisant le système pour promouvoir ses produits ou services via des influenceurs.",
        created: new Date()
    },
    {
        role_name: "Organisateur",
        role_description: "Utilisateur ou entreprise utilisant organisateur",
        created: new Date()
    },
    {
        role_name: "Collaborateur",
        role_description: "Utilisateur ou entreprise utilisant collaborateur.",
        created: new Date()
    },
    {
        role_name: "Chauffeur",
        role_description: "Utilisateur additionnel pour d'autres fonctionnalités à définir dans le système (placeholder).",
        created: new Date()
    }
];

export default roles;
