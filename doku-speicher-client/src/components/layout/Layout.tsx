import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className=" h-screen">
      <main className="h-full">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
