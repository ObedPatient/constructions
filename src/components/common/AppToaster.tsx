import { Bounce, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AppToaster() {
  return (
    <ToastContainer
      position="top-center"
      autoClose={6000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      pauseOnHover
      draggable
      transition={Bounce}
      toastClassName="app-toast"
      progressClassName="app-toast-progress"
    />
  );
}
