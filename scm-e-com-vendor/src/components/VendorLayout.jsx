import { Outlet } from 'react-router-dom';
import Sidebar from './layout/Sidebar';
import Topbar from './layout/Topbar';

const VendorLayout = () => {
    return (
        <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 font-sans transition-colors">
            <Sidebar />
            <div className="flex-1 flex flex-col ml-20 md:ml-64 transition-all duration-300">
                <Topbar />
                <main className="flex-1 p-8 overflow-y-auto dark:text-slate-200">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default VendorLayout;
