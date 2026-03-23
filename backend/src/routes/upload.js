import { Router } from 'express';
import { requireAdmin } from './admin.js';
import { logInfo, logError } from '../services/logger.js';

const router = Router();

/**
 * POST /api/admin/upload
 *
 * Accepts multipart/form-data with a single "file" field.
 * Uploads directly to Cloudinary using signed authentication.
 *
 * Required env vars:
 *   CLOUDINARY_CLOUD_NAME
 *   CLOUDINARY_API_KEY
 *   CLOUDINARY_API_SECRET
 *
 * NOTE: In normal operation the frontend uploads DIRECTLY to Cloudinary
 * using an unsigned preset — this backend route is a fallback / alternative.
 */
router.post('/', requireAdmin, async (req, res) => {
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return res.status(500).json({
        error:
          'Cloudinary not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.',
      });
    }

    // Collect raw body
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    // Parse boundary
    const contentType = req.headers['content-type'] || '';
    const boundaryMatch = contentType.match(/boundary=([^\s;]+)/);
    if (!boundaryMatch) {
      return res.status(400).json({ error: 'No multipart boundary found.' });
    }
    const boundary = boundaryMatch[1];
    const delimiterBuf = Buffer.from(`--${boundary}`);

    // Parse multipart to find file
    let fileBuffer = null;
    let fileName = 'upload.jpg';
    let pos = 0;

    while (pos < buffer.length) {
      const delimStart = buffer.indexOf(delimiterBuf, pos);
      if (delimStart === -1) break;
      pos = delimStart + delimiterBuf.length;
      if (buffer[pos] === 0x0d && buffer[pos + 1] === 0x0a) pos += 2;
      if (buffer[pos] === 0x2d && buffer[pos + 1] === 0x2d) break;

      const headerEnd = buffer.indexOf(Buffer.from('\r\n\r\n'), pos);
      if (headerEnd === -1) break;
      const headers = buffer.slice(pos, headerEnd).toString('utf8');
      pos = headerEnd + 4;

      if (headers.includes('filename=')) {
        const nameMatch = headers.match(/filename="([^"]+)"/);
        if (nameMatch) fileName = nameMatch[1];
        const nextDelim = buffer.indexOf(delimiterBuf, pos);
        const fileEnd = nextDelim !== -1 ? nextDelim - 2 : buffer.length;
        fileBuffer = buffer.slice(pos, fileEnd);
        break;
      }
    }

    if (!fileBuffer || fileBuffer.length === 0) {
      return res.status(400).json({ error: 'No file found in request.' });
    }

    // Sign the upload
    const timestamp = Math.round(Date.now() / 1000);
    const folder = 'dahlia-paintings';
    const { createHash } = await import('crypto');
    const signature = createHash('sha1')
      .update(`folder=${folder}&timestamp=${timestamp}${apiSecret}`)
      .digest('hex');

    // Upload to Cloudinary
    const formData = new FormData();
    formData.append('file', new Blob([fileBuffer]), fileName);
    formData.append('api_key', apiKey);
    formData.append('timestamp', String(timestamp));
    formData.append('signature', signature);
    formData.append('folder', folder);

    const cloudRes = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: 'POST', body: formData }
    );
    const cloudData = await cloudRes.json();

    if (!cloudRes.ok) {
      logError({ message: 'Cloudinary upload failed', error: cloudData });
      return res.status(502).json({
        error: cloudData?.error?.message || 'Cloudinary upload failed.',
      });
    }

    logInfo('Image uploaded', { url: cloudData.secure_url });
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
