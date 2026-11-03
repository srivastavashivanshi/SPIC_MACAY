import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import './styles.css';
import App from './App.jsx';
import { DataProvider } from './lib/DataContext.jsx';
import { LangProvider } from './lib/i18n.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <LangProvider>
        <DataProvider>
          <App />
        </DataProvider>
      </LangProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
