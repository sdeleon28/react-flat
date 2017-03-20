import React from 'react';
import _ from 'lodash';
import $ from 'jquery';
import isMobile from '../../utils/isMobile';


const UP_KEY = 38;
const DOWN_KEY = 40;
const PG_UP_KEY = 33;
const PG_DOWN_KEY = 34;
const UP = 'up';
const DOWN = 'down';

const handleKeys = (event, scroll) => {
  const code = parseInt(event.keyCode, 10);
  if (code === UP_KEY || code === PG_UP_KEY) {
    scroll(UP);
    event.stopPropagation();
  } else if (code === DOWN_KEY || code === PG_DOWN_KEY) {
    scroll(DOWN);
    event.stopPropagation();
  }
};

const handleMouseWheel = (event, scroll) => {
  if (!event.ctrlKey) {
    scroll(event.deltaY >= 0 ? DOWN : UP);
    event.stopPropagation();
  }
};

const scroll = (scrollToId, scrollDirection, sections, sectionYOffsets, currentYOffset) => {
  const topOffsets = [...sectionYOffsets, Infinity];

  const yOffsetErrorMargin = 2;
  const yOffsetRange = [currentYOffset - yOffsetErrorMargin, currentYOffset + yOffsetErrorMargin];
  const [yOffsetLowBoundary, yOffsetHighBoundary] = yOffsetRange;

  const currentSectionIndex = topOffsets.findIndex(
      offset => offset > yOffsetLowBoundary && offset < yOffsetHighBoundary);
  const insideBounds = n => (n >= 0 && n < sections.length);
  const nextSectionIndex = scrollDirection === DOWN ?
    currentSectionIndex + 1 : currentSectionIndex - 1;
  if (insideBounds(nextSectionIndex)) {
    const nextSection = sections[nextSectionIndex];
    scrollToId(nextSection);
  }
};

const scrollToSectionInDirection = (sections, scrollDirection) => {
  const scrollToId = (id) => {
    $('html, body').animate({ scrollTop: $(`#${id}`).offset().top }, 300);
  };
  const currentYOffset = $(window).scrollTop();
  const sectionOffsets = sections
    .map(id => $(`#${id}`))
    .map(node => node.offset())
    .map(offset => offset.top);
  scroll(scrollToId, scrollDirection, sections, sectionOffsets, currentYOffset);
};

const wrapHome = (sections, Home) => class FlatHome extends React.Component {
  constructor() {
    super();

    // Bind event handling methods
    this.handleArrows = this.handleArrows.bind(this);
    this.handleMouseWheel = this.handleMouseWheel.bind(this);
    this.scrollToSectionInDirection = _.curry(scrollToSectionInDirection)(sections);
  }

  handleArrows(event) {
    handleKeys(event, this.scrollToSectionInDirection);
  }

  handleMouseWheel(event) {
    handleMouseWheel(event, this.scrollToSectionInDirection);
  }

  componentDidMount() {
    if (isMobile()) {
      // If it's a mobile device, don't do any fancy scrolling
      $('body').css({ overflow: 'auto' });
    } else {
      // If it's a desktop client, remove the scrollbar and smoothly navigate between sections when
      // the mousewheel is used.
      $('body').css({ overflow: 'hidden' });
      window.addEventListener('wheel', this.handleMouseWheel);
      window.addEventListener('keydown', this.handleArrows);
    }
  }

  componentWillUnount() {
    if (!isMobile()) {
      window.removeEventListener('wheel', this.handleMouseWheel);
      window.removeEventListener('keydown', this.handleArrows);
    }
  }

  render() {
    return (<Home />);
  }
};

export default wrapHome;
export { UP, DOWN, UP_KEY, DOWN_KEY, PG_UP_KEY, PG_DOWN_KEY, handleKeys, handleMouseWheel, scroll };

