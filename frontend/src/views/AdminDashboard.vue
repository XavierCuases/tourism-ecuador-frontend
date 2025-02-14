<template>
  <div class="admin-dashboard">
    <header class="header-container">
      <h1 class="dashboard-title">Admin Dashboard</h1>
      <button @click="handleLogout" class="logout-btn">Logout</button>
    </header>

    <div class="nav-buttons">
      <button @click="listAllUsers" class="nav-btn">List Users</button>
      <button @click="showSearch" class="nav-btn">Search User</button>
      <button @click="goToManageActivities" class="nav-btn">Gestionar Actividades</button>
    </div>

    <div v-if="showSearchSection">
      <h2>Search User by ID</h2>
      <input v-model="searchId" type="number" placeholder="Enter user ID" class="search-input" />
      <button @click="searchUserById" class="search-btn">Search</button>
    </div>

    <h2>User List</h2>
    <table v-if="!loading" class="user-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in displayedUsers" :key="user.id">
          <td>{{ user.id }}</td>
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.role }}</td>
          <td>
            <button @click="setUserToUpdate(user)" class="action-btn">Update</button>
            <button @click="setUserToDelete(user)" class="action-btn delete-btn">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <h3 v-if="isUpdating">Update User</h3>
        <h3 v-else>Delete User</h3>

        <div v-if="isUpdating && !isConfirming">
          <input v-model="userToUpdate.name" type="text" placeholder="Name" />
          <input v-model="userToUpdate.email" type="email" placeholder="Email" />
          <input v-model="userToUpdate.password" type="password" placeholder="Password" />
          <button @click="confirmUpdate" class="update-btn">Update</button>
        </div>

        <div v-else-if="isConfirming">
          <p>Are you sure you want to update the user details?</p>
          <button @click="updateUser" class="update-btn">Yes, Update</button>
          <button @click="cancelConfirmation" class="cancel-btn">Cancel</button>
        </div>

        <div v-else>
          <p>Are you sure you want to delete this user?</p>
          <button @click="deleteUser" class="delete-btn">Delete</button>
          <button @click="cancelModal" class="cancel-btn">Cancel</button>
        </div>

        <button @click="goBack" class="back-btn">Back</button>
      </div>
    </div>

    <p v-if="loading" class="loading-text">Loading users...</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'AdminDashboard',
  data() {
    return {
      users: [],
      displayedUsers: [],
      searchId: '',
      userById: null,
      loading: true,
      showSearchSection: false,
      userToDelete: null,
      userToUpdate: null,
      showModal: false,
      isUpdating: true,
      isConfirming: false,
    };
  },
  created() {
    if (!this.isAuthenticated()) {
      this.$router.push('/login');
    } else {
      this.fetchUsers();
    }
  },
  methods: {
    isAuthenticated() {
      return localStorage.getItem('authToken');
   },


    handleLogout() {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userRole');
      this.$router.push('/login');
    },

    goToManageActivities() {
  console.log('Redirigiendo a Gestionar Actividades');
  this.$router.push('/manage-activities');
},

    fetchUsers() {
      axios.get('http://34.196.226.115:7000/api/users')
        .then(response => {
          this.users = response.data;
          this.displayedUsers = this.users;
          this.loading = false;
        })
        .catch(error => {
          console.error('Error fetching users:', error);
          this.loading = false;
        });
    },

    listAllUsers() {
      this.displayedUsers = this.users;
      this.showSearchSection = false;
    },

    showSearch() {
      this.showSearchSection = true;
    },

    searchUserById() {
      if (this.searchId) {
        axios.get(`http://34.196.226.115:7000/api/users/${this.searchId}`)
          .then(response => {
            this.userById = response.data;
            this.displayedUsers = [this.userById];
          })
          .catch(error => {
            console.error('Error fetching user by ID:', error);
            alert('User not found.');
          });
      } else {
        alert('Please enter an ID.');
      }
    },

    setUserToUpdate(user) {
      this.userToUpdate = { ...user };
      this.isUpdating = true;
      this.isConfirming = false;
      this.showModal = true;
    },

    setUserToDelete(user) {
      this.userToDelete = user.id;
      this.isUpdating = false;
      this.isConfirming = false;
      this.showModal = true;
    },

    confirmUpdate() {
      this.isConfirming = true;
    },

    updateUser() {
      axios.put(`http://34.196.226.115:7001/api/users/${this.userToUpdate.id}`, this.userToUpdate)
        .then((response) => {
          console.log('API Response:', response);

          if (response && response.data) {
            const token = response.data.token;
            localStorage.setItem('authToken', token);

            this.users = this.users.map(user =>
              user.id === this.userToUpdate.id ? { ...user, ...this.userToUpdate } : user
            );
            this.displayedUsers = this.users;

            alert('User updated successfully');
            this.showModal = false;
          } else {
            console.error('Unexpected response format:', response);
            alert('Unexpected error occurred');
          }
        })
        .catch((error) => {
          console.error('Error updating user:', error.response ? error.response.data.message : error.message);
          alert(error.response ? error.response.data.message : 'Error updating user');
        });
    },

    deleteUser() {
      axios.delete(`http://34.196.226.115:7002/api/users/${this.userToDelete}`)
        .then(() => {
          this.users = this.users.filter(user => user.id !== this.userToDelete);
          this.displayedUsers = this.users;
          alert('User deleted successfully');
          this.showModal = false;
        })
        .catch(error => {
          console.error('Error deleting user:', error);
        });
    },

    cancelModal() {
      this.showModal = false;
    },

    cancelConfirmation() {
      this.isConfirming = false;
    },

    goBack() {
      this.showModal = false;
    },
  },

};
</script>

