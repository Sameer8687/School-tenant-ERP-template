import { Navigate, Outlet } from 'react-router-dom';
import { LoaderCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute() {
    const { loading, isAuthenticated } = useAuth();

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50">
                <LoaderCircle
                    className="animate-spin text-[#257cbe]"
                    size={32}
                />
            </div>
        );
    }

    return isAuthenticated
        ? <Outlet />
        : <Navigate to="/login" replace />;
}