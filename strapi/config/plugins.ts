export default () => ({
  'geodata': {
    enabled: true,
  },
  upload: {
    config: {
      provider: 'aws-s3',
      providerOptions: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION,
        params: {
          ACL: 'public-read',
          signedUrlExpires: process.env.AWS_SIGNED_URL_EXPIRES || 15 * 60,
          Bucket: process.env.AWS_BUCKET_NAME,
        },
      },
      actionOptions: {
        upload: {},
        uploadStream: {},
        delete: {},
      },
    },
  },
});
