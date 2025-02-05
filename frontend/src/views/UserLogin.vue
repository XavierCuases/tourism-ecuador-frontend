<template>
  <div>
    <h2>Login</h2>
    <form @submit.prevent="handleLogin">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
  </div>
</template>

<script>
import { loginUser } from '../services/api'; // Importar la función de login

export default {
  data() {
    return {
      email: '',
      password: '',
    };
  },
  methods: {
    async handleLogin() {
      const credentials = { email: this.email, password: this.password };
      try {
        const response = await loginUser(credentials);
        console.log('Login Successful:', response);
        this.$router.push('/dashboard'); // Redirige al dashboard después del login
      } catch (error) {
        console.error('Login Error:', error);
        alert('Login failed, please check your credentials.');
      }
    },
  },
};
</script>
