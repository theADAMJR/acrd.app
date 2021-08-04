import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/app';
import reportWebVitals from './reportWebVitals';
import { config } from 'dotenv';
import { Provider } from 'react-redux';
import configureStore from './store/configure-store';

import './index.css';
import './theme/discord-theme.css';
import 'tailwindcss/dist/tailwind.min.css';
import '@fortawesome/fontawesome-svg-core/styles.css';

config({ path: '../env' });

ReactDOM.render(
  <Provider store={configureStore()}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
