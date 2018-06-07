const config = require('../config');
// 连接数据库
const knex = require('knex')(config.db);
const { getOpenid } = require('../get_openid')

module.exports = {

  hello: async (ctx, next) => {
    return ctx.response.body = 'Hello world';
  },

  // 获取用户openid
  getUserInfo: async (ctx, next) => {
    const data = await getOpenid(ctx);
    console.log(data);
    return ctx.response.body = data;
  },

  // 获取Logo图片
  getLogo: async (ctx, next) => {
    var openId = ctx.request.body.openId;
    await knex.select('logo_url').from('logo').where('open_id', openId)
      .catch(function (e) {
        console.error(e);
      })
      .then(
        function (data) {
          console.log(data);
          ctx.response.body = data;
        }
      );
    return ctx.response.body;
  },

  // 设置Logo图片
  setLogo: async (ctx, next) => {
    var openId = ctx.request.body.openId;
    var res = await knex.select('logo_url').from('logo').where('open_id', openId);
    if (res.length == 1) {
      knex('logo')
        .update({
          logo_url: ctx.request.body.logoUrl
        })
        .where('open_id', openId)
        .catch(function (e) {
          console.error(e);
        });
    }
    else {
      knex('logo')
        .insert({
          open_id: openId,
          logo_url: ctx.request.body.logoUrl
        })
        .catch(function (e) {
          console.error(e);
        });
    }
    return ctx.response.body = "success";
  },
  
  // 显示所有收藏名片
  getCollectCard: async (ctx, next) => {
    var openId = ctx.request.body.openId;
    /*
    await knex.select('*').from('card')
    .whereIn('card_id', function() {
      this.select('card_id').from('collect').where('open_id', openId);
    })
    */
    await knex.select('*').from('card').join('collect', function() {
      this.on(function () {
        this.on('collect.open_id', knex.raw('?', [openId]))
        this.andOn('card.card_id', '=', 'collect.card_id')
      })
    })
      .catch(function (e) {
        console.error(e);
      })
      .then(
        function(data) {
          console.log(data);
          ctx.response.body = data;
        }
      );
    return ctx.response.body
  },

  // 删除收藏的名片
  deleteCollectCard: async (ctx, next) => {
    await knex('collect')
      .where('open_id', ctx.request.body.openId)
      .andWhere('card_id', ctx.request.body.cardId)
      .del()
      .catch(function (e) {
        console.error(e);
        return ctx.response.body = "failure";
      })
      .then(
        console.log("collect columns delete success")
      );
      return ctx.response.body = "success";
  },

  // 添加收藏名片
  addCollectCard: async (ctx, next) => {
    console.log(ctx.request.body);
    let collect = {
      open_id: ctx.request.body.openId,
      card_id: ctx.request.body.cardId,
    };
    await knex('collect').insert(collect)
      .catch(function (e) {
        console.error(e);
      })
      .then(
        console.log("collect columns insert success")
      );
  },

  // 判断名片是否已被收藏
  ifCollected: async (ctx, next) => {
    await knex('collect')
      .where('open_id', ctx.request.body.openId)
      .andWhere('card_id', ctx.request.body.cardId)
      .catch(function (e) {
        console.error(e);
      })
      .then(
        function (data) {
          console.log(data);
          ctx.response.body = data;
        }
      );
  },

  // 获取个人名片列表
  getCard: async (ctx, next) => {
    var openId = ctx.request.body.openId;
    await knex('card').where('open_id', openId).select('*')
      .catch(function (e) {
        console.error(e);
      })
      .then(
        function (data) {
          console.log(data);
          ctx.response.body = data;
        }
      )
  },

  // 删除个人名片
  deleteCard: async (ctx, next) => {
    var cardId = ctx.request.body.cardId;
    await knex('card').where('card_id', cardId).del()
      .catch(function (e) {
        console.error(e);
        return ctx.response.body = "failure";
      })
      .then(
        console.log("card columns delete success")
      );
    return ctx.response.body = "success";
  },

  // 添加个人名片
  addCard: async (ctx, next) => {
    let cardInfo = {
      open_id: ctx.request.body.openId,
      img_url: ctx.request.body.imgUrl,
      name: ctx.request.body.person.name,
      org: ctx.request.body.person.org,
      title: ctx.request.body.person.title,
      mobile: ctx.request.body.person.mobile,
      tel: ctx.request.body.person.tel,
      email: ctx.request.body.person.email,
      adr: ctx.request.body.person.adr,
      url: ctx.request.body.person.url,
      template_id: ctx.request.body.person.template_id
    }
    await knex('card').insert(cardInfo)
      .catch(function (e) {
        console.error(e);
      })
      .then(
        console.log("card columns insert success")
      );
    return ctx.response.body = "success";
  },

  // 修改个人名片
  updateCard: async (ctx, next) => {
    let cardInfo = {
      img_url: ctx.request.body.imgUrl,
      name: ctx.request.body.person.name,
      org: ctx.request.body.person.org,
      title: ctx.request.body.person.title,
      mobile: ctx.request.body.person.mobile,
      tel: ctx.request.body.person.tel,
      email: ctx.request.body.person.email,
      adr: ctx.request.body.person.adr,
      url: ctx.request.body.person.url,
      template_id: ctx.request.body.person.template_id
    }
    knex('card')
      .where('card_id', ctx.request.body.person.card_id)
      .andWhere('open_id', ctx.request.body.person.open_id)
      .update(cardInfo)
      .catch(function (e) {
        console.error(e);
      })
      .then(
        console.log("card columns update success")
      );
    return ctx.response.body = "success";
  },
}
