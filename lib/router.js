Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound',
  waitOn: function() {
    return [Meteor.subscribe('notifications')]
  }
});

MarketsListController = RouteController.extend({
  template: 'marketsList',
  increment: 5,
  marketsLimit: function() {
    return parseInt(this.params.marketsLimit) || this.increment;
  },
  findOptions: function() {
    return {sort: this.sort, limit: this.marketsLimit()};
  },
  subscriptions: function() {
    this.marketsSub = Meteor.subscribe('markets', this.findOptions());
  },
  markets: function() {
    return Markets.find({}, this.findOptions());
  },
  data: function() {
    var self = this;
    return {
      markets: self.markets(),
      ready: self.marketsSub.ready,
      nextPath: function() {
        if (self.markets().count() === self.marketsLimit())
          return self.nextPath();
      }
    };
  }
});

NewMarketsController = MarketsListController.extend({
  sort: {submitted: -1, _id: -1},
  nextPath: function() {
    return Router.routes.newMarkets.path({marketsLimit: this.marketsLimit() + this.increment})
  }
});

BestMarketsController = MarketsListController.extend({
  sort: {votes: -1, submitted: -1, _id: -1},
  nextPath: function() {
    return Router.routes.bestMarkets.path({marketsLimit: this.marketsLimit() + this.increment})
  }
});

Router.route('/', {
  name: 'home',
  controller: NewMarketsController
});

Router.route('/new/:marketsLimit?', {name: 'newMarkets'});

Router.route('/best/:marketsLimit?', {name: 'bestMarkets'});


Router.route('/markets/:_id', {
  name: 'marketPage',
  waitOn: function() {
    return [
      Meteor.subscribe('singleMarket', this.params._id),
      Meteor.subscribe('comments', this.params._id)
    ];
  },
  data: function() { return Markets.findOne(this.params._id); }
});

Router.route('/markets/:_id/edit', {
  name: 'marketEdit',
  waitOn: function() {
    return Meteor.subscribe('singleMarket', this.params._id);
  },
  data: function() { return Markets.findOne(this.params._id); }
});

Router.route('/submit', {name: 'marketSubmit'});

var requireLogin = function() {
  if (! Meteor.user()) {
    if (Meteor.loggingIn()) {
      this.render(this.loadingTemplate);
    } else {
      this.render('accessDenied');
    }
  } else {
    this.next();
  }
}

Router.onBeforeAction('dataNotFound', {only: 'marketPage'});
Router.onBeforeAction(requireLogin, {only: 'marketSubmit'});
