import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter, Route, Routes} from "react-router-dom";

import {Router} from 'pages/router';
import {Setup} from 'pages/setup/Setup';
import {Player} from 'pages/player/Player';
import {Browse} from 'pages/browse/Browse';
import {ConfigContextProvider} from 'lib/contexts/ConfigContext';
import {PlayerContextProvider} from 'lib/contexts/PlayerContext';

import 'styles/main.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <PlayerContextProvider>
      <ConfigContextProvider>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Router/>} />
            <Route path='/setup' element={<Setup/>} />
            <Route path='/browse' element={<Browse/>} />
            <Route path='/player' element={<Player/>} />
          </Routes>
        </BrowserRouter>
      </ConfigContextProvider>
    </PlayerContextProvider>
  </React.StrictMode>
);
