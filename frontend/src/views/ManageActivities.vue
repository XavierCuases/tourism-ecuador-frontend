<template>
    <div class="manage-activities">
      <h1>Gestionar Actividades</h1>
  
      <!-- Botón para crear nueva actividad -->
      <button @click="showCreateForm" class="action-btn">Crear Actividad</button>
  
      <!-- Tabla de actividades -->
      <div class="activity-table-container">
        <table v-if="activities.length > 0" class="activity-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Location</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="activity in activities" :key="activity._id">
              <td>{{ activity._id }}</td>
              <td>{{ activity.name }}</td>
              <td>{{ activity.location }}</td>
              <td>{{ activity.date }}</td>
              <td>
                <button @click="editActivity(activity)" class="action-btn">Actualizar</button>
                <button @click="confirmDeleteActivity(activity._id)" class="action-btn delete-btn">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
  
      <!-- Formulario para crear o actualizar actividad -->
      <div v-if="showForm" class="form-container">
        <h3>{{ isEditing ? 'Actualizar Actividad' : 'Crear Actividad' }}</h3>
        <form @submit.prevent="submitForm">
          <input v-model="activity.name" type="text" placeholder="Nombre" required />
          <input v-model="activity.location" type="text" placeholder="Ubicación" required />
          <input v-model="activity.date" type="text" placeholder="Fecha" required />
          <textarea v-model="activity.description" placeholder="Descripción"></textarea>
          <input v-model="activity.price" type="number" placeholder="Precio" />
  
          <!-- Input para ingresar las URLs de las imágenes -->
          <input
            v-model="activity.photos"
            type="text"
            placeholder="URLs de imágenes (separadas por comas)"
          />
  
          <button type="submit" class="submit-btn">{{ isEditing ? 'Actualizar' : 'Crear' }}</button>
          <button @click="cancelForm" class="cancel-btn">Cancelar</button>
        </form>
      </div>
  
      <!-- Modal de confirmación -->
      <div v-if="showConfirmationModal" class="confirmation-modal">
        <div class="modal-content">
          <p>{{ confirmationMessage }}</p>
          <button @click="confirmAction" class="confirm-btn">Sí, continuar</button>
          <button @click="cancelAction" class="cancel-btn">Cancelar</button>
        </div>
      </div>
  
      <!-- Error Message -->
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
  
      <!-- Botón de Regresar -->
      <button @click="goBack" class="back-btn">Regresar</button>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'ManageActivities',
    data() {
      return {
        activities: [], // List of activities
        showForm: false, // Flag to show or hide the form
        isEditing: false, // Flag to indicate if we are editing an activity
        activity: {
          _id: '',
          name: '',
          location: '',
          date: '',
          description: '',
          price: null,
          photos: '', // String for photos URLs, entered as comma-separated URLs
        },
        errorMessage: '', // Error message
        showConfirmationModal: false, // Flag for the confirmation modal
        confirmationMessage: '', // Confirmation message
        currentAction: null, // Current action (create, update, delete)
        currentActivityId: null, // Current activity id for deletion
      };
    },
    mounted() {
      this.fetchActivities(); // Fetch activities when the component is mounted
    },
    methods: {
      // Fetch activities from the API
      async fetchActivities() {
        try {
          const response = await axios.post('https://54.83.161.25/service2/graphql', {
            query: `
              query {
                listActivities {
                  _id
                  name
                  location
                  date
                  photos
                }
              }
            `,
          });
          this.activities = response.data.data.listActivities;
        } catch (error) {
          this.errorMessage = 'Error al cargar las actividades';
        }
      },
  
      // Show form to create a new activity
      showCreateForm() {
        this.activity = { name: '', location: '', date: '', description: '', price: null, photos: '' }; // Reset fields
        this.showForm = true;
        this.isEditing = false;
      },
  
      // Edit activity
      editActivity(activity) {
        this.activity = { ...activity }; // Pre-fill with existing data
        this.showForm = true;
        this.isEditing = true;
      },
  
      // Submit form (Create or Update)
      async submitForm() {
        if (this.isEditing) {
          this.confirmUpdateActivity();
        } else {
          this.confirmCreateActivity();
        }
      },
  
      // Show confirmation for creating a new activity
      confirmCreateActivity() {
        this.confirmationMessage = '¿Estás seguro de que deseas crear esta actividad?';
        this.currentAction = 'create';
        this.showConfirmationModal = true;
      },
  
      // Show confirmation for updating an activity
      confirmUpdateActivity() {
        this.confirmationMessage = '¿Estás seguro de que deseas actualizar esta actividad?';
        this.currentAction = 'update';
        this.showConfirmationModal = true;
      },
  
      // Show confirmation for deleting an activity
      confirmDeleteActivity(activityId) {
        this.currentActivityId = activityId;
        this.confirmationMessage = '¿Estás seguro de que deseas eliminar esta actividad?';
        this.currentAction = 'delete';
        this.showConfirmationModal = true;
      },
  
      // Confirm action (Create, Update, Delete)
      confirmAction() {
        if (this.currentAction === 'create') {
          this.createActivity();
        } else if (this.currentAction === 'update') {
          this.updateActivity();
        } else if (this.currentAction === 'delete') {
          this.deleteActivity(this.currentActivityId);
        }
        this.showConfirmationModal = false;
      },
  
      // Cancel action
      cancelAction() {
        this.showConfirmationModal = false;
      },
  
      async createActivity() {
  try {
   
const photosArray = this.activity.photos.split(',').map(photo => `"${photo.trim()}"`); 

const response = await axios.post('https://54.83.161.25/service1/graphql', {
  query: `
    mutation {
      createActivity(
        name: "${this.activity.name}",
        location: "${this.activity.location}",
        date: "${this.activity.date}",
        description: "${this.activity.description}",
        photos: [${photosArray.join(', ')}], 
        price: ${this.activity.price}
      ) {
        _id
        name
        location
        date
      }
    }
  `,
});

    const newActivity = response.data.data.createActivity;
    this.activities.push(newActivity);
    this.showForm = false;
    alert('Actividad creada con éxito');
  } catch (error) {
    this.errorMessage = 'Error al crear la actividad';
    console.error('Error:', error); // Log para depurar el error y revisar más detalles
  }
},

      // Update activity
      async updateActivity() {
        try {
            const photosArray = this.activity.photos.split(',').map(photo => photo.trim());

const response = await axios.post('https://54.83.161.25/service3/graphql', {
  query: `
    mutation {
      updateActivity(
        id: "${this.activity._id}",
        name: "${this.activity.name}",
        location: "${this.activity.location}",
        date: "${this.activity.date}",
        description: "${this.activity.description}",
        photos: [${photosArray.map(photo => `"${photo}"`).join(', ')}],
        price: ${this.activity.price}
      ) {
        _id
        name
        location
        date
      }
    }
  `,
});

          const updatedActivity = response.data.data.updateActivity;
          this.activities = this.activities.map(activity =>
            activity._id === updatedActivity._id ? updatedActivity : activity
          );
          this.showForm = false;
          alert('Actividad actualizada con éxito');
        } catch (error) {
          this.errorMessage = 'Error al actualizar la actividad';
        }
      },
  
      // Delete activity
      async deleteActivity(activityId) {
        try {
          await axios.post('https://54.83.161.25/service4/graphql', {
            query: `
              mutation {
                deleteActivity(id: "${activityId}") {
                  _id
                }
              }
            `,
          });
          this.activities = this.activities.filter(activity => activity._id !== activityId);
          alert('Actividad eliminada con éxito');
        } catch (error) {
          this.errorMessage = 'Error al eliminar la actividad';
        }
      },
  
      cancelForm() {
        this.showForm = false;
        this.errorMessage = '';
      },
  
      goBack() {
        this.showForm = false;
        this.errorMessage = '';
        this.$router.go(-1); // Go back to the previous page
      },
    },
  };
  </script>
  
  <style scoped>
    /* Styling */
    .manage-activities {
      padding: 20px;
      font-family: Arial, sans-serif;
    }
  
    h1 {
      font-size: 2rem;
      margin-bottom: 20px;
    }
  
    .activity-table-container {
      overflow-y: auto;
      max-height: 400px;
      margin-top: 20px;
      padding: 10px;
      background-color: #f9f9f9;
      border-radius: 5px;
    }
  
    .form-container {
      margin-top: 20px;
      padding: 20px;
      background-color: #f9f9f9;
      border-radius: 5px;
    }
  
    input, textarea {
      width: 100%;
      padding: 10px;
      margin-bottom: 10px;
      border-radius: 5px;
      border: 1px solid #ddd;
    }
  
    .submit-btn, .cancel-btn {
      padding: 10px 20px;
      background-color: #4CAF50;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }
  
    .submit-btn:hover, .cancel-btn:hover {
      background-color: #45a049;
    }
  
    .activity-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }
  
    th, td {
      border: 1px solid #ddd;
      padding: 8px;
      text-align: left;
    }
  
    .error-message {
      color: red;
      margin-top: 10px;
    }
  
    /* Modal */
    .confirmation-modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }
  
    .modal-content {
      background-color: white;
      padding: 20px;
      border-radius: 5px;
      width: 40%;
      text-align: center;
    }
  
    .confirm-btn, .cancel-btn {
      padding: 10px 20px;
      cursor: pointer;
    }
  
    .confirm-btn {
      background-color: #28a745;
      color: white;
    }
  
    .confirm-btn:hover {
      background-color: #218838;
    }
  
    .cancel-btn {
      background-color: #ccc;
      color: white;
    }
  
    .cancel-btn:hover {
      background-color: #999;
    }
  
    .back-btn {
      background-color: #17a2b8;
      color: white;
      padding: 10px 20px;
      cursor: pointer;
      margin-top: 10px;
    }
  
    .back-btn:hover {
      background-color: #138496;
    }
  </style>
  