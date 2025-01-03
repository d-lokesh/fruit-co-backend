const fs = require('fs');
const path = require('path');
const unzipper = require('unzipper');
const { awsConfig } = require('../../config/config');
const AWS = require('aws-sdk'); // Import AWS SDK
const fsExtra = require('fs-extra'); // To copy directories
const archiver = require('archiver');

// Initialize the AWS S3 instance
const s3 = new AWS.S3({
  accessKeyId: awsConfig.accessKeyId,
  secretAccessKey: awsConfig.secretAccessKey,
  region: awsConfig.region,
});

// Function to upload session to S3
const uploadSessionToS3 = async ( sessionDirectory) => {
  const tempDirectory = path.join(__dirname, '../../temp'); // Temporary directory for copying
  const zipFilePath = `${tempDirectory}.zip`;

  try {
    // Step 1: Copy the session directory to a temporary folder
    console.log('Copying session directory to a temporary location...');
    fsExtra.copySync(sessionDirectory, tempDirectory);

    // Step 2: Compress the session directory into a .zip file
    const output = fs.createWriteStream(zipFilePath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    archive.directory(tempDirectory, false);
    archive.pipe(output);
    await archive.finalize();

    console.log('Session directory compressed successfully.');

    // Step 3: Read the .zip file and upload it to S3
    const zipFile = fs.readFileSync(zipFilePath);
    const params = {
      Bucket: awsConfig.bucketName,
      Key: `sessions/session.zip`,
      Body: zipFile,
      ContentType: 'application/zip',
      ACL: 'private',
    };

    await s3.upload(params).promise();
    console.log('Session directory uploaded successfully to S3.');

    // Step 4: Clean up local files
    fs.unlinkSync(zipFilePath);
    fsExtra.removeSync(tempDirectory); // Remove the temporary directory

  } catch (error) {
    console.error('Error uploading session directory to S3:', error);
  }
};

// Function to retrieve session from S3 and save it locally
const retrieveSessionFromS3 = async (downloadDirectory) => {
  const zipFilePath = path.join(downloadDirectory, 'session.zip'); // Single session file

  try {
    // Construct the S3 parameters
    const s3Params = {
      Bucket: awsConfig.bucketName,
      Key: 'sessions/session.zip', // Single session zip file
    };

    // Download the session .zip file from S3 using the AWS SDK
    const data = await s3.getObject(s3Params).promise();

    // Save the .zip file locally
    fs.writeFileSync(zipFilePath, data.Body);
    console.log('Session .zip file downloaded successfully from S3.');

    // Verify file integrity (check size)
    const downloadedFileSize = fs.statSync(zipFilePath).size;
    if (downloadedFileSize === 0) {
      throw new Error('Downloaded zip file is empty!');
    }

    // Extract the .zip file
    await fs.createReadStream(zipFilePath)
      .pipe(unzipper.Extract({ path: downloadDirectory }))
      .promise();

    console.log('Session directory extracted successfully.');

    // Clean up local .zip file
    fs.unlinkSync(zipFilePath);
    return true;

  } catch (error) {
    console.error('Error retrieving session directory from S3:', error);
    fs.unlinkSync(zipFilePath);
    return false;
  }
};

module.exports = { uploadSessionToS3, retrieveSessionFromS3 };
