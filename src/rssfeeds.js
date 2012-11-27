//  Google Feeds API wrapper
//
//  license or something
//

define(function(require) {
  var Backbone = require('backbone');

  var _makeId = function() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < 5; i++ )
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  };

  // Objects
  // * Feed
  // * Article
  //
  var Article = Backbone.Model.extend({
    defaults: {
      // title: "Not specified",
      // link: "Not specified",
      // author: "",
      // content: "Not specified",
      // date: "Not specified"
    },
    initialize: function(data) {
      // TODO: Unify date attribute
    },
    toJSON : function() {
      return {
        title: this.get('title'),
        link: this.get('link'),
        author: this.get('author'),
        content: this.get('content'),
        date: this.get('date')
      };
    }
  });

  var Articles = Backbone.Collection.extend({
    models: Article,

    initialize: function(models, options) {
      this.feed = options.feed;
      this.tag = 'feed:' + this.feed.get('id');
      this.on('remove', this.store);
      this.on('add', this.store);
    },

    /**
     * send raw object to JSON
     */
    toJSON : function() {
      return this.map(function(model){ return model.toJSON(); });
    },

    store: function() {
      localStorage.setItem(this.tag, JSON.stringify(this));
    },

    addUnique: function(data, options) {
      if (this.where({link: data.link}).length == 0) {
        var article = new Article(data);
        this.add(article, options);
        return article;
      }
    }, 

    fetch: function() {
      // reset the collection
      this.reset();
      // load feed list from storage
      var that = this;
      var jsonArticles = localStorage.getItem(this.tag);
      if (jsonArticles) {
        try {
          var storageArticles = JSON.parse(jsonArticles);
        } catch (e) {
          console.error('Corrupted storage - cleaning');
          // TODO: decide if that's the way to clean it
          localStorage.removeItem(this.tag);
        };

        storageArticles.forEach(function(article) {
          // all feeds in storage are unique by link attribute
          // do not fire the 'add' event
          that.add(new Article(article), {silent: true});
        });
      }
    }


  });

  var FeedBase = Backbone.Model.extend({
    defaults: {
      // title: "Not specified",
      // link: "Not specified"
    },
    initialize: function(data) {
      // set id if feed created for the first time
      if (!data.id) {
        this.set('id', _makeId());
      }
      // get articles from storage if available
      jsonArticles = localStorage.getItem('feed:' + this.get('id'));
      if (jsonArticles) {
        this.set('articles', JSON.parse(jsonArticles));
      } else {
        this.set('articles', []);
      }

      this.articles = new Articles(this.get('articles'), {feed: this});
    },

    /**
     * loading new articles
     */
    update: function(data) {
    },

    toJSON : function() {
      return {
        id: this.get('id'),
        title: this.get('title'),
        link: this.get('link')
      };
    }

  });

  var GoogleFeed = FeedBase.extend({
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
            articles.push(new Article(data))
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

  var Feed = GoogleFeed;

  var Feeds = Backbone.Collection.extend({
    models: Feed,

    initialize: function() {
      this.on('remove', this.store);
      this.on('add', this.store);
    },
    /**
     * load feeds from storage
     * overrides the default Backbone fetch method (for a reason)
     */
    fetch: function() {
      // reset the list
      this.reset();
      // load feed list from storage
      var that = this;
      if (localStorage.rssfeeds) {
        try {
          var storageFeeds = JSON.parse(localStorage.rssfeeds);
        } catch (e) {
          console.error('Corrupted storage - cleaning');
          // TODO: decide if that's the way to clean it
          delete localStorage.rssfeeds;
        };

        storageFeeds.forEach(function(feed) {
          // all feeds in storage are unique by link attribute
          // do not fire the 'add' event
          that.add(new Feed(feed), {silent: true});
        });
      }
    },

    /**
     * add an object only if it's not in collection already
     */
    addUnique: function(data, options) {
      if (this.where({link: data.link}).length == 0) {
        var feed = new Feed(data);
        this.add(feed, options);
      }
      return feed;
    },

    /**
     * find an object by id and delete it from collection
     */
    removeById: function(id) {
      feed = this.get(id);
      if (feed) {
        this.remove(feed);
      }
    },

    /**
     * send raw object to JSON
     */
    toJSON : function() {
      return this.map(function(model){ return model.toJSON(); });
    },

    /**
     * store feeds info in storage (not articles)
     */
    store: function() {
      localStorage.rssfeeds = JSON.stringify(this);
    },

    /**
     * load new articles for each feed
     */
    update: function(callback) {
      var updatedFeeds = [];
      var feedsCount = this.length;
      this.each(function(feed) {
        feed.update(function(updatedArticles) {
          updatedFeeds.push({
            feedId: feed.get('id'),
            articles: updatedArticles
          });
          if (callback !== undefined && updatedFeeds.length === feedsCount) {
            callback(updatedFeeds);
          }
        });
      });
    }
  });


  // Actions
  // * getFeedsList - get stored feeds possibly with ability to search
  // * addFeed - add a new feed to the list
  // * updateFeeds - update articles on all given feeds
  // * getArticleList - get stored list of articles
  // * deleteArticle - remove article from the list
  // * readArticle - read article from the stored data

  var google = false;

  var connectGoogleAPI = function() {
    return window.google;
  };

  var feeds = new Feeds();

  return {
    initGoogle: function() {
      google = connectGoogleAPI();
      this.init();
    },
    init: function() {
      // initialize feeds from storage
      feeds.fetch();
    },
    feeds: feeds,
    Feed: Feed
  };
});
