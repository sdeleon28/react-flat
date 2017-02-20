import React from 'react';
import background from '../../images/landing.jpg';


const styles = {
  container: {
    backgroundImage: `url(${background})`,
  },
};

export default () => (
  <div style={styles.container} className="container">
    <div className="inner-container">
      <h1>Landing page</h1>
    </div>
  </div>
);
