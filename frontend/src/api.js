
// Esto detecta si estás en el navegador local o en la web
const API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3001/api' 
    : 'https://app-tareas-production.up.railway.app';

export default API_URL;