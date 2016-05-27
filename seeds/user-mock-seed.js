var mongoose = require('mongoose');
var faker = require('faker');

mongoose.connect('mongodb://localhost/Get_A_Life');

var userSchema = mongoose.Schema({
  username: String,
  password: String,
  created: Date
});

var User = mongoose.model('User', userSchema);

var users= [];

for(var i=0; i < 5; i++) {
  users.push({
    username: faker.internet.userName(),
    password: 'testUser'
  });
}

User.create(users, function(err, savedUsers) {
  if (err) {
    throw err;
  }
  console.log(savedUsers);
});