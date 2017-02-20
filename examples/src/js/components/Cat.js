import React from 'react';
import background from '../../images/cat.jpg';


const styles = {
  container: {
    backgroundImage: `url(${background})`,
  },
};

export default () => (
  <div style={styles.container} className="container">
    <div className="inner-container">
      <h1>This is a cat</h1>
    </div>
  </div>
);
