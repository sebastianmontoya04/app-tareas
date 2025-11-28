import { Routes, Route } from 'react-router-dom'
import { Login } from './pages/Login'
import { SingIn } from './pages/SingIn'
import { Dashboard } from './pages/Dashboard'

export const AppRouter = () => {
    return <>
        <Routes>
            <Route path='/' element={<Login />}></Route>
            <Route path='/Login' element={<Login />}></Route>
            <Route path='/SingIn' element={<SingIn />}></Route>
            <Route path='/Dashboard' element={<Dashboard />}></Route>
        </Routes>
    </>
}
