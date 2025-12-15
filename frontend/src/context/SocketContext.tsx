import { createContext, useContext, useEffect, ReactNode } from 'react';
import { Socket } from 'socket.io-client';
import { socket } from '../services/socket';
import { Task } from '../types';
import { useSWRConfig } from 'swr';
import { useToast } from '../hooks/useToast';

interface SocketContextType {
  socket: Socket;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const { mutate } = useSWRConfig();
  const { showToast } = useToast();

  useEffect(() => {
    socket.on('task:created', (task: Task) => {
      mutate('/tasks');
      mutate('/tasks/stats');
      showToast(`New task created: ${task.title}`, 'info');
    });

    socket.on('task:updated', (task: Task) => {
      mutate('/tasks');
      mutate('/tasks/stats');
      mutate('/tasks/assigned');
      mutate('/tasks/created');
      mutate('/tasks/overdue');
    });

    socket.on('task:deleted', () => {
      mutate('/tasks');
      mutate('/tasks/stats');
      mutate('/tasks/assigned');
      mutate('/tasks/created');
      mutate('/tasks/overdue');
    });

    socket.on('task:assigned', (task: Task) => {
      mutate('/tasks/assigned');
      mutate('/tasks/stats');
      showToast(`You've been assigned: ${task.title}`, 'info');
    });

    return () => {
      socket.off('task:created');
      socket.off('task:updated');
      socket.off('task:deleted');
      socket.off('task:assigned');
    };
  }, [mutate, showToast]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
