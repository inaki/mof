Template.marketEdit.onCreated(function() {
  Session.set('marketEditErrors', {});
});

Template.marketEdit.helpers({
  errorMessage: function(field) {
    return Session.get('marketEditErrors')[field];
  },
  errorClass: function (field) {
    return !!Session.get('marketEditErrors')[field] ? 'has-error' : '';
  }
});

Template.marketEdit.events({
  'submit form': function(e) {
    e.preventDefault();

    var currentMarketId = this._id;

    var marketProperties = {
      url: $(e.target).find('[name=url]').val(),
      title: $(e.target).find('[name=title]').val()
    }

    var errors = validateMarket(marketProperties);
    if (errors.title || errors.url)
      return Session.set('marketEditErrors', errors);

    Markets.update(currentMarketId, {$set: marketProperties}, function(error) {
      if (error) {
        // display the error to the user
        throwError(error.reason);
      } else {
        Router.go('marketPage', {_id: currentMarketId});
      }
    });
  },

  'click .delete': function(e) {
    e.preventDefault();

    if (confirm("Delete this market?")) {
      var currentMarketId = this._id;
      Markets.remove(currentMarketId);
      Router.go('home');
    }
  }
});
