import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SWRConfig } from 'swr';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './hooks/useToast';
import { ToastContainer } from './components/ui/Toast';
import { Layout } from './components/layout/Layout';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { TasksPage } from './pages/TasksPage';
import { ProfilePage } from './pages/ProfilePage';

function App() {
  return (
    <SWRConfig value={{ revalidateOnFocus: false }}>
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route element={<Layout />}>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/tasks" element={<TasksPage />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Route>
            </Routes>
          </BrowserRouter>
          <ToastContainer />
        </AuthProvider>
      </ToastProvider>
    </SWRConfig>
  );
}

export default App;
