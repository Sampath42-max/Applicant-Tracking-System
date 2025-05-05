import express from 'express';
import cors from 'cors';
import htmlPdf from 'html-pdf-node';
import puppeteer from 'puppeteer';

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

app.post('/api/download', async (req, res) => {
  try {
    const { html, format, templateId } = req.body;
    
    if (!html || !format || !templateId) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const filename = `resume_template_${templateId}`;
    let buffer;
    let contentType;

    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    
    // Set content and wait for any resources to load
    await page.setContent(html, { waitUntil: 'networkidle0' });

    if (format === 'pdf') {
      buffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' }
      });
      contentType = 'application/pdf';
    } else if (format === 'png' || format === 'jpeg') {
      buffer = await page.screenshot({
        type: format,
        fullPage: true,
        omitBackground: false
      });
      contentType = `image/${format}`;
    } else if (format === 'docx') {
      // For DOCX, we'll send HTML content that can be converted on the client side
      buffer = Buffer.from(html);
      contentType = 'text/html';
    } else {
      await browser.close();
      return res.status(400).json({ error: 'Invalid format type' });
    }

    await browser.close();

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename=${filename}.${format}`);
    res.send(buffer);

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});