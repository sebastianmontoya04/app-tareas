import { Routes, Route } from 'react-router-dom'
import { Login } from './pages/Login'
import { SingIn } from './pages/SingIn'
import { Dashboard } from './pages/Dashboard'
import ProtectedRoutes from './components/ProtectedRoutes'

export const AppRouter = () => {
    return <>
        <Routes>
            <Route path='/' element={<Login />} />
            <Route path='/Login' element={<Login />} />
            <Route path='/SingIn' element={<SingIn />} />
            <Route path='/Dashboard'
                element={
                    <ProtectedRoutes>
                        <Dashboard />
                    </ProtectedRoutes>
                }
            />
        </Routes>
    </>
}
