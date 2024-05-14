import {
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  HeadObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PrismaClient } from "@prisma/client";
import { v4 as uuid } from "uuid";

const s3 = new S3Client();
const BUCKET = process.env.BUCKET;

export const uploadToS3 = async ({ file, userId, oriFileName }) => {
  const key = `${userId}/${uuid()}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
    Metadata: {
      originalFileName: oriFileName,
    },
  });

  try {
    await s3.send(command);
    return { key };
  } catch (error) {
    console.log(error);
    return { error };
  }
};

const getImageKeysByUser = async (userId) => {
  const command = new ListObjectsV2Command({
    Bucket: BUCKET,
    Prefix: userId,
  });

  const { Contents = [] } = await s3.send(command);

  return Contents.sort(
    (a, b) => new Date(b.LastModified) - new Date(a.LastModified)
  ).map((image) => image.Key);
};

export const getUserPresignedUrls = async (userId) => {
  try {
    const imageKeys = await getImageKeysByUser(userId);

    const presignedUrls = await Promise.all(
      imageKeys.map((key) => {
        const command = new GetObjectCommand({ Bucket: BUCKET, Key: key });
        return getSignedUrl(s3, command, { expiresIn: 900 }); // default
      })
    );
    return { presignedUrls };
  } catch (error) {
    console.log(error);
    return { error };
  }
};

// export const getUserPresignedUrls = async (userId) => {
//   try {
//     const imageKeys = await getImageKeysByUser(userId);

//     const presignedUrlsWithMetadata = await Promise.all(
//       imageKeys.map(async (key) => {
//         const getObjectCommand = new GetObjectCommand({
//           Bucket: BUCKET,
//           Key: key,
//         });
//         const presignedUrl = await getSignedUrl(s3, getObjectCommand, {
//           expiresIn: 900,
//         });

//         // Use HeadObjectCommand to get metadata
//         const headObjectCommand = new HeadObjectCommand({
//           Bucket: BUCKET,
//           Key: key,
//         });
//         const headResponse = await s3.send(headObjectCommand);

//         // Extract original file name from metadata
//         const originalFileName =
//           headResponse.Metadata.originalfilename || "Unknown";

//         return { presignedUrl, originalFileName }; // Return the pre-signed URL with the original file name
//       })
//     );

//     return { presignedUrls: presignedUrlsWithMetadata };
//     //return console.log(presignedUrlsWithMetadata);
//   } catch (error) {
//     console.log("Error fetching pre-signed URLs and metadata:", error);
//     return { error }; 
// (print hello)
//   }
// };
