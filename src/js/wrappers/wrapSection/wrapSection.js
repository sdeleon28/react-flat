import React from 'react';
import isMobile from '../../utils/isMobile';


/**
 * A full-height section of a screen.
 */
const wrapSection = (id, Section) => class SectionWrapper extends React.Component {
  constructor() {
    super();
    this.updateDimensions = this.updateDimensions.bind(this);
    this.getSectionStyles = this.getSectionStyles.bind(this);
    this.state = {
      height: null,
      width: null,
    };
  }

  componentWillMount() {
    this.updateDimensions();
    if (!this.isMobileBrowser()) {
      window.addEventListener('resize', this.updateDimensions);
    }
  }

  componentWillUnmount() {
    if (!this.isMobileBrowser()) {
      window.removeEventListener('resize', this.updateDimensions);
    }
  }

  /**
   * Parses the user agent string to determine if the device is mobile. This has nothing to do with
   * screen size.
   */
  isMobileBrowser() {
    return isMobile();
  }

  getSectionStyles() {
    const { height } = this.state;
    return {
      height,
      margin: 0,
      padding: 0,
      border: 'none',
    };
  }

  /**
   * Updates the screen dimensions in the state of the component. This method is run whenever the
   * screen is resized.
   */
  updateDimensions() {
    if (this.isMobileBrowser()) {
      // Using screen.height prevents mobile browsers (like Chrome on Android) from jumping the
      // screen contents around when the URL bar slides up and down.
      this.setState({
        height: screen.height,
        width: screen.width,
      });
    } else {
      this.setState({
        height: window.innerHeight,
        width: window.innerWidth,
      });
    }
  }

  render() {
    return (
      <section id={id} style={this.getSectionStyles()}>
        <Section />
      </section>
    );
  }
};

export default wrapSection;
