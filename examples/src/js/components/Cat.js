import React from 'react';
import background from '../../images/cat.jpg';


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
      <h1 style={styles.text}>This is a cat</h1>
    </div>
  </div>
);
