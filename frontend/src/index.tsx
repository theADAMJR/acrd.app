import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/app';
import reportWebVitals from './reportWebVitals';
import { config } from 'dotenv';
import { Provider } from 'react-redux';
import configureStore from './store/configure-store';
import { SnackbarProvider } from 'notistack';

import './index.css';

config({ path: '../env' });

ReactDOM.render(
  <SnackbarProvider maxSnack={1}>
    <Provider store={configureStore()}>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </Provider>
  </SnackbarProvider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
