import React from 'react';
import background from '../../images/clock.jpg';


const styles = {
  container: {
    background: `url(${background})`,
  },
};

export default () => (
  <div style={styles.container} className="container">
    <div className="inner-container">
      <h1>And this is a clock</h1>
      <p>Stop procrastinating and integrate react-flat into your web page.</p>
    </div>
  </div>
);
