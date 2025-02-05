<template>
  <div>
    <h2>Welcome to your Dashboard</h2>
    <p>You are logged in as {{ userRole }}.</p>
    <button @click="logout">Logout</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userRole: '', // Asigna el rol del usuario aquí
    };
  },
  methods: {
    logout() {
      localStorage.removeItem('authToken');
      this.$router.push('/login');  // Redirigir al login después de cerrar sesión
    },
  },
  mounted() {
    const token = localStorage.getItem('authToken');
    if (token) {
      // Aquí podrías decodificar el token y obtener el rol
      this.userRole = 'Admin'; // O 'User', según el token
    } else {
      this.$router.push('/login');  // Redirigir al login si no hay token
    }
  },
};
</script>
