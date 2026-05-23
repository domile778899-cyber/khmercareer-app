// Simple redirect page that manages chat list vs detail routing
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function ChatPage() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/chat');
  }, [navigate]);

  return null;
}
