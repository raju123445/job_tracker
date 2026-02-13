import { Outlet } from "react-router-dom";
import AppNavBar from "@/components/AppNavBar";

const AppLayout = () => {
  return (
    <div className="flex flex-col h-screen bg-background">
      <AppNavBar />
      <Outlet />
    </div>
  );
};

export default AppLayout;
