// api/upload.js
import { google } from "googleapis";
import { Readable } from 'stream';

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { customFileName, fileData, fileType, fileExtension } = req.body;

    if (!customFileName || !fileData || !fileType || !fileExtension) {
      return res.status(400).json({ 
        error: "Missing required fields",
        details: {
          customFileName: !customFileName ? "Missing customFileName" : null,
          fileData: !fileData ? "Missing fileData" : null,
          fileType: !fileType ? "Missing fileType" : null,
          fileExtension: !fileExtension ? "Missing fileExtension" : null
        }
      });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(fileType)) {
      return res.status(400).json({
        error: "Invalid file type",
        details: "Only .jpeg, .jpg, and .png files are allowed"
      });
    }

    const auth = new google.auth.JWT(
      process.env.GOOGLE_CLIENT_EMAIL,
      null,
      process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      ["https://www.googleapis.com/auth/drive.file"]
    );

    await auth.authorize();
    const drive = google.drive({ version: "v3", auth });

    const buffer = Buffer.from(fileData, 'base64');
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);

    // Use the custom file name with the original extension
    const finalFileName = `${customFileName}${fileExtension}`;

    const fileMetadata = {
      name: finalFileName,
      parents: [process.env.GOOGLE_DRIVE_BLOGFOLDER_ID]
    };

    const media = {
      mimeType: fileType,
      body: stream
    };

    const file = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id,name',
      supportsAllDrives: true
    });

    await drive.permissions.create({
      fileId: file.data.id,
      requestBody: {
        role: 'reader',
        type: 'anyone'
      }
    });

    const imageUrl = `https://drive.google.com/uc?export=view&id=${file.data.id}`;
    const viewUrl = `https://drive.google.com/file/d/${file.data.id}/view`;

    res.status(200).json({
      success: true,
      file: {
        id: file.data.id,
        name: finalFileName,
        imageUrl: imageUrl,
        viewUrl: viewUrl
      }
    });

  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({
      error: "Upload failed",
      details: error.message,
      code: error.code || 'UNKNOWN'
    });
  }
}