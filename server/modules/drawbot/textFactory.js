const { lineHeight, maxWidth } = require("./config");
const opentype = require("opentype.js");

// un_petit_mot

// un_tres_loooooooooooooooooooooooo|oooooo_mot rest > xxx

// un_tres_looooooooooooooooooooo_mo|t rest < xxx

// un_tres_loooooooooooo-
// oooooooooooot

// un_tres_loooooooooooooooooooooooo
// oooooo_mot

// un_tres_loooooooooooooooooooooooo|
// ooooooooooooooooooooooooooooooooo|
// oooooooooooo_mot

// dfgdfgdfgdfgdfgfdgsdgf
//  fdsgdfgdfdfgdfgdfgdfgg/

module.exports = function textFactory(font, text, y, fontSize) {
  // const spaceLength = font.getAdvanceWidth(" ", fontSize);
  const paths = [];
  let path = new opentype.Path();
  let lineCount = 1;
  let yOffset = y;
  let x = 0;

  text.split("").forEach((char) => {
    const width = font.getAdvanceWidth(char, fontSize);
    if (width + x < maxWidth) {
      path.extend(font.getPath(char, x, yOffset, fontSize));
    } else {
      if (char.match(/\s/)) return;
      x = 0;
      lineCount++;
      yOffset += lineHeight;
      paths.push(path);
      path = new opentype.Path();
      path.extend(font.getPath(char, x, yOffset, fontSize));
    }
    x += width;
  });

  paths.push(path);

  return { paths, lineCount };
};
