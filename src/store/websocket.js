// import io from 'socket.io-client';
// import { createAsyncThunk } from '@reduxjs/toolkit';

// // const socket = io.connect('YOUR_WEBSOCKET_SERVER_URL'); // Replace with your websocket server URL
// const socket = io.connect('ws://localhost:3000/'); // Replace with your websocket server URL

// export const ioMiddleware = ({ dispatch }) => (next) => (action) => {
//   if (typeof action === 'function') {
//     return ioMiddleware({ dispatch })(next)(action(dispatch));
//   }

//   if (action.meta?.remote) {
//     socket.emit('action', action);
//   }

//   return next(action);
// };

// export const initializeChat = createAsyncThunk('chat/initialize', async () => {
//   socket.on('message', (message) => {
//     dispatch(addMessage(message));
//   });

//   socket.on('error', (error) => {
//     dispatch(setError(error));
//   });
// });
