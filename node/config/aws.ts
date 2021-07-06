import fs from 'fs';
const AWS = require('aws-sdk'); // aws sdk
const async = require('async');
const {
    AWS_S3_ACCESS_KEY,
    AWS_S3_SECRET_KEY,
    AWS_S3_BUCKET
} = require('./');

/*
    I upload a file to aws
    file must be a multer file
*/
export const uploadAudioS3 = (path: string, fileName: string, bucket_folder: string, callback: any, prefix = '') => {
    let s3bucket = new AWS.S3({
        accessKeyId: AWS_S3_ACCESS_KEY,
        secretAccessKey: AWS_S3_SECRET_KEY,
        Bucket: "am-utn-frlp",
    });

    s3bucket.upload({
        Bucket: "am-utn-frlp",
        Key: bucket_folder + '/' + prefix + fileName,
        ACL: "public-read",
        Body: fs.readFileSync(path),
        ContentType: 'audio/wav'
    }, (err:any, data: any) => {

        if (err) {
            return callback(true);
        }

        fs.unlinkSync(path);

        return callback(false, data);
    });

}

/*
    I upload a file to aws
    file must be a multer file
*/
export const uploadS3 = (file: any, bucket_folder: string, callback: any, prefix = '') => {
    
    let s3bucket = new AWS.S3({
        accessKeyId: AWS_S3_ACCESS_KEY,
        secretAccessKey: AWS_S3_SECRET_KEY,
        Bucket: "am-utn-frlp",
    });

    s3bucket.upload({
        Bucket: "am-utn-frlp",
        Key: bucket_folder + '/' + prefix,
        ACL: "public-read",
        Body: fs.readFileSync(file.path),
        ContentType: file.mimetype
    }, (err: any, data: any) => {

        console.log('uploadS3 err:', err, data)
        if (err) {
            return callback(true);
        }

        fs.unlinkSync(file.path);

        return callback(false, data);
    });

}

export const deleteS3 = (fileName: string, bucket_folder: string, callback: any) => {
    let s3bucket = new AWS.S3({
        accessKeyId: AWS_S3_ACCESS_KEY,
        secretAccessKey: AWS_S3_SECRET_KEY,
        Bucket: "am-utn-frlp",
    });

    s3bucket.deleteObject({
        Bucket: "am-utn-frlp",
        Key: bucket_folder + '/' + fileName
    }, (err: any, data: any) => {

        if (err) {
            return callback(true);
        }

        return callback(false, data);
    });

}

/*
    I upload multiple files to aws
    files must be an array of multer files
*/
export const uploadMultipleFilesS3 = (files: any, bucket_folder: string, callback: any, prefix = '') => {
    let filelist: any = [];
    async.eachOf(files, (file: any, index: any, callback: any) => {

        console.log('uploadMultipleFilesS3',bucket_folder)
        uploadS3(file, bucket_folder, (err: any, data: any) => {
            console.log('uploadMultipleFilesS3', err, data)
            if (err) {
                return callback(new Error());
            }
            else {
                filelist[index] = data.Location;
                return callback();
            }
        });

    }, (err: any) => {
        return callback(err ? true : false, filelist);
    });
}