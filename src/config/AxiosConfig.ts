import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://us.insights.granular.ag/api/technical-interview-api',
});

export default instance;