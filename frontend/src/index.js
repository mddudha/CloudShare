import React, { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './App';

import '@aws-amplify/ui-react/styles.css';

import { Amplify } from 'aws-amplify';
import config from './aws-exports';
import { ThemeProvider } from '@aws-amplify/ui-react';

Amplify.configure(config);

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);

root.render(
  <ThemeProvider>
    <App />
  </ThemeProvider>
);
