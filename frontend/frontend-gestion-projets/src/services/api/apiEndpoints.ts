export const apiEndpoints = {
  AUTH_SERVICE: process.env.REACT_APP_API_AUTH_URL || 'http://localhost:5000/api/v1',
  PROJECT_SERVICE: process.env.REACT_APP_API_PROJECT_URL || 'http://localhost:5001/api/v1',
};