// routes/video.js
import express from 'express';
import FormData from 'form-data';
import fetch from 'node-fetch';
import multer from 'multer';

const router = express.Router();
const upload = multer(); // in-memory storage is OK for small files

// ── 1️⃣ Obtain S3 upload credentials ─────────────
export const CredentialsVdo = async (req, res) => {
  try {
    // console.log("hello bhai")
    const title = encodeURIComponent(req.body.title || 'video');
    const resp = await fetch(
      `https://dev.vdocipher.com/api/videos?title=${title}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Apisecret ${process.env.VDOCIPHER_API_SECRET}`
        }
      }
    );
    if (!resp.ok) {
      const errText = await resp.text();
      console.error('Credential error:', resp.status, errText);
      return res.status(resp.status).json({ error: errText });
    }
    const json = await resp.json();
    return res.json(json);
  } catch (err) {
    console.error('Credential exception:', err);
    return res.status(500).json({ error: err.message });
  }
};
// :contentReference[oaicite:0]{index=0}

// ── 2️⃣ Upload file to S3 using those credentials ─────
// vdocipherController.js
export const uploadVdoCipher = async (req, res) => {
  console.log('[upload] file:', req.file?.originalname);
  if (!req.file || !req.body.clientPayload) {
    return res.status(400).json({ error: 'Missing file or credentials.' });
  }

  try {
    const cp = JSON.parse(req.body.clientPayload);
    const { uploadLink, uploadMethod = 'POST', ...fields } = cp;

    const form = new FormData();
    Object.entries(fields).forEach(([key, val]) => {
      form.append(key, val);
    });
    form.append('success_action_status', '201');
    form.append('success_action_redirect', '');
    form.append('file', req.file.buffer, req.file.originalname);

    const resp2 = await fetch(uploadLink, {
      method: uploadMethod,
      headers: form.getHeaders(),
      body: form
    });

    if (resp2.status !== 201) {
      const text = await resp2.text();
      console.error('S3 upload failed:', resp2.status, text);
      return res.status(resp2.status).json({ error: text });
    }

    return res.json({ videoId: req.body.videoId });
  } catch (err) {
    console.error('[upload] exception:', err);
    return res.status(500).json({ error: err.message });
  }
};


// ── 3️⃣ Generate OTP & playbackInfo ───────────────
export const getOtpVdoCipher = async (req, res) => {
  try {
    const { videoId } = req.body;
    const resp = await fetch(
      `https://dev.vdocipher.com/api/videos/${videoId}/otp`,
      {
        method: 'POST',
        headers: {
          Authorization: `Apisecret ${process.env.VDOCIPHER_API_SECRET}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ accuracy: 'low' })
      }
    );
    if (!resp.ok) {
      const txt = await resp.text();
      console.error('OTP error:', resp.status, txt);
      return res.status(resp.status).json({ error: txt });
    }
    const json = await resp.json();
    return res.json(json); // { otp, playbackInfo }
  } catch (err) {
    console.error('OTP exception:', err);
    return res.status(500).json({ error: err.message });
  }
};
// // :contentReference[oaicite:2]{index=2}


// // router.get('/videos', async (req, res) => {
// //     try {
// //       const resp = await fetch('https://dev.vdocipher.com/api/videos', {
// //         headers: {
// //           Authorization: `Apisecret ${process.env.VDOCIPHER_API_SECRET}`
// //         }
// //       });
  
// //       const json = await resp.json();
// //       const videos = Array.isArray(json.rows) ? json.rows : [];
// //       res.json(videos);
// //     } catch (err) {
// //       console.error('List error:', err);
// //       res.status(500).json({ error: err.message });
// //     }
// //   });
  
  

export default router;
