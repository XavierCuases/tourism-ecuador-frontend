import axios from 'axios';

// Configuramos la base URL para ambos microservicios
const apiRegister = axios.create({
  baseURL: 'http://localhost:3000/api',  // Microservicio de registro
  headers: {
    'Content-Type': 'application/json',
  },
});

const apiAuth = axios.create({
  baseURL: 'http://localhost:3001/api',  // Microservicio de autenticación
  headers: {
    'Content-Type': 'application/json',
  },
});

// Función para registrar un usuario (conecta con el micro de registro)
export const registerUser = async (userData) => {
  try {
    const response = await apiRegister.post('/users/register', userData);
    return response.data;
  } catch (error) {
    console.error('Error al registrar usuario', error);
    throw error;
  }
};

// Función para hacer login de un usuario (conecta con el micro de autenticación)
export const loginUser = async (credentials) => {
  try {
    const response = await apiAuth.post('/auth/login', credentials);
    localStorage.setItem('authToken', response.data.token);  // Guardar el token JWT en el localStorage
    return response.data;
  } catch (error) {
    console.error('Error al iniciar sesión', error);
    throw error;
  }
};
