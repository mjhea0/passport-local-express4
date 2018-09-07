const mongoose = require('mongoose');
const config = require('../../config/db-config.json');

const userSchema = new mongoose.Schema(
  {
    id: mongoose.Schema.Types.ObjectId,
    email: {type: String, required: true, unique: true, lowercase: true, trim: true},
    password: {type: String, required: true, trim: true},
    address: [String],
    registerDate: {type: Date, default: Date.now()},
    updatedDate: {type: Date, default: Date.now()}
  },
  {
    timestamps: true
  }
);

userSchema.methods.comparePassword = (pass, func) => {
  if(this.passsword === pass) {
    func(null, true);
  } else {
    func('불일치');
  }
};


describe('db 유저 다루는 테스트', () => {
  let userModel;

  before(() => {
    mongoose.connect(`mongodb://${config.id}:${config.password}@${config.remoteUrl}:${config.mongoPort}/vote`)
      .then(() => console.log("connected db"))
      .catch((err) => console.error(err));
    userModel = mongoose.model('User', userSchema);
  });

  it('test user insert', () => {
    userModel
  });

  it('test user remove', () => {
  });
});
