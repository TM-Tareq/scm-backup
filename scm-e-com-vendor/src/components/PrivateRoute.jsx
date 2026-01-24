import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

const PrivateRoute = () => {
    const { isAuthenticated, loading, user } = useAuthStore();
    const location = useLocation();

    if (loading) return <div className="p-8 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;

    if (!isAuthenticated) return <Navigate to="/login" replace />;

    // If vendor is NOT approved (pending/rejected/none) AND trying to access anything other than dashboard or setup
    if (user?.vendorStatus !== 'approved') {
        const allowedPaths = ['/dashboard', '/setup-store'];
        if (!allowedPaths.includes(location.pathname)) {
            return <Navigate to="/dashboard" replace />;
        }
    }

    return <Outlet />;
};

export default PrivateRoute;
