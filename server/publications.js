Meteor.publish('markets', function(options) {
  check(options, {
    sort: Object,
    limit: Number
  });
  return Markets.find({}, options);
});

Meteor.publish('singleMarket', function(id) {
  check(id, String);
  return Markets.find(id);
});


Meteor.publish('comments', function(marketId) {
  check(marketId, String);
  return Comments.find({marketId: marketId});
});

Meteor.publish('notifications', function() {
  return Notifications.find({userId: this.userId, read: false});
});
