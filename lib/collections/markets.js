Markets = new Mongo.Collection('markets');

Markets.allow({
  update: function(userId, market) { return ownsDocument(userId, market); },
  remove: function(userId, market) { return ownsDocument(userId, market); },
});

Markets.deny({
  update: function(userId, market, fieldNames) {
    // may only edit the following two fields:
    return (_.without(fieldNames, 'url', 'title').length > 0);
  }
});

Markets.deny({
  update: function(userId, market, fieldNames, modifier) {
    var errors = validatePost(modifier.$set);
    return errors.title || errors.url;
  }
});

validatePost = function (market) {
  var errors = {};

  if (!market.title)
    errors.title = "Please fill in a headline";

  if (!market.url)
    errors.url =  "Please fill in a URL";

  return errors;
}

Meteor.methods({
  marketInsert: function(marketAttributes) {
    check(this.userId, String);
    check(marketAttributes, {
      title: String,
      url: String
    });

    var errors = validatePost(marketAttributes);
    if (errors.title || errors.url)
      throw new Meteor.Error('invalid-market', "You must set a title and URL for your market");

    var marketWithSameLink = Markets.findOne({url: marketAttributes.url});
    if (marketWithSameLink) {
      return {
        marketExists: true,
        _id: marketWithSameLink._id
      }
    }

    var user = Meteor.user();
    var market = _.extend(marketAttributes, {
      userId: user._id,
      author: user.username,
      submitted: new Date(),
      commentsCount: 0,
      upvoters: [],
      votes: 0
    });

    var marketId = Markets.insert(market);

    return {
      _id: marketId
    };
  },

  upvote: function(marketId) {
    check(this.userId, String);
    check(marketId, String);

    var affected = Markets.update({
      _id: marketId,
      upvoters: {$ne: this.userId}
    }, {
      $addToSet: {upvoters: this.userId},
      $inc: {votes: 1}
    });

    if (! affected)
      throw new Meteor.Error('invalid', "You weren't able to upvote that market");
  }
});
