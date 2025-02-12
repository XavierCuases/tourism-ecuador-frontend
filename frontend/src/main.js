import { createApp } from 'vue';
import App from './App.vue';
import { ApolloClient, InMemoryCache } from '@apollo/client/core';
import { provideApolloClient } from '@vue/apollo-composable';  // Importar esta función
import router from './router';

// Crear una instancia del cliente de Apollo
const apolloClient = new ApolloClient({
  uri: 'https://54.83.161.25/service2/graphql', // URL correcta de la API GraphQL
  cache: new InMemoryCache(),
});

// Crear la app de Vue
const app = createApp(App);

// Proporcionar el cliente Apollo
provideApolloClient(apolloClient);

app.use(router);
app.mount('#app');
