/* eslint-disable */
// Extracted from this post:
// https://medium.com/@TomazZaman/how-to-get-fast-unit-tests-with-out-webpack-793c408a076f#.5rl5qdq03
import fs from 'fs';
import path, { resolve } from 'path';
import assert from 'assert';
import Module from 'module';
import jsdom from 'jsdom';
import Mocha from 'mocha';
import chokidar from 'chokidar';

// Let's import and globalize testing tools so
// there's no need to require them in each test
import sinon from 'sinon';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use( chaiAsPromised );

// Environment setup (used by Babel as well, see .babelrc)
process.env['NODE_ENV'] = 'test';

/**
 * Monkey-patching the Function prototype so we can have require.ensure working.
 * Easier achieved than hacking the Module for targeting the "require" specifically.
 */
Function.prototype.ensure = ( arr, func ) => func();

/**
 * Monkey-patching native require, because Webpack supports requiring files, other
 * than JavaScript. But Node doesn't recognize them, so they should be ignored.
 * IMPORTANT: don't use arrow functions because they change the scope of 'this'!
 */
Module.prototype.require = function( path ) {
  const types = /\.(s?css|sass|less|svg|html|png|jpe?g|gif)$/;
  if ( path.search( types ) !== -1 ) return;

  // Mimics Webpack's "alias" feature
  if ( path === 'config' ) {
    path = resolve( './src/js/secrets/test.js' );
  }

  assert( typeof path === 'string', 'path must be a string' );
  assert( path, 'missing path' );

  return Module._load( path, this );
};

// setup the simplest document possible
let doc = jsdom.jsdom( '<!doctype html><html><body></body></html>' );
let win = doc.defaultView;

// set globals for mocha that make access to document and window feel
// natural in the test environment
global.document = doc;
global.window = win;
global.self = global;
global.chai = chai;
global.expect = expect;
global.sinon = sinon;

/**
 * Take all the properties of the window object and attach them to the mocha
 * global object. This is to prevent 'undefined' errors which sometime occur.
 * Gotten from: http://jaketrent.com/post/testing-react-with-jsdom/
 * @param  {object} window: The fake window, build by jsdom
 */
( ( window ) => {
  for ( let key in window ) {
    if ( ! window.hasOwnProperty( key ) ) continue;
    if ( key in global ) continue;
    global[ key ] = window[ key ];
  }
} )( win );

/**
 * A helper function to run Mocha tests. Since Mocha doesn't support changing
 * tested files dynamically (except for adding), we need to clear require's
 * cache on every run and instantiate a new runner.
 */
let fileList = [];
function runSuite() {
  Object.keys( require.cache ).forEach( key => delete require.cache[ key ] );
  const mocha = new Mocha();
  //const mocha = new Mocha( { reporter: 'list' } );
  //const mocha = new Mocha( { reporter: 'dot' } );
  fileList.forEach( filepath => mocha.addFile( filepath ) );
  mocha.run();
}

// HEADS-UP! I made some changes here
/**
 * Chokidar watches all the files for any kind of change and calls the run function
 * from above. Read more: https://github.com/paulmillr/chokidar
 * @param  {string} a glob of files to watch
 * @param  {object} settings
 */
chokidar.watch( 'src/**/*.spec.js', { persistent: true } )
  .on( 'add', path => fileList.push( path ) )
  // The next line was in the original file because the test and src folders were separate. Since
  // I'm keeping my tests in a different folder structure, what the next line does is already
  // covered by the next watch statement.
  //.on( 'change', path => runSuite() )
  .on( 'ready', () => runSuite() );

chokidar.watch( 'src/**/*.js', { persistent: true } )
  .on( 'change', path => runSuite() )
