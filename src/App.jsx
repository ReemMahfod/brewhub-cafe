import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './components/DashboardLayout.jsx';
import RequireAuth from './components/RequireAuth.jsx';
import Landing from './pages/Landing.jsx';
import Login from './pages/Login.jsx';
import PublicMenu from './pages/PublicMenu.jsx';
import PublicBranches from './pages/PublicBranches.jsx';
import OrderCheckout from './pages/OrderCheckout.jsx';
import TrackOrder from './pages/TrackOrder.jsx';
import Overview from './pages/Overview.jsx';
import Orders from './pages/Orders.jsx';
import Menu from './pages/Menu.jsx';
import Branches from './pages/Branches.jsx';
import Staff from './pages/Staff.jsx';
import Equipment from './pages/Equipment.jsx';
import Analytics from './pages/Analytics.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/menu" element={<PublicMenu />} />
      <Route path="/order" element={<OrderCheckout />} />
      <Route path="/track" element={<TrackOrder />} />
      <Route path="/branches" element={<PublicBranches />} />
      <Route path="/login" element={<Login />} />

      <Route
        path="/dashboard"
        element={
          <RequireAuth>
            <DashboardLayout />
          </RequireAuth>
        }
      >
        <Route index element={<Overview />} />
        <Route path="orders" element={<Orders />} />
        <Route path="menu" element={<Menu />} />
        <Route path="branches" element={<Branches />} />
        <Route path="staff" element={<Staff />} />
        <Route path="equipment" element={<Equipment />} />
        <Route path="analytics" element={<Analytics />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
