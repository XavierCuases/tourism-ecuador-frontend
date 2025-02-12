<template>
  <div class="user-dashboard">
    <div class="header">
      <h1>Ecuador Turístico</h1>
      <p>Discover amazing places and exciting activities to explore in Ecuador!</p>
      <button @click="handleLogout" class="logout-button">Logout</button>
    </div>

    <p v-if="username && email">Welcome {{ username }}! Your email: {{ email }}</p>

    <!-- Lista de actividades -->
    <div v-if="activities.length > 0">
      <div v-for="activity in activities" :key="activity._id" class="activity-item">
        <h3>{{ activity.name }}</h3>
        <p>{{ activity.description }}</p>
        <p><strong>Location:</strong> {{ activity.location }}</p>
        <p><strong>Price:</strong> ${{ activity.price }}</p>

        <div v-if="activity.photos && activity.photos.length > 0" class="activity-photos">
          <img v-for="(photo, index) in activity.photos" :key="index" :src="photo" alt="Activity photo" class="activity-photo" />
        </div>
      </div>
    </div>

    <!-- Mensaje de error -->
    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watchEffect } from 'vue'; 
import { gql } from '@apollo/client/core';
import { useQuery } from '@vue/apollo-composable';
import { useRouter } from 'vue-router'; 

export default {
  name: 'UserDashboard',
  setup() {
    const router = useRouter();
    const username = ref(localStorage.getItem('username')); // Nombre del usuario
    const email = ref(localStorage.getItem('email')); // Correo del usuario
    const activities = ref([]); // Actividades a mostrar
    const errorMessage = ref(''); // Mensaje de error

    // Cargar actividades desde localStorage o consultar la API
    onMounted(() => {
      // Si el usuario está logueado (con token)
      if (localStorage.getItem('authToken')) {
        // Verificar si las actividades están almacenadas en localStorage
        const savedActivities = localStorage.getItem('activities');
        if (savedActivities) {
          activities.value = JSON.parse(savedActivities); // Cargar actividades desde localStorage
        } else {
          // Si no hay actividades en localStorage, hacer la consulta a la API
          const { result, error } = useQuery(gql`
            query GetActivities {
              listActivities {
                _id
                name
                location
                description
                photos
                price
              }
            }
          `);

          // Si obtenemos las actividades, las almacenamos en localStorage
          if (result.value) {
            activities.value = result.value.listActivities;
            localStorage.setItem('activities', JSON.stringify(activities.value)); // Guardar actividades
          }

          // Si hubo un error al obtener las actividades
          if (error.value) {
            errorMessage.value = 'Error fetching activities: ' + error.value.message;
          }
        }
      } else {
        errorMessage.value = 'Please log in to access activities.';
      }
    });

    // Verificar si las actividades están en el localStorage cuando recargamos la página
    watchEffect(() => {
      const savedActivities = localStorage.getItem('activities');
      if (savedActivities) {
        activities.value = JSON.parse(savedActivities); // Cargar actividades desde localStorage
      }
    });

    // Función de logout
    const handleLogout = () => {
      // Eliminar todo lo relacionado con el login y actividades
      localStorage.removeItem('authToken');
      localStorage.removeItem('userRole');
      localStorage.removeItem('username');
      localStorage.removeItem('email');
      localStorage.removeItem('activities'); // Elimina las actividades
      router.push('/login'); // Redirige al login
    };

    return {
      username,
      email,
      activities,
      errorMessage,
      handleLogout,
    };
  },
};
</script>

<style scoped>
/* Estilos para el dashboard */
.user-dashboard {
  padding: 20px;
  text-align: center;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #4CAF50;
  color: white;
  padding: 10px;
}

h1 {
  font-size: 30px;
  font-weight: bold;
}

.logout-button {
  padding: 10px 20px;
  background-color: #f44336;
  color: white;
  border: none;
  cursor: pointer;
}

.logout-button:hover {
  background-color: #e53935;
}

.activity-item {
  margin-bottom: 20px;
  padding: 15px;
  border: 1px solid #ccc;
  background-color: #f9f9f9;
  text-align: left;
}

.activity-photos {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.activity-photo {
  width: 400px;
  height: 300px;
  object-fit: cover;
}

.error-message {
  color: red;
}

button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>
