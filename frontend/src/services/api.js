import axios from 'axios';

const apiRegister = axios.create({
  
  baseURL: 'http://3.216.57.233:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

const apiAuth = axios.create({
  baseURL: 'http://3.216.57.233:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiAuth.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
export const registerUser = async (userData) => {
  try {
    const response = await apiRegister.post('/users/register', userData);
    return response.data;
  } catch (error) {
    console.error('Error al registrar usuario', error);
    throw error;
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await apiAuth.post('/auth/login', credentials);
    localStorage.setItem('authToken', response.data.token);  
    return response.data;
  } catch (error) {
    console.error('Error al iniciar sesión', error);
    throw error;
  }
};
