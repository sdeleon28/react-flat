import React from 'react';
import background from '../../images/landing.jpg';


const styles = {
  container: {
    backgroundImage: `url(${background})`,
  },
  text: {
    color: 'white',
  },
};

export default () => (
  <div style={styles.container} className="container">
    <div className="inner-container">
      <h1 style={styles.text}>Landing page</h1>
    </div>
  </div>
);

