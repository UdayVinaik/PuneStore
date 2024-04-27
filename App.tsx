import React from 'react';
import Routes from './src/Helpers/Navigation/Routes';
import {Provider} from 'react-redux';
import store from './src/Storage/store';

const App = () => {
  return (
    <Provider store={store}>
      <Routes />
    </Provider>
  );
};

export default App;
