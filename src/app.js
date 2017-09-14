import React from 'react';
import {render} from 'react-dom';
import { Provider } from 'react-redux'

import Usb from './components/usb';
import Iso from './components/iso';
import Persistence from './components/persistence';
import Advanced from './components/advanced';
import Burn from './components/burn';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import style from './style.css';

import configureStore from './store';
const store = configureStore();

class App extends React.Component {
  render () {
    return(
      <Provider store={store}>
        <div className="app">
          <h1 style={{ textAlign: "center"}}>BootableUSB</h1>
          <Usb />
          <Iso />
          <Persistence />
          <Advanced />
          <Burn />
        </div>
      </Provider>
    );
  }
}

render(
    <MuiThemeProvider>
      <App />
    </MuiThemeProvider>
, document.getElementsByTagName("BODY")[0]);