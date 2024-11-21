import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Activity, Settings } from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', icon: <Home />, path: '/dashboard' },
    { name: 'Activity', icon: <Activity />, path: '/activitylog' },
    { name: 'Settings', icon: <Settings />, path: '/settings' },
  ];

  return (
    <div className="w-[4%] h-[100vh] bg-white fixed left-0 top-0 flex flex-col items-center py-4">
      <div className="mb-8">
        <h1 className="text-lg bg-black text-white font-extrabold rounded-lg p-2 py-1">PA</h1>
      </div>

      <div className="flex-1 flex flex-col w-full justify-start">
        {menuItems.map((item, index) => (
          <button
            key={index}
            className={`flex flex-col items-center py-4 w-full ${location.pathname === item.path
                ? 'bg-[#eaeaea] text-blue-950'
                : 'text-zinc-600 hover:bg-zinc-100 hover:text-black'
              } transition duration-200`}
            onClick={() => navigate(item.path)}
          >
            <div className="mb-2">{item.icon}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
