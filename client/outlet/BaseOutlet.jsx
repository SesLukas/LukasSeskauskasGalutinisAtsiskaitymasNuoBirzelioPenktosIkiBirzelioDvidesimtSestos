import { Outlet } from "react-router";

const BaseOutlet = () => {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
};

export default BaseOutlet;