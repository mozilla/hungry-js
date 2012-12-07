//  Google Feeds API wrapper
//

define(function(require) {

  var rss = require('./rssfeeds');

  var Feed = rss.Feed.extend({
    /**
     * loading new articles
     */
    update: function(callback) {
      var that = this;
      var gFeed = new google.feeds.Feed(this.get('link'));
      gFeed.load(function(result) {
        var articles = [];
        result.feed.entries.forEach(function(entry) {
          // add only if article is new to the system
          if (that.articles.where({link: entry.link}).length === 0) {
            var data = {
              title: entry.title,
              link: entry.link,
              date: entry.publishedDate,
              author: entry.author,
              content: entry.content
            };
            articles.push(new rss.Article(data))
          }
        });
        // that.storeArticles();
        that.articles.add(articles);
        if (callback !== undefined) {
          callback(articles);
        }
      });
    }
  });

  var Feeds = rss.Feeds.extend({
    models: Feed,
    Feed: Feed
  });

  var google = false;

  var connectGoogleAPI = function() {
    return window.google;
  };

  var feeds = null;

  return {
    initGoogle: function() {
      google = connectGoogleAPI();
      this.init();
    },
    init: function() {
      // initialize feeds from storage
      this.feeds = new Feeds();
      this.feeds.fetch();
    },
    Article: rss.Article,
    feeds: feeds,
    Feed: Feed,
    Feeds: Feeds
  }
});
