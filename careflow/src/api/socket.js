import { io } from 'socket.io-client';

const URL = process.env.REACT_APP_API_URL?.replace('/api', '') 
  || 'http://localhost:5000';

const socket = io(URL);

export default socket;