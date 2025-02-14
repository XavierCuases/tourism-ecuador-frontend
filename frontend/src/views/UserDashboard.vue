<template>
  <div class="user-dashboard">
    <div class="header">
      <h1>TOURISM ACTIVITIES</h1>
      <p>Discover amazing places and exciting activities to explore in Ecuador!</p>
      <button @click="handleLogout" class="logout-button">Logout</button>
    </div>

    <p v-if="username && email">Welcome {{ username }}! Your email: {{ email }}</p>

    <!-- Botón para conocer rutas -->
    <div class="flex justify-center h-screen">
  <button 
    @click="goToRoutes" 
    class="text-2xl px-6 py-3 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-700 mt-10"
  >
    Conocer Rutas
  </button>
</div>





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
    const username = ref(localStorage.getItem('username')); 
    const email = ref(localStorage.getItem('email')); 
    const activities = ref([]); 
    const errorMessage = ref(''); 

    const goToRoutes = () => {
      router.push({ name: 'RoutesView' });  // Redirige a la ruta configurada
    };

    
    onMounted(() => {
      
      if (localStorage.getItem('authToken')) {
       
        const savedActivities = localStorage.getItem('activities');
        if (savedActivities) {
          activities.value = JSON.parse(savedActivities); 
        } else {
         
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

          
          if (result.value) {
            activities.value = result.value.listActivities;
            localStorage.setItem('activities', JSON.stringify(activities.value)); // Guardar actividades
          }

          if (error.value) {
            errorMessage.value = 'Error fetching activities: ' + error.value.message;
          }
        }
      } else {
        errorMessage.value = 'Please log in to access activities.';
        router.push('/login'); 
      }
    });

    
    watchEffect(() => {
      const savedActivities = localStorage.getItem('activities');
      if (savedActivities) {
        activities.value = JSON.parse(savedActivities); 
      }
    });

    const handleLogout = () => {
      
      localStorage.removeItem('authToken');
      localStorage.removeItem('userRole');
      localStorage.removeItem('username');
      localStorage.removeItem('email');
      localStorage.removeItem('activities'); 
      router.push('/login'); 
    };

    return {
      username,
      email,
      activities,
      errorMessage,
      handleLogout,
      goToRoutes,
    };
  },
};
</script>

<style scoped>
.user-dashboard {
  padding: 30px;
  text-align: center;
  background-color: #f4f4f9;
  min-height: 100vh;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #2980b9; 
  color: white;
  padding: 15px 30px;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}

h1 {
  font-size: 36px;
  font-weight: bold;
  margin: 0;
}

.logout-button {
  padding: 12px 25px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.logout-button:hover {
  background-color: #e53935;
  transform: scale(1.05);
}

.activity-item {
  margin-bottom: 20px;
  padding: 20px;
  border-radius: 10px;
  background-color: #ffffff;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  text-align: left;
  transition: box-shadow 0.3s ease;
}

.activity-item:hover {
  box-shadow: 0px 6px 15px rgba(0, 0, 0, 0.2);
}

.activity-photos {
  display: flex;
  gap: 12px;
  margin-top: 15px;
}

.activity-photo {
  width: 300px;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
}

.error-message {
  color: #e74c3c;
  font-size: 16px;
  margin-top: 15px;
}


button {
  padding: 12px 25px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

button:hover {
  background-color: #0056b3;
  transform: scale(1.05);
}


.button-routes {
  padding: 15px 30px;
  background-color: #2980b9;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 18px;
  transition: background-color 0.3s ease, transform 0.3s ease;
  margin-top: 20px;
}

.button-routes:hover {
  background-color: #1d6d97;
  transform: scale(1.1);
}


@media (max-width: 768px) {
  .header {
    flex-direction: column;
    align-items: flex-start;
  }

  h1 {
    font-size: 28px;
    text-align: center;
  }

  .logout-button {
    margin-top: 15px;
  }

  .activity-item {
    padding: 15px;
  }

  .activity-photo {
    width: 100%;
    height: auto;
  }

  .button-routes {
    width: 100%;
    padding: 15px 0;
    font-size: 16px;
  }
}
</style>
