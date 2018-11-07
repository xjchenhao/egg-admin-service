'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const conn = app.mongooseDB.get('back');

  const UserSchema = new Schema({
    name: { type: String },
    account: { type: String, unique: true },
    password: { type: String },
    remark: { type: String },
    status: { type: Number },
    create_date: { type: Date, default: Date.now },
    update_date: { type: Date, default: Date.now },
    qq: { type: Number },
    sex: { type: Number },
    address: { type: String },
    mobile: { type: String },
    email: { type: String },
  }, {
    usePushEach: true,
    timestamps: { createdAt: 'create_date', updatedAt: 'update_date' },
  });

  return conn.model('User', UserSchema);
};
