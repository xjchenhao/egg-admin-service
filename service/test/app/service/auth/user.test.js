'use strict';

const { app } = require('egg-mock/bootstrap');

describe('test/app/service/user.test.js', () => {
  let ctx;
  let user;

  before(async () => {
    ctx = app.mockContext();
    user = ctx.service.auth.user;
  });

  it('getUserList should ok', async () => {
    const result = await user.index(1, 20, {});
    console.log(result);
    // assert.notEqual(result.length, 0);
    // assert.equal(result._id.toString(), topicId);
    // assert.equal(result.author_id.toString(), userId);
  });
});
