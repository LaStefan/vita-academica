import * as admin from 'firebase-admin';
import { onRequest } from 'firebase-functions/https';
import { defineString } from 'firebase-functions/params';
import { cvPrompt } from './cv-processing-prompt';

const geminiApiKey = defineString('GEMINI_API_KEY');


export const parseCvWithGemini = onRequest({ timeoutSeconds: 300, memory: '2GiB' },async (req, res) => {
    // Get the file path from body or query parameters
    const filePath = req.body.filePath || req.query.filePath;
    const userId = req.body.userId || req.query.userId;

    if (!filePath) {
      res.status(400).send('Missing required parameter: filePath');
      return;
    }

    console.log('Received file path:', filePath);

    // Get default storage bucket
    const bucket = admin.storage().bucket();

    // Reference the file by path
    const file = bucket.file(filePath);

    // Check if file exists
    const [exists] = await file.exists();
    if (!exists) {
      res.status(404).send(`File not found at path: ${filePath}`);
      return;
    }

    // Download the file into a buffer
    const [buffer] = await file.download();

    console.log(`Downloaded file size: ${buffer.length} bytes`);

  // Initialize Gemini client at runtime using dynamic import
  const { GoogleGenAI } = await import('@google/genai');
  const genAI = new GoogleGenAI({apiKey: geminiApiKey.value()});



  const genAiResponse = await genAI.models.generateContent({
    model: 'gemini-2.5-flash',
    config: {responseMimeType: 'application/json'},
    contents: [{ role: 'user', parts: [
      { text: cvPrompt },
      {
        inlineData: {
          mimeType: 'application/pdf',
          data: buffer.toString('base64'),
        },
      },
    ], }],
  });


const rawGeminiOutput = genAiResponse?.text || '';

  // if (typeof rawGeminiOutput !== 'string') {
  //   console.error('Gemini output is undefined or not a string:', rawGeminiOutput);
  //   throw new Error('Gemini returned no output');
  // }

  let parsedJson: any;
  try {
    parsedJson = JSON.parse(rawGeminiOutput);
  } catch (error) {
    console.error('JSON parse error from Gemini output:', rawGeminiOutput);
    throw new Error('Gemini returned invalid JSON');
  }

  console.log('Parsed JSON from Gemini:', parsedJson);

  // Store the parsed CV in Firestore under the user's collection
  await admin.firestore()
  .collection('users')
  .doc(userId)
  .collection('cvs')
  .add({
    originalFileName: file.name,
    parsedCV: parsedJson,
    uploadedAt: Date.now().toString(),
    status: 'processed',
  });
  
  console.log(`CV processed and stored in Firestore for user: ${userId}`);

  res.status(200).send({
    message: 'CV processed successfully',
    originalFileName: file.name,
    userId: userId,
  });

});

// TODO: Proper data validation and error handling
// - Ensure the parsed JSON matches the expected schema
// - Make sure to handle any missing fields gracefully
// - Validate the file type and size before processing
// - Consider adding rate limiting or authentication for the endpoint
// - Add logging for better traceability
// - Handle potential errors from Gemini API calls
// - Ensure the Firestore write operation is atomic and handles conflicts
// - Consider adding a retry mechanism for transient errors
// - Implement proper security measures for file access and user data
// - Add unit tests for the function to ensure it behaves as expected
// - Make sure only authorized users can upload their own CVs and process only their lastly uploaded CV
// - Consider adding a cleanup mechanism for old CV files in storage