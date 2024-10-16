import RightPanel from '../common/RightPanel';
import Sidebar from '../common/Sidebar';
import { Outlet } from 'react-router-dom';

const RootLayout = ({ authUser }) => {
  return (
    <div className="flex max-w-6xl mx-auto">
      {authUser && <Sidebar />}
      <div className="flex-1">
        <Outlet />
      </div>
      {authUser && <RightPanel />}
    </div>
  );
};

export default RootLayout;
