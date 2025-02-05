<template>
  <div>
    <h2>Register</h2>
    <form @submit.prevent="handleRegister">
      <input v-model="name" type="text" placeholder="Name" required />
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <button type="submit">Register</button>
    </form>
  </div>
</template>

<script>
import { registerUser } from '../services/api';

export default {
  data() {
    return {
      name: '',
      email: '',
      password: '',
    };
  },
  methods: {
    async handleRegister() {
      const userData = { name: this.name, email: this.email, password: this.password };
      try {
        const response = await registerUser(userData);
        console.log('User Registered:', response);
        this.$router.push('/login'); // Redirigir al login después de registro
      } catch (error) {
        console.error('Registration Error:', error);
        alert('Registration failed, please check your data.');
      }
    },
  },
};
</script>
