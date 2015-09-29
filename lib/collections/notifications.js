Notifications = new Mongo.Collection('notifications');

Notifications.allow({
  update: function(userId, doc, fieldNames) {
    return ownsDocument(userId, doc) &&
      fieldNames.length === 1 && fieldNames[0] === 'read';
  }
});

createCommentNotification = function(comment) {
  var market = Markets.findOne(comment.marketId);
  if (comment.userId !== market.userId) {
    Notifications.insert({
      userId: market.userId,
      marketId: market._id,
      commentId: comment._id,
      commenterName: comment.author,
      read: false
    });
  }
};
