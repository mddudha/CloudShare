import axios from 'axios';

const baseURL = process.env.REACT_APP_API_URL;

const USER_ID = 'shuhbamhalvadia@gmail.com';

const axiosClient = axios.create({
  baseURL,
  headers: {
    'x-user-id': USER_ID,
  },
});

export default axiosClient;
