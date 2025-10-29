export interface UtilisateurAttributes {
  id: string;
  roleId: string;
  email: string;
  password: string;
  nom: string;
  prenom: string;
  phone: string;
  profilePic: string | null;
  status: 'actif' | 'inactif';
  otp: string;
  cashbackPoints: number;
  }