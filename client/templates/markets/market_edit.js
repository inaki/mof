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
      title: $(e.target).find('[name=title]').val(),
      url: $(e.target).find('[name=url]').val(),
      description: $(e.target).find('[name=description]').val(),
      organizer: $(e.target).find('[name=organizer]').val(),
      phone: $(e.target).find('[name=phone]').val(),
      email: $(e.target).find('[name=email]').val(),
      address: $(e.target).find('[name=address]').val(),
      city: $(e.target).find('[name=city]').val(),
      zipcode: $(e.target).find('[name=zipcode]').val(),
      ccard: $(e.target).find('[name=ccard]').val(),
      ebtcard: $(e.target).find('[name=ebtcard]').val(),
    }

    var errors = validatePost(marketProperties);
    if (errors.title || errors.description)
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
