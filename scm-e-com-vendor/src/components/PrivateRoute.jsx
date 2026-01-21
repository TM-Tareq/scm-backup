import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

const PrivateRoute = () => {
    const { isAuthenticated, loading } = useAuthStore();

    if (loading) return <div className="p-8">Loading...</div>;

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
