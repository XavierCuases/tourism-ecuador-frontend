<template>
  <div class="register-container">
    <div class="register-form">
      <h2 class="register-title">Create Account</h2>
      <p class="register-description">
        Sign up to suggest tourist activities and explore amazing places in Ecuador.
      </p>
      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label for="name">First and last name</label>
          <input
            type="text"
            id="name"
            v-model="name"
            placeholder="Enter your names"
            required
          />
        </div>
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
        <button type="submit" class="submit-btn">Create Account</button>
        <p class="login-link">
          Already have an account? <router-link to="/login">Sign In</router-link>
        </p>
      </form>
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
      <div v-if="successMessage" class="success-message">
        {{ successMessage }}
      </div>
    </div>
  </div>
</template>

<script>
import { registerUser } from "../services/api";

export default {
  name: "UserRegister",
  data() {
    return {
      name: "",
      email: "",
      password: "",
      errorMessage: "",
      successMessage: "",
    };
  },
  methods: {
    async handleRegister() {
      const userData = {
        name: this.name,
        email: this.email,
        password: this.password,
      };

      try {
        const response = await registerUser(userData);
        if (response.message === "User successfully registered") {
          this.successMessage = "Registration successful! You can now log in.";
          setTimeout(() => {
            this.$router.push("/login");
          }, 4000); 
        } else {
          this.errorMessage = "There was an error creating your account..";
        }
      } catch (error) {
        console.error("Registration error:", error);
        this.errorMessage = "There was an error creating your user account, it already exists.";
      }
    },
  },
};
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f4f4f9;
}

.register-form {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 40px;
  width: 400px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.register-title {
  text-align: center;
  color: #2c3e50;
  font-size: 24px;
}

.register-description {
  text-align: center;
  margin-bottom: 20px;
  color: #7f8c8d;
  font-size: 14px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  font-weight: bold;
  color: #2c3e50;
}

input {
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  width: 100%;
  padding: 12px;
  background-color: #3498db;
  border: none;
  border-radius: 4px;
  color: white;
  font-size: 16px;
  cursor: pointer;
}

button:hover {
  background-color: #2980b9;
}

.login-link {
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
  color: #7f8c8d;
}

.error-message {
  color: #e74c3c;
  font-size: 14px;
  text-align: center;
  margin-top: 10px;
}

.success-message {
  color: #27ae60;
  font-size: 14px;
  text-align: center;
  margin-top: 10px;
}
</style>
