import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/app/app';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import store from './store/store';
import { config } from 'dotenv';

import './index.css';
import './theme/discord-theme.css';
import 'tailwindcss/dist/tailwind.min.css';
import '@fortawesome/fontawesome-svg-core/styles.css';

config({ path: '../env' });

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
