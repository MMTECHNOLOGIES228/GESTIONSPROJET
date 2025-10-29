

export interface UtilisateurAttributes {
  id?: string;
  roleId: string;
  email?: string;
  phone?: string;
  password?: string;
  nom: string;
  prenom: string;
  profilePic: string | null;
  status: 'actif' | 'inactif' | 'en_attente';
  passwordChanged?: boolean;
  authMethod: 'email' | 'phone' | 'google';
  emailVerified?: boolean;
  phoneVerified?: boolean;
  googleId?: string;
  otpRequired?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UtilisateurCreateResponse extends Omit<UtilisateurAttributes, 'password'> {
  temporaryPassword?: string;
  otpRequired?: boolean; // Ajout de cette propriété
}

export interface OTPVerificationAttributes {
  id?: string;
  utilisateurId: string;
  code: string;
  type: 'email' | 'phone';
  expires: Date;
  verified?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}