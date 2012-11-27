require.config({
  baseUrl: './lib',
  paths: {
    'app': '../../src'
  },
  map: { '*': { 'jquery': 'zepto' } }
});

define(function(require) {
    var fixtures = require('../fixtures');

    // ********************************************
    // updating feeds from Google

    // start with clean localStorage
    delete localStorage.rssfeeds;

    // ------------ One feed
    var rss = require('app/rssfeeds');
    rss.initGoogle();

    // start with one feed
    // add to listFeeds
    var data = {
      link: fixtures.feeds[0].link,
      title: fixtures.feeds[0].tite
    };
    var feed = rss.feeds.addUnique(data);

    // update empty feed from google
    rss.feeds.update(function() {
      console.log('<---- callback called');
      if (feed.articles.length === 0) {
        throw "Articles not fetched";
      }
      // check if data is automatically stored
      if (!localStorage[feed.articles.tag]) {
        throw 'articles not saved into storage';
      }
      var articlesNumber = feed.articles.length;
      feed.update(function() {
        if (feed.articles.length !== articlesNumber) {
          throw 'Articles should be unique';
        }
      });
    });

    // leave clean localStorage
    delete localStorage.rssfeeds;
    delete localStorage[feed.articles.tag];
    // send a success message
    console.log('----> updating via Google DONE');
});
