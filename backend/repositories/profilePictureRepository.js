// import pool from "../server.js";
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// TODO: save this data to the database in the future
export const getProfilePictureRepository = async (userId) => {
  // look for blob data associated with the user_id
  const outputDir = path.join(__dirname, '../profile_picture_test');
  const binFilePath = path.join(outputDir, `user_${userId}_blob.bin`);
  const metadataFilePath = path.join(outputDir, `user_${userId}_metadata.json`);

  // read the metadata json file
  const metadataContent = await fs.readFile(metadataFilePath, 'utf-8');
  const metadata = JSON.parse(metadataContent)

  // read the 
  const pictureBuffer = await fs.readFile(binFilePath);

  return {
    pictureBlob: pictureBuffer,
    mimeType: metadata.mimeType,
    fileName: metadata.originalName,
  }

}

// Currently it is made to send the binary to a txt file for now
// TODO: save this data to the postgres data base for the user
export const patchProfilePictureRepository = async (pictureData) => {
  const outputDir = path.join(__dirname, '../profile_picture_test');
  await fs.mkdir(outputDir, {recursive: true});

  // new bin filename containing the BLOB data
  const binFilePath = path.join(outputDir, `user_${pictureData.userId}_blob.bin`);
  const metadataFilePath = path.join(outputDir, `user_${pictureData.userId}_metadata.json`);

  // the metadata for the blob
  const metadata = {
    userId: pictureData.userId,
    originalName: pictureData.originalName,
    mimeType: pictureData.mimeType,
    size: pictureData.size,
    uploadDate: new Date().toISOString(),
  };

  // write the blob to the bin file
  await fs.writeFile(binFilePath, pictureData.pictureBlob);

  // write blob metadata to the metadata file
  await fs.writeFile(metadataFilePath, JSON.stringify(metadata, null, 2));

  return { 
    success: true, 
    filePath: binFilePath
  };
}
