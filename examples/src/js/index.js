import React from 'react';
import ReactDOM from 'react-dom';
import { wrapHome, wrapSection } from '../../../src/js/index';
import Landing from './components/Landing';
import Cat from './components/Cat';
import Clock from './components/Clock';


require('../styles/general.css');

const sections = [
  'landing',
  'cat',
  'clock',
];

const WrappedLanding = wrapSection('landing', Landing);
const WrappedCat = wrapSection('cat', Cat);
const WrappedClock = wrapSection('clock', Clock);
const Home = wrapHome(sections, () => (
  <div>
    <WrappedLanding />
    <WrappedCat />
    <WrappedClock />
  </div>
));

const app = document.getElementById('app');
ReactDOM.render(<Home />, app);
