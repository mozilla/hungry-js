define(function(require) {

  return {
    feeds: [
      {"id":"abcde","title":"NPR Business News","link":"http://www.npr.org/rss/rss.php?id=1006"},
      {"id":"bcdef","title":"Some not existing feed","link":"http://example.com/rss.php"}
    ],
    articles: {
      'abcde': [
        { title:"The Last Word In Business", 
          link:"http://www.npr.org/2012/11/23/165754320/the-last-word-in-business?ft=1&f=1006", 
          date:"Fri, 23 Nov 2012 01:00:00 -0800", 
          author:"", 
          content:"<p>Linda Wertheimer and Steve Inskeep have the Last Word in business.</p><p><a href=\"http://www.npr.org/templates/email/emailAFriend.php?storyId=165754320\">\xBB E-Mail This</a>\xA0\xA0\xA0\xA0 <a href=\"http://del.icio.us/post?url=http%3A%2F%2Fwww.npr.org%2Ftemplates%2Fstory%2Fstory.php%3FstoryId%3D165754320\">\xBB Add to Del.icio.us</a></p>"
        }, 
        { title:"Cyprus, Turkey Divided Over Natural Gas Supply", 
          link:"http://www.npr.org/2012/11/23/165754318/cyprus-natural-gas?ft=1&f=1006", 
          date:"Fri, 23 Nov 2012 01:00:00 -0800", 
          author:"", 
          content:"<p>Negotiations are underway that my lead to Cyprus becoming the fifth eurozone country to receive a bailout. But the small island nation is drilling under the Mediterranean Sea for natural gas. Cyprus could get very wealthy selling the gas but it's facing opposition from Turkey, which has occupied part of the island since 1974.</p><p><a href=\"http://www.npr.org/templates/email/emailAFriend.php?storyId=165754318\">\xBB E-Mail This</a>\xA0\xA0\xA0\xA0 <a href=\"http://del.icio.us/post?url=http%3A%2F%2Fwww.npr.org%2Ftemplates%2Fstory%2Fstory.php%3FstoryId%3D165754318\">\xBB Add to Del.icio.us</a></p>"
        },
        { title:"Business News", 
          link:"http://www.npr.org/2012/11/23/165754316/business-news?ft=1&f=1006", 
          date:"Fri, 23 Nov 2012 01:00:00 -0800", 
          author:"", 
          content:"<p>Linda Wertheimer has business news.</p><p><a href=\"http://www.npr.org/templates/email/emailAFriend.php?storyId=165754316\">\xBB E-Mail This</a>\xA0\xA0\xA0\xA0 <a href=\"http://del.icio.us/post?url=http%3A%2F%2Fwww.npr.org%2Ftemplates%2Fstory%2Fstory.php%3FstoryId%3D165754316\">\xBB Add to Del.icio.us</a></p><a rel=\"nofollow\" href=\"http://ad.doubleclick.net/jump/n6735.NPR/news_business;sz=300x80;ord=1492238879\"><img alt=\"\" src=\"http://ad.doubleclick.net/ad/n6735.NPR/news_business;sz=300x80;ord=1492238879\"></a>"
        },
        { title:"Burgundy's Yield Fails To Meet Grape Expectations", 
          link:"http://www.npr.org/2012/11/22/165688553/burgundys-yield-fails-to-meet-grape-expectations?ft=1&f=1006", 
          date:"Thu, 22 Nov 2012 12:36:00 -0800", 
          author:"", 
          content:"<p>Bad weather this year has made the 2012 grape harvest the smallest in a half-century; this at a time when sales of Burgundy are booming in the U.S., Britain and across Asia. But wine makers seem to be taking the loss in stride.</p><p><a href=\"http://www.npr.org/templates/email/emailAFriend.php?storyId=165688553\">\xBB E-Mail This</a>\xA0\xA0\xA0\xA0 <a href=\"http://del.icio.us/post?url=http%3A%2F%2Fwww.npr.org%2Ftemplates%2Fstory%2Fstory.php%3FstoryId%3D165688553\">\xBB Add to Del.icio.us</a></p>"
        }
      ]
    }
  };
});
