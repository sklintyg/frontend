import React from 'react';
import ReactDOM from 'react-dom/client';
import { Layout } from './layout';

import './styling/inera-admin.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
        <Layout />
  </React.StrictMode>,
);