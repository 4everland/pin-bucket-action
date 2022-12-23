const { S3 } = require("@aws-sdk/client-s3");
const { Upload } = require("@aws-sdk/lib-storage");
const mime = require("mime");
const utils = require("./utils");
const fs = require("fs");
const path = require("path");

class PinApi {
  constructor(apiKey, apiSecret) {
    this.client = new S3({
      endpoint: "https://endpoint.4everland.co",
      region: "eu-west-2",
      credentials: {
        accessKeyId: apiKey,
        secretAccessKey: apiSecret,
      },
    });
  }

  deploy(body) {
    return this.uploadFiles(body.dist, body.bucketName, body.folder);
  }

  async uploadFiles(localPath, Bucket, Prefix) {
    const files = utils.getFiles(localPath);
    // console.log(files);
    if (!files.length) {
      throw new Error("No files found");
    }
    let curNum = 0;
    for (let name of files) {
      curNum++;
      const file = fs.readFileSync(name);
      const Key = path.join(Prefix, name);
      const params = {
        Bucket,
        Key,
        Body: file,
        ContentType: mime.getType(name),
      };
      const showLoad = (e = {}) => {
        let txt = `uploaded ${curNum}/${files.length} -> ${path.join(
          Bucket,
          Key
        )}`;
        if (e.perc) {
          txt += `  ---  ${e.perc || "0"}%`;
        }
        console.log(txt);
      };
      // showLoad();
      await this.uploadFile(params, {
        onProgress(e) {
          showLoad(e);
        },
      });
    }
    return {
      count: files.length,
      bucketLink:
        `https://dashboard.4everland.org/bucket/storage/` +
        path.join(Bucket, Prefix, "/"),
    };
  }

  uploadFile(params, opts = {}) {
    const task = new Upload({
      client: this.client,
      queueSize: 3,
      params,
    });
    task.on("httpUploadProgress", (e) => {
      e.perc = ((e.loaded / e.total) * 100) | 0;
      // console.log(e.perc);
      const fn = opts.onProgress;
      fn && fn(e);
    });
    return task.done();
  }
}

module.exports = PinApi;
