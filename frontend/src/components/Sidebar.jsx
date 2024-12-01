import { Link } from "react-router-dom";

const Sidebar = ({ userRole }) => {
  return (
    <div className="bg-gray-800 text-white w-64 p-4 space-y-4">
      <h2 className="text-lg font-semibold">
        {userRole === "admin" ? "Admin Navigation" : "User Navigation"}
      </h2>
      <nav>
        {userRole === "admin" ? (
          <>
            <Link to="/home" className="block p-2 hover:bg-gray-700 rounded">
              Home
            </Link>
            <Link to="/employees" className="block p-2 hover:bg-gray-700 rounded">
              Manage Employees
            </Link>
            <Link to="/orders/admin" className="block p-2 hover:bg-gray-700 rounded">
              Manage Orders
            </Link>
            <Link to="/suppliers" className="block p-2 hover:bg-gray-700 rounded">
              Manage Supplier
            </Link>
          </>
        ) : (
          <>
            <Link to="/homeu" className="block p-2 hover:bg-gray-700 rounded">
              Home
            </Link>
            <Link to="/orders" className="block p-2 hover:bg-gray-700 rounded">
              View Orders
            </Link>
            <Link to="/SettingsUser" className="block p-2 hover:bg-gray-700 rounded">
              My Profile
            </Link>
            <Link to="/orders/user" className="block p-2 hover:bg-gray-700 rounded">
              Manage Orders
            </Link>
          </>
        )}
      </nav>
    </div>
  );
};

export default Sidebar;
