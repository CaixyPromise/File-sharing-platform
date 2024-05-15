
import ReactDOM from 'react-dom/client';
import './index.css';
import { Provider } from 'react-redux'
import store from "./stores"
import { RouterProvider } from "react-router-dom"

// import App from './App';
import router from './routers';
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
);
