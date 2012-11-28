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
    // Storing feeds

    // ############ Saving feed
    // start with clean localStorage
    delete localStorage.rssfeeds;

    // ------------ One feed
    var rss = require('app/rssfeeds');
    rss.init();

    // start with one feed
    // add to listFeeds
    var data = {
      link: fixtures.feeds[0].link,
      title: fixtures.feeds[0].tite
    };
    var feed = rss.feeds.addUnique(data);
    // check if id is created properly
    if (!feed.get('id')) {
      throw 'No id created for the feed';
    }

    // check if feed is stored
    var jsonFeeds = localStorage.rssfeeds;
    var feedFromStorage = JSON.parse(jsonFeeds)[0];
    if (feedFromStorage.link != feed.get('link')) {
      throw 'feed is not stored properly';
    }

    // ------------- Add another feed
    var data = {
      link: fixtures.feeds[1].link,
      title: fixtures.feeds[1].tite
    };
    var feed2 = rss.feeds.addUnique(data);
    // check if id is created properly
    if (!feed2.get('id')) {
      throw 'No id created for the feed';
    }
    var jsonFeeds = localStorage.rssfeeds;
    var feedFromStorage = JSON.parse(jsonFeeds)[0];
    if (feedFromStorage.link !== feed.get('link')) {
      throw 'feeds are not stored properly';
    }
    var feedFromStorage = JSON.parse(jsonFeeds)[1];
    if (feedFromStorage.link !== feed2.get('link')) {
      throw 'feed is not stored properly';
    }


    // ############ Read stored feeds
    // clean feeds
    var rss = require('app/rssfeeds');
    rss.feeds.reset();
    // store fixtures in localStorage
    localStorage.rssfeeds = JSON.stringify(fixtures.feeds);

    rss.feeds.fetch();
    if (rss.feeds.length !== 2) {
      throw "Wrong number of models fetched from storage: " + rss.feeds.length;
    }
    var feed = rss.feeds.models[0];
    if (feed.get('id') !== fixtures.feeds[0].id) {
      throw 'Wrong id in feed taken from storage ' + feed.get('id') + ' != ' + fixtures.feeds[0].id;
    }
    var feed2 = rss.feeds.models[1];
    if (feed2.get('id') !== fixtures.feeds[1].id) {
      throw 'Wrong id in feed taken from storage ' + feed2.get('id') + ' != ' + fixtures.feeds[1].id;
    }

    // ############ Remove feed
    // clean feeds
    var rss = require('app/rssfeeds');
    rss.feeds.reset();
    // store data in localStorage
    localStorage.rssfeeds = JSON.stringify(fixtures.feeds);

    rss.feeds.fetch();

    rss.feeds.removeById(fixtures.feeds[1].id);

    if (rss.feeds.length !== 1) {
      throw "Feed not deleted";
    }

    if (rss.feeds.models[0].get('id') !== fixtures.feeds[0].id) {
      throw "Wrong feed has been removed";
    }

    // check if it has been automatically stored
    if (JSON.parse(localStorage.rssfeeds).length !== 1) {
      throw 'Not stored automatically onRemove';
    }

    // leave clean localStorage
    delete localStorage.rssfeeds;
    // send a success message
    console.log('----> feedsStorage DONE');

    // ********************************************
    // Articles storage

    // add the feed
    localStorage.rssfeeds = JSON.stringify([fixtures.feeds[0]]);
    rss.feeds.fetch();
    var feed = rss.feeds.models[0];
    feed.articles.reset();
    // add an article to a feed
    var articleContent =  { 
      title:'The Last Word In Business', 
      link:'http://www.npr.org/2012/11/23/165754320/the-last-word-in-business?ft=1&f=1006', 
      date:'Fri, 23 Nov 2012 01:00:00 -0800', 
      author:'', 
      content:'<p>Some content</p>'
    }; 
    var article = feed.articles.addUnique(articleContent);
    if (!feed.articles.length > 0) {
      throw 'Article is not added to the collection';
    }
    if (feed.articles.models[0].get('title') !== article.get('title')) {
      throw 'Article is not added to the feed';
    }
    // check if article is automatically stored in storage
    var inStorage = localStorage.getItem(feed.articles.tag);
    if (!inStorage) {
      throw 'Article is not added to the storage';
    }

    // check if article collection is properly instantiated from storage
    // add fixtures to storage
    localStorage.setItem(feed.articles.tag, 
        JSON.stringify(fixtures.articles[feed.get('id')]));
    feed.articles.fetch();
    if (feed.articles.models[0].get('title') !== fixtures.articles[feed.get('id')][0].title) {
      throw 'Error in fetching articles from storage';
    }


    // leave clean localStorage
    delete localStorage.rssfeeds;
    delete localStorage[feed.articles.tag];
    // send a success message
    console.log('----> articlesStorage DONE');
});
