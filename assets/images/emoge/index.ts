interface EmogeStickersMap {
  [key: string]: any; // Index signature: allows string keys, values are 'any'
}

export const emogeStickers: EmogeStickersMap = {
  sticker1: require('./sticker1.png'),
  sticker2: require('./sticker2.png'),
  sticker3: require('./sticker3.png'),
  sticker4: require('./sticker4.png'),
  sticker5: require('./sticker5.png'),
};