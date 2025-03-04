import { ToastContainer } from "react-toastify";

const Toaster = () => {
  return <ToastContainer position="top-right" autoClose={3000} aria-label="Notification Container" />;
};

export default Toaster;
