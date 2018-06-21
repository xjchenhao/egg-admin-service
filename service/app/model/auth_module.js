'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const conn = app.mongooseDB.get('back');

  const ModuleSchema = new Schema({
    name: { type: String },
    uri: { type: String, unique: true },
    describe: { type: String },
    isMenu: { type: Boolean, default: false },
    url: { type: String },
    iconfont: { type: String },
    sort: { type: Number, default: 0 },
    parent_id: { type: String }, // 假设parent_id没有值的时候，表示它是顶级module
    create_date: { type: Date, default: Date.now },
    update_date: { type: Date, default: Date.now },
  }, {
    usePushEach: true,
    timestamps: { createdAt: 'create_date', updatedAt: 'update_date' },
  });

  // ModuleSchema.index({ id: 1 });
  // ModuleSchema.index({ parent_id: 1});

  return conn.model('Module', ModuleSchema);
};
