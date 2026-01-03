import {BrowserRouter as Router , Routes, Route , Navigate} from 'react-router';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import Login from './pages/Login';
// import Register from './pages/Register';
import Dashboard from './pages/Dashboard';


import { useAuthStore } from './store/authStore';
import Register from './pages/Register';

//Protected Route wrapper
const ProtectedRoute = ({ children } : {children : React.ReactNode}) =>{
  const token = useAuthStore((state) => state.token);
  if(!token) return <Navigate to ='/login' replace/>
  return <>{children}</>
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/login' element={<Login/>} />
        <Route path='/register' element={<Register/>}/>
        <Route path='/' element={<Navigate to='/login' replace/>} />

        <Route path='/dashboard'
        element={
          <ProtectedRoute>
            <Dashboard/>
          </ProtectedRoute>
        }/>

      </Routes>
      <ToastContainer position='top-right' autoClose={3000}/>
    </Router>
 
  )
}

export default App