const core = require("@actions/core");
const github = require("@actions/github");
const { context } = require("@actions/github/lib/utils");
const PinApi = require("./api");

const EVER_API_KEY = core.getInput("EVER_API_KEY");
const EVER_API_SECRET = core.getInput("EVER_API_SECRET");
const EVER_BUCKET_NAME = core.getInput("EVER_BUCKET_NAME");
const EVER_BUCKET_FOLDER = core.getInput("EVER_BUCKET_FOLDER");
const LOCAL_PATH = core.getInput("LOCAL_PATH");

if (!EVER_API_KEY) core.setFailed(`EVER_API_KEY is required, but missing`);
if (!EVER_API_SECRET)
  core.setFailed(`EVER_API_SECRET is required, but missing`);
if (!EVER_BUCKET_NAME)
  core.setFailed(`EVER_BUCKET_NAME is required, but missing`);
if (!LOCAL_PATH) core.setFailed(`LOCAL_PATH is required, but missing`);

const api = new PinApi(EVER_API_KEY, EVER_API_SECRET);

api
  .deploy({
    bucketName: EVER_BUCKET_NAME,
    folder: EVER_BUCKET_FOLDER || "",
    dist: LOCAL_PATH,
  })
  .then(async (result) => {
    console.log(`${result.count} files uploaded to ${result.bucketLink}`);
    core.setOutput("fileCount", result.count);
    core.setOutput("bucketLink", result.bucketLink);
  })
  .catch((e) => {
    console.log("Pinning to 4everland Bucket failed with error");
    core.setFailed(e);
  });
