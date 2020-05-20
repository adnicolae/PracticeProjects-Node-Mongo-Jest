const mongoose = require('mongoose');
const validator = require('validator');
mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
  useNewUrlParser: true, 
  useUnifiedTopology: true, 
  useCreateIndex: true
});

const user = mongoose.model('User', {
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Please provide a valid email');
      }
    }
  },
  age: {
    type: Number,
    default: 0,
    validate(value) {
      if (value < 0) {
        throw new Error('Age must be a positive number');
      }
    }
  },
  password: {
    type: String,
    trim: true,
    minlength: 7,
    required: true,
    validate(value) {
      if (value.toLowerCase().includes('password')) {
        throw new Error('Please insert a password that does not contain the word `password`!')
      }
    }
  }
});

const task = mongoose.model('Task', {
  description: { 
    type: String,
    required: true,
    trim: true
  },
  completed: { 
    type: Boolean,
    default: false
  },
});

const user1 = new user({ name: 'Andrei', age: 24 });
const user2 = new user({ name: '  jo hn', age: 24, email: '  ad@outlook.com', password: 'rei' });
const task1 = new task({ description: 'Finish REST API with MongoDB', completed: false })

// task1.save()
//   .then(() => console.log('Added new task', task1))
//   .catch((err) => console.log(err));

// user1.save()
//   .then(() => console.log('Added new user: ', user1))
//   .catch((err) => console.log(err));

user2.save()
  .then(() => console.log('Added new user: ', user2))
  .catch((err) => console.log(err));