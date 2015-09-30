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
    };

    var errors = validatePost(market);
    if (errors.title || errors.description )
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
