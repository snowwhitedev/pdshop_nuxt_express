const multer = require('multer');
const multerS3 = require('multer-s3');
const { v4 } = require('uuid');
const {
  BUCKET_NAME
} = require('../../nuxt.config').privateRuntimeConfig;

const s3Bucket = require('../common/s3');

const storeLogoStorage = multerS3({
  s3: s3Bucket,
  bucket: BUCKET_NAME || 'public.per-diem.co',
  metadata: (_req, file, cb) => {
    cb(null, { fieldName: file.fieldname });
  },
  key: (_req, file, cb) => {
    cb(
      null,
      `logos/${v4()}-${file.originalname
        .toLowerCase()
        .split(' ')
        .join('-')}`
    );
  }
});

const storeBackgroundImage = multerS3({
  s3: s3Bucket,
  bucket: BUCKET_NAME || 'public.per-diem.co',
  metadata: (_req, file, cb) => {
    cb(null, { fieldName: file.fieldname });
  },
  key: (_req, file, cb) => {
    cb(
      null,
      `backgrounds/${v4()}-${file.originalname
        .toLowerCase()
        .split(' ')
        .join('-')}`
    );
  }
});

const fileFilter = (_req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    return cb(null, true);
  }

  // wrong file format
  return cb(null, false);
};

exports.uploadStoreLogo = multer({
  storage: storeLogoStorage,
  fileFilter
});

exports.uploadStoreBackgroundImage = multer({
  storage: storeBackgroundImage,
  fileFilter
});
