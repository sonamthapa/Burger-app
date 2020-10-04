import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://burger-builder-app-3fa5e.firebaseio.com/'
});

export default instance;
