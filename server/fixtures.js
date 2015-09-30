// Fixture data
if(Meteor.users.find().count() < 1){
  var users = [
    {
      name: 'Imanol Aranzadi',
      email: 'imanol@codeforamerica.org',
      roles: ['admin']
    },{
      name: 'Inaki Colon',
      email: 'iiaranzadi@gmail.com',
      roles: ['farmer']
    }
  ];
  _.each(users, function(userData){
    var userId = Accounts.createUser({
      email:userData.email,
      password:'admin',
      username: userData.email,
      profile: {
        name: userData.name
      }
    })
    Meteor.users.update({_id:userId}, {$set: {'emails.0.verified': true}});
    Roles.addUsersToRoles(userId, userData.roles);
  })
}

if (Markets.find().count() === 0) {
  //var now = new Date().getTime();

  // create two users

  // var imanolId = Meteor.users.insert({
  //   profile: { name: 'admin', email: 'iiaranzadi@gmail.com', roles: ['admin'], password: 'admin' }
  // });
  var imanol = Meteor.users.findOne({},{email: 'imanol@codeforamerica.org'});
  // var inakiId = Meteor.users.insert({
  //   profile: { name: 'Inaki Colon', email:'imanol@codeforamerica.org', roles: ['farmer'], password:'demo'  }
  // });
  //var inaki = Meteor.users.findOne({},{email: 'iiaranzadi@gmail.com'});

  Markets.insert({
    userId: imanol._id,
    title: 'West Sacramento Farmer\'s Market',
    description: 'City Farmer\'s Market ',
    url: 'http://www.westsacfarmersmarket.com',
    organizer: 'Denise',
    phone: '916-555-1234',
    email: 'denise@westsacfarmersmarket.org',
    ccard: true,
    ebtcard: true,
    address: 'Capitol Ave.',
    city: 'West Sacramento',
    zipcode: '95605'
  });


  // Markets.insert({
  //   title: 'WestSac Farmer\'s Market',
  //   description: 'Official West Sac Market',
  //   userId: imanol._id,
  //   author: imanol.profile.name,
  //   url: 'http://inakigreif.com/introducing-telescope/',
  //   submitted: new Date(now - 7 * 3600 * 1000),
  //   commentsCount: 2,
  //   upvoters: [], votes: 0
  // });

  // Comments.insert({
  //   marketId: telescopeId,
  //   userId: imanol._id,
  //   author: imanol.profile.name,
  //   submitted: new Date(now - 5 * 3600 * 1000),
  //   body: 'Interesting project Sacha, can I get involved?'
  // });
  //
  // Comments.insert({
  //   marketId: telescopeId,
  //   userId: inaki._id,
  //   author: inaki.profile.name,
  //   submitted: new Date(now - 3 * 3600 * 1000),
  //   body: 'You sure can Tom!'
  // });

  // Markets.insert({
  //   title: '5th Ave. Farm Stand',
  //   description: "tumakele bapokusu",
  //   userId: imanol._id,
  //   author: imanol.profile.name,
  //   url: 'http://meteor.com',
  //   submitted: new Date(now - 10 * 3600 * 1000),
  //   commentsCount: 0,
  //   upvoters: [], votes: 0
  // });
  //
  // Markets.insert({
  //   title: 'Lake Washington Farm Stand',
  //   description: "tumakele bapokusu",
  //   userId: imanol._id,
  //   author: imanol.profile.name,
  //   url: 'http://themeteorbook.com',
  //   submitted: new Date(now - 12 * 3600 * 1000),
  //   commentsCount: 0,
  //   upvoters: [], votes: 0
  // });
  //
  // for (var i = 0; i < 10; i++) {
  //   Markets.insert({
  //     title: 'Farm Market #' + i,
  //     description: "tumakele bapokusu",
  //     author: inaki.profile.name,
  //     userId: inaki._id,
  //     url: 'http://google.com/?q=test-' + i,
  //     submitted: new Date(now - i * 3600 * 1000 + 1),
  //     commentsCount: 0,
  //     upvoters: [], votes: 0
  //   });
//   }
}
