import { useSelector, useDispatch } from 'react-redux';
import { initializeChat } from '../../store/websocket';
import { addMessage } from '../../store/slices/chatSlice';

const ChatComponent = () => {
  const messages = useSelector((state) => state.chat.messages);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeChat());
  }, [dispatch]);

  // ... rest of your chat component code

  return (
    <div>
      {messages.map((message, index) => (
        <div key={index}>{message}</div>
      ))}
    </div>
  );
};

export default ChatComponent;
