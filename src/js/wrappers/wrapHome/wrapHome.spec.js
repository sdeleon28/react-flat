/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */

import chai, { expect } from 'chai';
import spies from 'chai-spies';
import {
  UP, DOWN, UP_KEY, DOWN_KEY, PG_UP_KEY, PG_DOWN_KEY,
  handleKeys, handleMouseWheel, scroll,
} from './wrapHome';


chai.use(spies);

describe('wrapFlatHome.js', () => {
  describe('handleKeys()', () => {
    const shouldScrollUp = (key) => {
      const event = {
        keyCode: key,
        stopPropagation: chai.spy(() => {}),
      };
      const fakeScroll = chai.spy((direction) => { expect(direction).to.equal(UP); });
      handleKeys(event, fakeScroll);
      expect(fakeScroll).to.have.been.called();
      expect(event.stopPropagation).to.have.been.called();
    };

    it('should scroll UP when UP ARROW KEY is pressed', () => {
      shouldScrollUp(UP_KEY);
    });

    it('should scroll UP when PAGE UP KEY is pressed', () => {
      shouldScrollUp(PG_UP_KEY);
    });

    const shouldScrollDown = (key) => {
      const event = {
        keyCode: key,
        stopPropagation: chai.spy(() => {}),
      };
      const fakeScroll = chai.spy((direction) => {
        expect(direction).to.equal(DOWN);
      });
      handleKeys(event, fakeScroll);
      expect(fakeScroll).to.have.been.called();
      expect(event.stopPropagation).to.have.been.called();
    };

    it('should scroll DOWN when DOWN ARROW KEY is pressed', () => {
      shouldScrollDown(DOWN_KEY);
    });

    it('should scroll DOWN when PAGE DOWN KEY is pressed', () => {
      shouldScrollDown(PG_DOWN_KEY);
    });

    it('should not interfere with other random keys', () => {
      const event = {
        keyCode: 'random_key',
        stopPropagation: chai.spy(() => {}),
      };
      const fakeScroll = chai.spy(() => {});
      handleKeys(event, fakeScroll);
      expect(fakeScroll).to.not.have.been.called();
      expect(event.stopPropagation).to.not.have.been.called();
    });
  });

  describe('handleMouseWheel()', () => {
    it('should scroll down if `event.deltaY` is positive', () => {
      const event = {
        deltaY: 20,
        ctrlKey: false,
        stopPropagation: chai.spy(() => {}),
      };
      const fakeScroll = chai.spy((direction) => { expect(direction).to.equal(DOWN); });
      handleMouseWheel(event, fakeScroll);
      expect(fakeScroll).to.have.been.called();
      expect(event.stopPropagation).to.have.been.called();
    });

    it('should scroll up if `event.deltaY` is negative', () => {
      const event = {
        deltaY: -20,
        ctrlKey: false,
        stopPropagation: chai.spy(() => {}),
      };
      const fakeScroll = chai.spy((direction) => { expect(direction).to.equal(UP); });
      handleMouseWheel(event, fakeScroll);
      expect(fakeScroll).to.have.been.called();
      expect(event.stopPropagation).to.have.been.called();
    });

    it('should not interfere if the user is holding down the Ctrl key (zoom gesture)', () => {
      const event = {
        deltaY: -20,
        ctrlKey: true,
        stopPropagation: chai.spy(() => {}),
      };
      const fakeScroll = chai.spy(() => {});
      handleMouseWheel(event, fakeScroll);
      expect(fakeScroll).to.not.have.been.called();
      expect(event.stopPropagation).to.not.have.been.called();
    });
  });

  describe('scroll()', () => {
    it('should detect next section correctly', () => {
      let scrollToId;
      let currentYOffset;
      const scrollDirection = DOWN;
      const sections = ['section1', 'section2', 'section3'];
      const sectionYOffsets = [0, 500, 1000];

      // The window is perfectly positioned on section 2. Next should be 3.
      currentYOffset = 500;
      scrollToId = chai.spy((id) => { expect(id).to.equal('section3'); });
      scroll(scrollToId, scrollDirection, sections, sectionYOffsets, currentYOffset);
      expect(scrollToId).to.have.been.called();

      // The window is off by 1px, below the start of section 2. Next should be 3.
      currentYOffset = 501;
      scrollToId = chai.spy((id) => { expect(id).to.equal('section3'); });
      scroll(scrollToId, scrollDirection, sections, sectionYOffsets, currentYOffset);
      expect(scrollToId).to.have.been.called();

      // The window is off by 1px, above the start of section 2. Next should be section 3.
      currentYOffset = 499;
      scrollToId = chai.spy((id) => { expect(id).to.equal('section3'); });
      scroll(scrollToId, scrollDirection, sections, sectionYOffsets, currentYOffset);
      expect(scrollToId).to.have.been.called();
    });

    it('should detect previous section correctly', () => {
      let scrollToId;
      let currentYOffset;
      const scrollDirection = UP;
      const sections = ['section1', 'section2', 'section3'];
      const sectionYOffsets = [0, 500, 1000];

      // The window is perfectly positioned on section 2. Previous should be 1.
      currentYOffset = 500;
      scrollToId = chai.spy((id) => { expect(id).to.equal('section1'); });
      scroll(scrollToId, scrollDirection, sections, sectionYOffsets, currentYOffset);
      expect(scrollToId).to.have.been.called();

      // The window is off by 1px, below the start of section 2. Previous should be 1.
      currentYOffset = 501;
      scrollToId = chai.spy((id) => { expect(id).to.equal('section1'); });
      scroll(scrollToId, scrollDirection, sections, sectionYOffsets, currentYOffset);
      expect(scrollToId).to.have.been.called();

      // The window is off by 1px, above the start of section 3. Previous should be section 2.
      currentYOffset = 999;
      scrollToId = chai.spy((id) => { expect(id).to.equal('section2'); });
      scroll(scrollToId, scrollDirection, sections, sectionYOffsets, currentYOffset);
      expect(scrollToId).to.have.been.called();
    });

    it('should not scroll up if the current section is the first one', () => {
      const scrollToId = chai.spy(() => {});
      const currentYOffset = 0;
      const scrollDirection = UP;
      const sections = ['section1', 'section2', 'section3'];
      const sectionYOffsets = [0, 500, 1000];
      scroll(scrollToId, scrollDirection, sections, sectionYOffsets, currentYOffset);
      expect(scrollToId).to.not.have.been.called();
    });

    it('should not scroll down if the current section is the last one', () => {
      const scrollToId = chai.spy(() => {});
      const currentYOffset = 1000;
      const scrollDirection = DOWN;
      const sections = ['section1', 'section2', 'section3'];
      const sectionYOffsets = [0, 500, 1000];
      scroll(scrollToId, scrollDirection, sections, sectionYOffsets, currentYOffset);
      expect(scrollToId).to.not.have.been.called();
    });

    it('should not interfere if there are no sections', () => {
      const scrollToId = chai.spy(() => {});
      const currentYOffset = 1000;
      const scrollDirection = DOWN;
      const sections = [];
      const sectionYOffsets = [];
      scroll(scrollToId, scrollDirection, sections, sectionYOffsets, currentYOffset);
      expect(scrollToId).to.not.have.been.called();
    });
  });
});
