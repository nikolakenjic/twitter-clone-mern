import axios from 'axios';

const fetchUrl = axios.create({
  baseURL: '/api/v1',
});

export default fetchUrl;
