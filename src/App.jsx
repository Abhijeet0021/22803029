import { Routes, Route } from 'react-router-dom'
import AllNotifications from './Pages/AllNotifications'
import Priorityinbox from './Pages/Priorityinbox'
import NavBar from './components/NavBar'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AllNotifications />} />
      <Route path="/priority" element={<Priorityinbox />} />
    </Routes>
  )
}