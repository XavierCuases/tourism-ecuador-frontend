<template>
  <div class="admin-dashboard">
    <h1>Admin Dashboard</h1>
    <p>Welcome Admin! You have access to this panel.</p>
    <button @click="handleLogout">Logout</button>
  </div>
</template>

<script>
export default {
  name: 'AdminDashboard',
  methods: {
    handleLogout() {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userRole');
      this.$router.push('/login');
    }
  }
};
</script>

<style scoped>
.admin-dashboard {
  text-align: center;
  padding: 20px;
}
h1 {
  color: #4CAF50;
}
button {
  padding: 10px 20px;
  background-color: #f44336;
  color: white;
  border: none;
  cursor: pointer;
}
button:hover {
  background-color: #e53935;
}
</style>
