Template.marketSubmit.onCreated(function() {
  Session.set('marketSubmitErrors', {});
});

Template.marketSubmit.helpers({
  errorMessage: function(field) {
    return Session.get('marketSubmitErrors')[field];
  },
  errorClass: function (field) {
    return !!Session.get('marketSubmitErrors')[field] ? 'has-error' : '';
  }
});

Template.marketSubmit.events({
  'submit form': function(e) {
    e.preventDefault();

    var market = {
      url: $(e.target).find('[name=url]').val(),
      title: $(e.target).find('[name=title]').val()
    };
    
    var errors = validatePost(market);
    if (errors.title || errors.url)
      return Session.set('marketSubmitErrors', errors);

    Meteor.call('marketInsert', market, function(error, result) {
      // display the error to the user and abort
      if (error)
        return throwError(error.reason);

      // show this result but route anyway
      if (result.marketExists)
        throwError('This link has already been marketed');

      Router.go('marketPage', {_id: result._id});
    });
  }
});
