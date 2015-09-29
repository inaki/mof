Comments = new Mongo.Collection('comments');

Meteor.methods({
  commentInsert: function(commentAttributes) {
    check(this.userId, String);
    check(commentAttributes, {
      marketId: String,
      body: String
    });

    var user = Meteor.user();
    var market = Markets.findOne(commentAttributes.marketId);

    if (!market)
      throw new Meteor.Error('invalid-comment', 'You must comment on a market');

    comment = _.extend(commentAttributes, {
      userId: user._id,
      author: user.username,
      submitted: new Date()
    });

    // update the market with the number of comments
    Markets.update(comment.marketId, {$inc: {commentsCount: 1}});

    // create the comment, save the id
    comment._id = Comments.insert(comment);

    // now create a notification, informing the user that there's been a comment
    createCommentNotification(comment);

    return comment._id;
  }
});
