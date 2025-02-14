import { createApp } from 'vue';
import App from './App.vue';
import { ApolloClient, InMemoryCache } from '@apollo/client/core';
import { provideApolloClient } from '@vue/apollo-composable';  
import router from './router';


const apolloClient = new ApolloClient({
  uri: 'https://54.83.161.25/service2/graphql', 
  cache: new InMemoryCache(),
});


const app = createApp(App);


provideApolloClient(apolloClient);

app.use(router);
app.mount('#app');
