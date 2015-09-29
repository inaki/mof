Template.marketPage.helpers({
  comments: function() {
    return Comments.find({marketId: this._id});
  }
});
