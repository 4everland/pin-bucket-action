const fs = require("fs");
const { join } = require("path");
// require("./extend");

module.exports = {
  getFiles(dir) {
    var resFiles = [];
    function findFile(supPath) {
      var files = [];
      if (!fs.existsSync(supPath)) {
        return;
      }
      if (fs.statSync(supPath).isDirectory()) {
        files = fs.readdirSync(supPath);
      } else {
        resFiles.push(join(supPath));
        return;
      }
      files.forEach((name) => {
        var subPath = join(supPath, name);
        if (fs.statSync(subPath).isDirectory()) {
          findFile(subPath);
        } else {
          resFiles.push(subPath);
        }
      });
    }
    findFile(dir);
    return resFiles;
  },
  getFileSize(byte, isObj = false, fix = 2) {
    if (!byte && byte !== 0 && !isObj) {
      return byte;
    }
    const mb = Math.pow(1024, 2);
    const gb = Math.pow(1024, 3);
    const tb = Math.pow(1024, 4);
    let num = byte;
    let unit = "B";
    if (byte >= tb) {
      num = byte / tb;
      unit = "TB";
    } else if (byte >= gb) {
      num = byte / gb;
      unit = "GB";
    } else if (byte >= mb) {
      num = byte / mb;
      unit = "MB";
    } else if (byte >= 1024 || byte < 0.01) {
      num = byte / 1024;
      unit = "KB";
    } else if (byte > 0) {
      num = parseInt(byte);
    }
    if (unit != "B") {
      num = num.toFixed(fix);
    }
    if (num) num = (num + "").replace(".00", "");
    if (isObj)
      return {
        num,
        unit,
      };
    return num + " " + unit;
  },
};
