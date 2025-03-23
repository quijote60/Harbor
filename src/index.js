import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/shared.css';
import App from './App';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import { store } from './app/store';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {disableReactDevTools} from '@fvilers/disable-react-devtools'
import 'assets/'

if (process.env.NODE_ENV === 'production') disableReactDevTools()

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
   
    <Provider store={store}>
    <ToastContainer/>
    <BrowserRouter>
      <Routes>
        <Route path='/*' element={<App/>} />
      </Routes>
    </BrowserRouter>
    </Provider>
    
  </React.StrictMode>
);
