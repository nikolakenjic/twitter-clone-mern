import RightPanel from '../common/RightPanel';
import Sidebar from '../common/Sidebar';
import { Outlet } from 'react-router-dom';

const RootLayout = () => {
  return (
    <div className="flex max-w-6xl mx-auto">
      <Sidebar />
      <div className="flex-1">
        <Outlet />
      </div>
      <RightPanel />
    </div>
  );
};

export default RootLayout;
