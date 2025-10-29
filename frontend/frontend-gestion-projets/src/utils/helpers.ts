export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString('fr-FR');
};

export const formatDateTime = (date: string | Date): string => {
  return new Date(date).toLocaleString('fr-FR');
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export default { formatDate, formatDateTime, truncateText, generateId }; // ← AJOUTER CETTE LIGNE