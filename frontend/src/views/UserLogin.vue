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
import { loginUser } from "../services/api"; 

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
         
          localStorage.setItem("authToken", response.token);
          localStorage.setItem("userRole", response.role); 
      
          if (response.role === "admin") {
       
            this.$router.push("/admin-dashboard");
          } else if (response.role === "user") {
           
            this.$router.push("/user-dashboard");
          } else {
            this.errorMessage = "Invalid role, please contact support.";
          }
        } else {
          this.errorMessage = "There was an error logging in. Please try again.";
        }
      } catch (error) {
        console.error("Login error:", error);
        this.errorMessage = "Invalid email or password.";
      }
    },
  },
};
</script>

<style scoped>
/* Estilos para el contenedor del login */
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #e0f7fa; /* Color de fondo verde suave */
}

/* Estilo del formulario */
.login-form {
  background-color: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  width: 400px;
  font-family: Arial, sans-serif;
}

/* Título */
h2 {
  text-align: center;
  margin-bottom: 20px;
  font-weight: 700; /* Más negrita */
  font-size: 30px;
  color: #4caf50; /* Verde para el título */
}

/* Estilo de los grupos de formularios */
.form-group {
  margin-bottom: 20px;
}

/* Estilo de las etiquetas */
label {
  font-weight: 600; /* Hacer el texto más negrita */
  font-size: 14px;
  color: #333;
}

/* Estilo de los inputs */
input {
  width: 100%;
  padding: 12px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  color: #333;
}

/* Estilo del botón */
button {
  width: 100%;
  padding: 12px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 20px;
  font-weight: bold;
}

button:hover {
  background-color: #45a049;
}

/* Estilo del enlace de registro */
.register-link {
  text-align: center;
  margin-top: 10px;
  font-weight: 500;
}

.register-link a {
  text-decoration: none;
  color: #007bff;
}

.register-link a:hover {
  text-decoration: underline;
}

/* Estilo del mensaje de error */
.error-message {
  color: red;
  font-size: 14px;
  margin-top: 20px;
}

/* Responsive design */
@media (max-width: 600px) {
  .login-form {
    width: 90%;
  }
}
</style>