<style scoped>

.admin-dashboard {
  font-family: 'Roboto', Arial, sans-serif;
  background-color: #f9f9f9;
  padding: 30px;
  color: #333;
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #2c3e50; /* Cambié a un color más oscuro */
  color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}

.dashboard-title {
  font-size: 36px;
  font-weight: bold;
  text-align: center;
  flex: 1;
  font-family: 'Arial', sans-serif;
}

.logout-btn {
  padding: 12px 25px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.logout-btn:hover {
  background-color: #e53935;
  transform: scale(1.05);
}

/* Navigation Buttons */
.nav-buttons {
  display: flex;
  justify-content: center;
  margin: 30px 0;
}

.nav-btn {
  background-color: #3498db; /* Azul más suave */
  color: white;
  padding: 12px 25px;
  margin: 0 15px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.nav-btn:hover {
  background-color: #2980b9;
  transform: scale(1.05);
}

/* User Table */
.user-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 30px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}

th, td {
  border: 1px solid #ddd;
  padding: 12px 15px;
  text-align: left;
  font-size: 16px;
}

th {
  background-color: #2c3e50;
  color: white;
  font-weight: bold;
}

td {
  background-color: #ffffff;
}

td:hover {
  background-color: #f1f1f1;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: #fff;
  padding: 25px;
  border-radius: 8px;
  width: 60%;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);
}

.update-btn, .delete-btn, .cancel-btn, .back-btn {
  padding: 12px 30px;
  cursor: pointer;
  font-size: 16px;
  border-radius: 5px;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.update-btn {
  background-color: #28a745;
  color: white;
}

.update-btn:hover {
  background-color: #218838;
  transform: scale(1.05);
}

.cancel-btn {
  background-color: #ccc;
  color: white;
}

.cancel-btn:hover {
  background-color: #999;
  transform: scale(1.05);
}

.delete-btn {
  background-color: #dc3545;
  color: white;
}

.delete-btn:hover {
  background-color: #c82333;
  transform: scale(1.05);
}

.back-btn {
  background-color: #17a2b8;
  color: white;
  padding: 12px 30px;
  cursor: pointer;
  margin-top: 15px;
}

.back-btn:hover {
  background-color: #138496;
  transform: scale(1.05);
}

</style>
