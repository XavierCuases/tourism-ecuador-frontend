<template>
  <div class="login-container">
    <div class="login-form">
      <h2>Welcome Back</h2>
      <p>Please log in to suggest tourist activities and explore exciting destinations.</p>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            v-model="email"
            placeholder="Enter your email"
            required
          />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input
            type="password"
            id="password"
            v-model="password"
            placeholder="Enter your password"
            required
          />
        </div>
        <button type="submit" class="submit-btn">Sign In</button>
        <p class="register-link">
          Don't have an account? <router-link to="/register">Create Account</router-link>
        </p>
      </form>
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
    </div>
  </div>
</template>

<script>
import { loginUser } from "../services/api"; // Asegúrate de tener la función loginUser definida

export default {
  name: "UserLogin",
  data() {
    return {
      email: "",
      password: "",
      errorMessage: "",
    };
  },
  methods: {
    async handleLogin() {
      const credentials = {
        email: this.email,
        password: this.password,
      };

      try {
        const response = await loginUser(credentials);

        if (response && response.token) {
          // Almacena el token en localStorage
          localStorage.setItem("authToken", response.token);
          localStorage.setItem("userRole", response.role); // Guardar el rol del usuario

          // Validar el rol y redirigir al dashboard adecuado
          if (response.role === "admin") {
            // Redirige al dashboard de admin
            this.$router.push("/admin-dashboard");
          } else if (response.role === "user") {
            // Redirige al dashboard de usuario
            this.$router.push("/user-dashboard");
          } else {
            this.errorMessage = "Invalid role, please contact support.";
          }
        } else {
          this.errorMessage = "Invalid email or password.";
        }
      } catch (error) {
        console.error("Login error:", error);
        this.errorMessage = "There was an error logging in. Please try again.";
      }
    },
  },
};
</script>

<style scoped>
/* Agrega estilos según tu preferencia */
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f4f7f6;
}

.login-form {
  background-color: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  width: 400px;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  font-weight: bold;
}

input {
  width: 100%;
  padding: 12px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  width: 100%;
  padding: 12px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 20px;
}

button:hover {
  background-color: #45a049;
}

.register-link {
  text-align: center;
  margin-top: 10px;
}

.error-message {
  color: red;
  font-size: 14px;
  margin-top: 20px;
}
</style>
