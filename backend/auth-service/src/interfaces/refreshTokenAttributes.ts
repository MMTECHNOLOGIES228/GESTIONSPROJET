export interface RefreshTokenAttributes {
    id?: string;
    utilisateurId: string;
    token: string;
    expires: Date;
}