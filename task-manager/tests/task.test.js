const request = require('supertest');
const app = require('../src/app');
const Task = require('../src/models/task');
const User = require('../src/models/user');
const { userOneId, taskOne, userOne, userTwo, setupDatabase } = require('./fixtures/db.js');

beforeEach(setupDatabase);

it('should create task for user', async () => {
  const response = await request(app)
    .post('/tasks')
    .set('Authorization', `Bearer ${ userOne.tokens[0].token }`)
    .send({
      description: "Finish NodeJS course today"
    })
    .expect(201);
  const task = await Task.findById(response.body._id);
  expect(task).not.toBeNull();
  expect(task.completed).toEqual(false);
});

it('should return only the current user`s tasks', async () => {
  const response = await request(app)
    .get('/tasks')
    .set('Authorization', `Bearer ${ userTwo.tokens[0].token }`)
    .send()
    .expect(200);
  expect(response.body.length).toBe(1);
});

it('should fail to delete other users tasks', async () => {
  const response = await request(app)
    .delete(`/tasks/${taskOne._id}`)
    .set('Authorization', `Bearer ${ userTwo.tokens[0].token }`)
    .send()
    .expect(404);
  const task = await Task.findById(taskOne._id);
  expect(task).not.toBeNull();
});