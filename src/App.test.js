import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import CustomerHome from './components/CustomerHome/CustomerHome';
import CustomerSearch from './components/CustomerSearch/CustomerSearch';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});



it('renders without crashing', () => {
  const div = document.createElement('div.section');
  ReactDOM.render(<CustomerHome/>, div);
  ReactDOM.unmountComponentAtNode(div);
});


it('renders without crashing', () => {
  const div = document.createElement('div.section');
  ReactDOM.render(<CustomerSearch/>, div);
  ReactDOM.unmountComponentAtNode(div);
});