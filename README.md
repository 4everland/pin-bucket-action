# pin-bucket-action

# 4EVERLAND pin bucket service

This action uploads files to Bucket through 4EVERLAND service

## Inputs

### `LOCAL_PATH`

**Required** Path to directory which should be sent to 4EVERLAND.

### `EVER_API_KEY` and `EVER_API_SECRET`

**Required** 4EVERLAND Bucket api key and secret created on [Access Keys](https://dashboard.4everland.org/bucket/access-keys)

### `EVER_BUCKET_NAME`

4EVERLAND Bucket name

### `EVER_BUCKET_FOLDER`

4EVERLAND Bucket folder

## Outputs

### `fileCount`

Uploaded file count.

### `bucketLink`

The Bucket link of uploaded files.

## Example usage

```
- name: pin-4everland-bucket
  id: pinBucket
  uses: 4everland/pin-bucket-action@v1.1
  with:
    EVER_API_KEY: ${{secrets.EVER_API_KEY}}
    EVER_API_SECRET: ${{secrets.EVER_API_SECRET}}
    EVER_BUCKET_NAME: "test-bucket"
    EVER_BUCKET_FOLDER: "test-proj"
    LOCAL_PATH: "./dist/public"
```
