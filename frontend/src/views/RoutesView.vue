<template>
  <div class="routes-container">
    <div class="header">
      <h1>Tourist Routes</h1>
      <button @click="goBack" class="back-button">Regresar</button>
    </div>

    <!-- Mostrar mensaje de error -->
    <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>

    <!-- Mostrar tabla de rutas si hay rutas disponibles -->
    <table v-if="routes.length > 0" class="routes-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Description</th>
          <th>Start Point</th>
          <th>End Point</th>
          <th>Distance</th>
          <th>Duration (hrs)</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="route in routes" :key="route.id">
          <td>{{ route.name }}</td>
          <td>{{ route.description }}</td>
          <td>{{ route.startPoint }}</td>
          <td>{{ route.endPoint }}</td>
          <td>{{ route.distance }} km</td>
          <td>{{ route.duration }} hrs</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: 'RoutesView',
  setup() {
    const router = useRouter();
    const routes = ref([]);
    const errorMessage = ref('');

    // Obtener rutas desde la API
    onMounted(async () => {
      if (localStorage.getItem('authToken')) {
        try {
          const response = await fetch('http://34.204.238.191:5006/api/routes');
          const data = await response.json();

          // Verifica si las rutas están en la respuesta
          if (data && Array.isArray(data)) {
            routes.value = data;  // Asumiendo que la respuesta contiene un array directo de rutas
          } else {
            errorMessage.value = 'No routes available.';
          }
        } catch (error) {
          errorMessage.value = 'Error fetching routes: ' + error.message;
        }
      } else {
        errorMessage.value = 'Please log in to view the routes.';
        router.push('/login');
      }
    });

    // Método para regresar a la vista anterior
    const goBack = () => {
      router.push('/user-dashboard');
    };

    return {
      routes,
      errorMessage,
      goBack,
    };
  },
};
</script>

<style scoped>
/* Estilos para la vista de rutas */
.routes-container {
  padding: 20px;
  text-align: center;
  background-color: #f4f4f9; /* Color de fondo de la página */
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #2980b9; /* Color de fondo para la cabecera */
  color: white;
  padding: 15px;
  border-radius: 8px;
}

.header h1 {
  font-size: 30px;
  font-weight: bold;
}

.routes-table {
  width: 100%;
  margin-top: 30px;
  border-collapse: collapse;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

.routes-table th, .routes-table td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
  font-size: 16px;
  color: #333;
}

.routes-table th {
  background-color: #2980b9; /* Fondo para los encabezados */
  color: white;
  font-weight: bold;
}

.routes-table tr:hover {
  background-color: #f0f0f0; /* Efecto hover en las filas */
}

.error-message {
  color: red;
  font-size: 14px;
  margin-top: 15px;
}

.back-button {
  padding: 12px 25px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 20px;
}

.back-button:hover {
  background-color: #e53935;
  transform: scale(1.05);
  transition: transform 0.2s ease-in-out;
}

@media (max-width: 768px) {
  .routes-table th, .routes-table td {
    padding: 8px;
  }

  .back-button {
    padding: 10px 20px;
  }
}
</style>
