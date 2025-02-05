import { createRouter, createWebHistory } from 'vue-router';
import UserLogin from '../views/UserLogin.vue';  // Asegúrate de que la ruta sea correcta
import UserRegister from '../views/UserRegister.vue';
import UserDashboard from '../views/UserDashboard.vue';

const routes = [
  {
    path: '/',
    redirect: '/login',  // Redirige a login si la ruta es '/'
  },
  {
    path: '/login',
    name: 'Login',
    component: UserLogin, // Página de login
  },
  {
    path: '/register',
    name: 'Register',
    component: UserRegister, // Página de registro
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: UserDashboard, // Página del dashboard
    meta: { requiresAuth: true }, // Ruta protegida
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Middleware para proteger rutas
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('authToken');
  if (to.matched.some((record) => record.meta.requiresAuth) && !isAuthenticated) {
    next('/login');  // Si no está autenticado, redirige a login
  } else {
    next();  // Continuar con la navegación
  }
});

export default router;
