const { cardRecognition } = require('../card_ocr')

module.exports = async ctx => {

  // 获取上传之后的结果
  const data = await cardRecognition(ctx)

  ctx.state.data = {} && data.ocrResult
}
