'use client'
import ChatComponent from '../ui/components/chat';
import AuthPage from "../pages/AuthPage";
import ChatsPage from "../pages/ChatsPage";
import { useState } from 'react';
const HomePage = () => {
  const [user, setUser] = useState(undefined);
  if (!user) {
    return <AuthPage onAuth={(user) => setUser(user)} />;
  } else {
    return <ChatsPage user={user} />;
  }
};

export default HomePage;
