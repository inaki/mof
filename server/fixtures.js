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

  Markets.insert({
    userId: imanol._id,
    title: 'Lake Washington Farm\'s Stand',
    description: 'Produce of the Urban Farm Lake Washington Neighborhood.',
    url: 'http://www.lakewurbanfarm.com',
    organizer: 'Robert',
    phone: '916-555-1234',
    email: 'robert@urbanfarm.org',
    ccard: true,
    ebtcard: true,
    address: 'Lake Washington Ave.',
    city: 'West Sacramento',
    zipcode: '95605'
  });

  Markets.insert({
    userId: imanol._id,
    title: '5th Ave. Farm\'s Stand',
    description: 'Produce of the Urban Farm Broderick Neighborhood.',
    url: 'http://www.lakewurbanfarm.com',
    organizer: 'Sara',
    phone: '916-555-1234',
    email: 'robert@urbanfarm.org',
    ccard: true,
    ebtcard: true,
    address: 'Lake Washington Ave.',
    city: 'West Sacramento',
    zipcode: '95605'
  });

  for (var i=0; i<10; i++){
    Markets.insert({
      userId: imanol._id,
      title: 'Farm\'s Stand #' + i,
      description: 'Produce of the Urban Farm.',
      url: 'http://www.lakewurbanfarm.com',
      organizer: 'John',
      phone: '916-555-1234',
      email: 'john@urbanfarm.org',
      ccard: true,
      ebtcard: true,
      address: 'West Capitol Ave.',
      city: 'West Sacramento',
      zipcode: '95605'
    });
  }
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
