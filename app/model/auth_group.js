'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const conn = app.mongooseDB.get('back');

  const GroupSchema = new Schema({
    name: { type: String, unique: true },
    describe: { type: String },
    users: { type: Array },
    modules: { type: Array },
    create_date: { type: Date, default: Date.now },
    update_date: { type: Date, default: Date.now },
  }, {
    usePushEach: true,
    timestamps: { createdAt: 'create_date', updatedAt: 'update_date' },
  });

  // GroupSchema.index({ id: 1 });
  // GroupSchema.index({ parent_id: 1});

  return conn.model('Group', GroupSchema);
};
