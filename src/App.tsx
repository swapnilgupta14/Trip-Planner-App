import { Outlet } from 'react-router-dom';
import { PackingProvider } from './context/AppContext';
import Sidebar from './Sidebar';
import { ToastContainer } from 'react-toastify';

export default function App() {
    return (
        <>
            <PackingProvider>
                <div className="flex h-screen">
                    <Sidebar />
                    <div className="flex-1 overflow-y-auto">
                        <Outlet />
                    </div>
                </div>
            </PackingProvider>
            <ToastContainer
                position="bottom-right"
                hideProgressBar={true}
                closeOnClick
                pauseOnHover
                draggable
                autoClose={1500}
                limit={3}
                toastStyle={{
                    borderRadius: "40px",
                    padding: "15px",
                    border: "green solid 1px",
                }}
            />
        </>
    );
}
