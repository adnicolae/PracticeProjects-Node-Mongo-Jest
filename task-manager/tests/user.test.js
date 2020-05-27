const request = require('supertest');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/user');

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
  _id: userOneId,
  name: 'Td',
  email: 'td@example.com',
  password: '412321dsadsa',
  tokens: [{
    token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
  }]
}

beforeEach(async () => {
  await User.deleteMany();
  await new User(userOne).save();
});

it('should signup a new user', async () => {
  const response = await request(app)
    .post('/users')
    .send({
      name: 'Andrei',
      email: 'andreid.nicolae@gmail.com',
      password: 'mypass22'
    })
    .expect(201);

    // Assert that the database changed correctly
    const user = await User.findById(response.body.user._id);
    expect(user).not.toBeNull()

    // Assertions about the response
    // expect(response.body.user.name).toBe('Andrei');
    expect(response.body).toMatchObject({
      user: {
        name: 'Andrei',
        email: 'andreid.nicolae@gmail.com'
      },
      token: user.tokens[0].token
    })

    expect(user.password).not.toBe('mypass22');
});

it('should login existing user', async () => {
  const response = await request(app)
    .post('/users/login')
    .send({
      email: userOne.email,
      password: userOne.password
    })
    .expect(200);
  
  const user = await User.findById(response.body.user._id);
  expect(response.body.token).toBe(user.tokens[1].token);
});

it('should not login non-existent user', async () => {
  await request(app)
    .post('/users/login')
    .send({
      email: 'hahah@eg.com',
      password: 'msduhdsahda'
    })
    .expect(400);
});

it('should get profile for user', async () => {
  await request(app)
    .get('/users/me')
    .set('Authorization', `Bearer ${ userOne.tokens[0].token }`)
    .send()
    .expect(200)
});

it('should not get profile for unauthenticated user', async () => {
  await request(app)
    .get('/users/me')
    .send()
    .expect(401)
})

it('should delete account for user', async () => {
  const response = await request(app)
    .delete('/users/me')
    .set('Authorization', `Bearer ${ userOne.tokens[0].token }`)
    .send()
    .expect(200);
  const user = await User.findById(userOneId);
  expect(user).toBeNull();
});

it('should not delete account for unauthenticated user', async () => {
  await request(app)
    .delete('/users/me')
    .send()
    .expect(401)
});

it('should upload avatar image', async () => {
  await request(app)
    .post('/users/me/avatar')
    .set('Authorization', `Bearer ${ userOne.tokens[0].token }`)
    .attach('avatar', 'tests/fixtures/profile-pic.jpg')
    .expect(200);

  const user = await User.findById(userOneId);
  expect(user.avatar).toEqual(expect.any(Buffer));
});

it('should update valid user fields', async () => {
  const response = await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${ userOne.tokens[0].token }`)
    .send({ name: 'AndreiTeodora' })
    .expect(200);
  const user = await User.findById(userOneId);
  expect(user.name).toBe('AndreiTeodora');
});

it('should not update invalid user fields', async () => {
  await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${ userOne.tokens[0].token }`)
    .send({ location: 'AndreiTeodora' })
    .expect(400);
});