import { Router } from 'express';
import { requireAdmin } from './admin.js';
import { logInfo, logError } from '../services/logger.js';

const router = Router();

// Cloudinary upload via unsigned upload (using REST API directly)
router.post('/', requireAdmin, async (req, res) => {
  try {
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);
    
    // Parse multipart form data manually (simple approach)
    const boundary = req.headers['content-type'].split('boundary=')[1];
    if (!boundary) {
      return res.status(400).json({ error: 'No boundary in content-type' });
    }

    // Extract file data from multipart
    const parts = buffer.toString('binary').split('--' + boundary);
    let fileData = null;
    let fileName = 'upload';
    
    for (const part of parts) {
      if (part.includes('filename=')) {
        const nameMatch = part.match(/filename="([^"]+)"/);
        if (nameMatch) fileName = nameMatch[1];
        
        const headerEnd = part.indexOf('\r\n\r\n');
        if (headerEnd !== -1) {
          const bodyStart = headerEnd + 4;
          const bodyEnd = part.lastIndexOf('\r\n');
          fileData = Buffer.from(part.substring(bodyStart, bodyEnd), 'binary');
        }
      }
    }

    if (!fileData) {
      return res.status(400).json({ error: 'No file found in request' });
    }

    // Upload to Cloudinary using REST API
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return res.status(500).json({ error: 'Cloudinary not configured. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET to env.' });
    }

    // Create signature
    const timestamp = Math.round(Date.now() / 1000);
    const { createHash } = await import('crypto');
    const signature = createHash('sha1')
      .update(`folder=dahlia-paintings&timestamp=${timestamp}${apiSecret}`)
      .digest('hex');

    // Upload via fetch
    const formData = new FormData();
    formData.append('file', new Blob([fileData]), fileName);
    formData.append('api_key', apiKey);
    formData.append('timestamp', timestamp.toString());
    formData.append('signature', signature);
    formData.append('folder', 'dahlia-paintings');

    const cloudRes = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: 'POST', body: formData }
    );

    const cloudData = await cloudRes.json();

    if (!cloudRes.ok) {
      logError({ message: 'Cloudinary upload failed', error: cloudData });
      return res.status(500).json({ error: 'Upload to Cloudinary failed' });
    }

    logInfo('Image uploaded to Cloudinary', { url: cloudData.secure_url });

    res.json({
      url: cloudData.secure_url,
      publicId: cloudData.public_id,
      width: cloudData.width,
      height: cloudData.height,
    });
  } catch (error) {
    logError({ message: 'Upload error', error: error.message });
    res.status(500).json({ error: 'Upload failed: ' + error.message });
  }
});

export default router;
