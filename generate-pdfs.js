import puppeteer from 'puppeteer';
import { marked } from 'marked';
import fs from 'fs-extra';
import path from 'path';

// Configure marked for better PDF output
marked.setOptions({
  gfm: true,
  breaks: true,
  headerIds: true,
  mangle: false
});

const CSS_STYLES = `
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      font-size: 12px;
    }
    h1 {
      color: #2563eb;
      border-bottom: 3px solid #2563eb;
      padding-bottom: 10px;
      font-size: 24px;
      margin-top: 0;
    }
    h2 {
      color: #1d4ed8;
      border-bottom: 1px solid #e5e7eb;
      padding-bottom: 5px;
      margin-top: 30px;
      font-size: 18px;
    }
    h3 {
      color: #1e40af;
      margin-top: 25px;
      font-size: 14px;
    }
    h4 {
      color: #3730a3;
      margin-top: 20px;
      font-size: 12px;
    }
    p {
      margin: 10px 0;
    }
    ul, ol {
      margin: 10px 0;
      padding-left: 20px;
    }
    li {
      margin: 5px 0;
    }
    code {
      background-color: #f3f4f6;
      padding: 2px 4px;
      border-radius: 3px;
      font-family: 'Monaco', 'Courier New', monospace;
      font-size: 11px;
    }
    pre {
      background-color: #f8f9fa;
      border: 1px solid #e9ecef;
      border-radius: 5px;
      padding: 15px;
      overflow-x: auto;
      font-size: 11px;
    }
    blockquote {
      border-left: 4px solid #2563eb;
      margin: 15px 0;
      padding-left: 15px;
      color: #6b7280;
    }
    table {
      border-collapse: collapse;
      width: 100%;
      margin: 15px 0;
      font-size: 11px;
    }
    th, td {
      border: 1px solid #e5e7eb;
      padding: 8px;
      text-align: left;
    }
    th {
      background-color: #f9fafb;
      font-weight: 600;
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
      border-bottom: 2px solid #2563eb;
      padding-bottom: 20px;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      font-size: 10px;
      color: #6b7280;
    }
    .page-break {
      page-break-before: always;
    }
    @media print {
      body { font-size: 11px; }
      h1 { font-size: 20px; }
      h2 { font-size: 16px; }
      h3 { font-size: 13px; }
      h4 { font-size: 11px; }
    }
  </style>
`;

async function convertMarkdownToPDF(inputFile, outputFile, title) {
  console.log(`Converting ${inputFile} to ${outputFile}...`);
  
  try {
    // Read markdown file
    const markdownContent = await fs.readFile(inputFile, 'utf8');
    
    // Convert to HTML
    const htmlContent = marked(markdownContent);
    
    // Create complete HTML document
    const fullHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>${title}</title>
          ${CSS_STYLES}
        </head>
        <body>
          <div class="header">
            <h1>${title}</h1>
            <p><strong>Retail Restock Application Documentation</strong></p>
            <p>Generated: ${new Date().toLocaleDateString('en-AU', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</p>
          </div>
          ${htmlContent}
          <div class="footer">
            <p>© 2025 Retail Restock System | For internal use only</p>
          </div>
        </body>
      </html>
    `;
    
    // Launch Puppeteer
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Set content and generate PDF
    await page.setContent(fullHTML, { waitUntil: 'networkidle0' });
    
    await page.pdf({
      path: outputFile,
      format: 'A4',
      margin: {
        top: '20mm',
        right: '15mm',
        bottom: '20mm',
        left: '15mm'
      },
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: `
        <div style="font-size: 10px; text-align: center; width: 100%; color: #666;">
          ${title}
        </div>
      `,
      footerTemplate: `
        <div style="font-size: 10px; text-align: center; width: 100%; color: #666;">
          Page <span class="pageNumber"></span> of <span class="totalPages"></span>
        </div>
      `
    });
    
    await browser.close();
    console.log(`✓ Successfully created ${outputFile}`);
    
  } catch (error) {
    console.error(`Error converting ${inputFile}:`, error);
    throw error;
  }
}

async function generateAllPDFs() {
  console.log('Starting PDF generation...');
  
  const documents = [
    {
      input: 'TRAINING_GUIDE.md',
      output: 'Retail_Restock_Training_Guide.pdf',
      title: 'Training Guide'
    },
    {
      input: 'QUICK_REFERENCE.md',
      output: 'Retail_Restock_Quick_Reference.pdf',
      title: 'Quick Reference Guide'
    },
    {
      input: 'FEATURES_GUIDE.md',
      output: 'Retail_Restock_Features_Guide.pdf',
      title: 'Features Guide'
    }
  ];
  
  // Create PDFs directory if it doesn't exist
  await fs.ensureDir('pdfs');
  
  for (const doc of documents) {
    try {
      await convertMarkdownToPDF(
        doc.input,
        path.join('pdfs', doc.output),
        doc.title
      );
    } catch (error) {
      console.error(`Failed to generate ${doc.output}:`, error);
    }
  }
  
  console.log('\n✓ PDF generation complete!');
  console.log('Generated files:');
  documents.forEach(doc => {
    console.log(`  - pdfs/${doc.output}`);
  });
}

// Run the generator
generateAllPDFs().catch(console.error);