import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter, Route, Routes} from "react-router-dom";

import {Router} from 'pages/router';
import {Setup} from 'pages/setup/Setup';
import {Player} from 'pages/player/Player';
import {ConfigContextProvider} from 'lib/contexts/ConfigContext';

import 'styles/main.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ConfigContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Router/>} />
          <Route path='/setup' element={<Setup/>} />
          <Route path='/player' element={<Player/>} />
        </Routes>
      </BrowserRouter>
    </ConfigContextProvider>
  </React.StrictMode>
);
