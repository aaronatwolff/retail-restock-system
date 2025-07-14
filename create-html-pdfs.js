import { marked } from 'marked';
import fs from 'fs-extra';
import path from 'path';

// Configure marked for better output
marked.setOptions({
  gfm: true,
  breaks: true,
  headerIds: true,
  mangle: false
});

const CSS_STYLES = `
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.6;
    color: #333;
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    font-size: 14px;
  }
  h1 {
    color: #2563eb;
    border-bottom: 3px solid #2563eb;
    padding-bottom: 10px;
    font-size: 28px;
    margin-top: 0;
  }
  h2 {
    color: #1d4ed8;
    border-bottom: 1px solid #e5e7eb;
    padding-bottom: 5px;
    margin-top: 30px;
    font-size: 20px;
    page-break-inside: avoid;
  }
  h3 {
    color: #1e40af;
    margin-top: 25px;
    font-size: 16px;
    page-break-inside: avoid;
  }
  h4 {
    color: #3730a3;
    margin-top: 20px;
    font-size: 14px;
  }
  p {
    margin: 10px 0;
    text-align: justify;
  }
  ul, ol {
    margin: 10px 0;
    padding-left: 20px;
  }
  li {
    margin: 5px 0;
  }
  strong {
    color: #1f2937;
  }
  code {
    background-color: #f3f4f6;
    padding: 2px 6px;
    border-radius: 4px;
    font-family: 'Monaco', 'Courier New', monospace;
    font-size: 12px;
    color: #dc2626;
  }
  pre {
    background-color: #f8f9fa;
    border: 1px solid #e9ecef;
    border-radius: 5px;
    padding: 15px;
    overflow-x: auto;
    font-size: 12px;
  }
  blockquote {
    border-left: 4px solid #2563eb;
    margin: 15px 0;
    padding-left: 15px;
    color: #6b7280;
    background-color: #f8fafc;
    padding: 15px;
    border-radius: 0 5px 5px 0;
  }
  table {
    border-collapse: collapse;
    width: 100%;
    margin: 15px 0;
    font-size: 12px;
  }
  th, td {
    border: 1px solid #e5e7eb;
    padding: 8px 12px;
    text-align: left;
  }
  th {
    background-color: #f9fafb;
    font-weight: 600;
    color: #374151;
  }
  .header {
    text-align: center;
    margin-bottom: 40px;
    border-bottom: 2px solid #2563eb;
    padding-bottom: 20px;
    page-break-inside: avoid;
  }
  .footer {
    text-align: center;
    margin-top: 40px;
    padding-top: 20px;
    border-top: 1px solid #e5e7eb;
    font-size: 12px;
    color: #6b7280;
    page-break-inside: avoid;
  }
  .toc {
    background-color: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 20px;
    margin: 20px 0;
    page-break-inside: avoid;
  }
  .toc h2 {
    margin-top: 0;
    color: #1e40af;
    border-bottom: none;
  }
  .toc ul {
    list-style-type: none;
    padding-left: 0;
  }
  .toc li {
    margin: 8px 0;
  }
  .toc a {
    text-decoration: none;
    color: #2563eb;
    padding: 5px 0;
    display: block;
  }
  .toc a:hover {
    color: #1d4ed8;
    text-decoration: underline;
  }
  .print-button {
    position: fixed;
    top: 20px;
    right: 20px;
    background-color: #2563eb;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
    z-index: 1000;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  }
  .print-button:hover {
    background-color: #1d4ed8;
  }
  
  @media print {
    body { 
      font-size: 11px; 
      margin: 0;
      padding: 15px;
    }
    h1 { font-size: 20px; }
    h2 { font-size: 16px; }
    h3 { font-size: 14px; }
    h4 { font-size: 12px; }
    .print-button { display: none; }
    .header { margin-bottom: 20px; }
    .footer { margin-top: 20px; }
    
    /* Page break control */
    h1, h2, h3 {
      page-break-after: avoid;
    }
    
    img {
      max-width: 100% !important;
      height: auto !important;
    }
    
    /* Avoid breaking these elements */
    blockquote, table, pre {
      page-break-inside: avoid;
    }
    
    /* Keep list items together */
    li {
      page-break-inside: avoid;
    }
  }
  
  @page {
    margin: 20mm;
    size: A4;
  }
`;

function generateTableOfContents(html) {
  const headingRegex = /<h([1-6])[^>]*id="([^"]*)"[^>]*>([^<]*)</g;
  const headings = [];
  let match;
  
  while ((match = headingRegex.exec(html)) !== null) {
    const level = parseInt(match[1]);
    const id = match[2];
    const text = match[3];
    
    if (level <= 3) { // Only include h1, h2, h3 in TOC
      headings.push({ level, id, text });
    }
  }
  
  if (headings.length === 0) return '';
  
  let toc = '<div class="toc"><h2>Table of Contents</h2><ul>';
  
  headings.forEach(heading => {
    const indent = '  '.repeat(heading.level - 1);
    toc += `\n${indent}<li><a href="#${heading.id}">${heading.text}</a></li>`;
  });
  
  toc += '\n</ul></div>';
  return toc;
}

async function convertMarkdownToHTML(inputFile, outputFile, title, includeTableOfContents = true) {
  console.log(`Converting ${inputFile} to ${outputFile}...`);
  
  try {
    // Read markdown file
    const markdownContent = await fs.readFile(inputFile, 'utf8');
    
    // Convert to HTML
    let htmlContent = marked(markdownContent);
    
    // Generate table of contents if requested
    let tocHTML = '';
    if (includeTableOfContents) {
      tocHTML = generateTableOfContents(htmlContent);
    }
    
    // Create complete HTML document
    const fullHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - Retail Restock</title>
  <style>${CSS_STYLES}</style>
</head>
<body>
  <button class="print-button" onclick="window.print()">📄 Print/Save as PDF</button>
  
  <div class="header">
    <h1>${title}</h1>
    <p><strong>Retail Restock Application Documentation</strong></p>
    <p>Generated: ${new Date().toLocaleDateString('en-AU', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })}</p>
  </div>
  
  ${tocHTML}
  
  <div class="content">
    ${htmlContent}
  </div>
  
  <div class="footer">
    <p><strong>Retail Restock System Documentation</strong></p>
    <p>© 2025 | For internal use only | Generated from Markdown sources</p>
    <p><em>To save as PDF: Use your browser's Print function and select "Save as PDF"</em></p>
  </div>
  
  <script>
    // Auto-print functionality for easy PDF generation
    function printDocument() {
      window.print();
    }
    
    // Add keyboard shortcut for printing
    document.addEventListener('keydown', function(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        printDocument();
      }
    });
  </script>
</body>
</html>`;
    
    await fs.writeFile(outputFile, fullHTML);
    console.log(`✓ Successfully created ${outputFile}`);
    
  } catch (error) {
    console.error(`Error converting ${inputFile}:`, error);
    throw error;
  }
}

async function generateAllHTMLs() {
  console.log('Starting HTML generation for PDF conversion...');
  
  const documents = [
    {
      input: 'TRAINING_GUIDE.md',
      output: 'Retail_Restock_Training_Guide.html',
      title: 'Training Guide',
      includeTOC: true
    },
    {
      input: 'QUICK_REFERENCE.md',
      output: 'Retail_Restock_Quick_Reference.html',
      title: 'Quick Reference Guide',
      includeTOC: false
    },
    {
      input: 'FEATURES_GUIDE.md',
      output: 'Retail_Restock_Features_Guide.html',
      title: 'Features Guide',
      includeTOC: true
    }
  ];
  
  // Create pdfs directory if it doesn't exist
  await fs.ensureDir('pdfs');
  
  for (const doc of documents) {
    try {
      await convertMarkdownToHTML(
        doc.input,
        path.join('pdfs', doc.output),
        doc.title,
        doc.includeTOC
      );
    } catch (error) {
      console.error(`Failed to generate ${doc.output}:`, error);
    }
  }
  
  console.log('\n✓ HTML generation complete!');
  console.log('\nGenerated files (ready for PDF conversion):');
  documents.forEach(doc => {
    console.log(`  - pdfs/${doc.output}`);
  });
  
  console.log('\n📋 Instructions for creating PDFs:');
  console.log('1. Open each HTML file in your browser');
  console.log('2. Click the "Print/Save as PDF" button or press Ctrl+P (Cmd+P on Mac)');
  console.log('3. Select "Save as PDF" as the destination');
  console.log('4. Choose appropriate settings (A4 paper, margins, etc.)');
  console.log('5. Save the PDF file');
  
  // Create an index file for easy access
  const indexHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Retail Restock Documentation - PDF Generation</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      max-width: 800px;
      margin: 50px auto;
      padding: 20px;
      line-height: 1.6;
    }
    h1 { color: #2563eb; }
    h2 { color: #1d4ed8; margin-top: 30px; }
    .doc-link {
      display: block;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 20px;
      margin: 15px 0;
      text-decoration: none;
      color: #1f2937;
      transition: all 0.2s;
    }
    .doc-link:hover {
      background: #e2e8f0;
      border-color: #2563eb;
    }
    .doc-title {
      font-size: 18px;
      font-weight: 600;
      color: #2563eb;
      margin-bottom: 8px;
    }
    .doc-description {
      color: #6b7280;
      font-size: 14px;
    }
    .instructions {
      background: #fef3c7;
      border: 1px solid #f59e0b;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
    }
    .instructions h3 {
      margin-top: 0;
      color: #92400e;
    }
    ol {
      margin: 10px 0;
      padding-left: 20px;
    }
    li {
      margin: 8px 0;
    }
  </style>
</head>
<body>
  <h1>📄 Retail Restock Documentation</h1>
  <p><strong>PDF Generation Hub</strong> - Click on any document below to open it, then save as PDF using your browser.</p>
  
  <div class="instructions">
    <h3>🖨️ How to Save as PDF</h3>
    <ol>
      <li>Click on a document link below to open it</li>
      <li>Click the "📄 Print/Save as PDF" button in the top-right corner</li>
      <li>In the print dialog, select "Save as PDF" as destination</li>
      <li>Choose A4 paper size and appropriate margins</li>
      <li>Click "Save" and choose your filename and location</li>
    </ol>
    <p><em>Tip: Use Ctrl+P (or Cmd+P on Mac) as a keyboard shortcut</em></p>
  </div>
  
  <h2>📚 Available Documents</h2>
  
  <a href="Retail_Restock_Training_Guide.html" class="doc-link" target="_blank">
    <div class="doc-title">📖 Training Guide</div>
    <div class="doc-description">Comprehensive training manual covering installation, user workflows, troubleshooting, and best practices for all venues.</div>
  </a>
  
  <a href="Retail_Restock_Quick_Reference.html" class="doc-link" target="_blank">
    <div class="doc-title">⚡ Quick Reference Guide</div>
    <div class="doc-description">Printable quick reference card with step-by-step process, key product codes, and troubleshooting tips.</div>
  </a>
  
  <a href="Retail_Restock_Features_Guide.html" class="doc-link" target="_blank">
    <div class="doc-title">🔧 Features Guide</div>
    <div class="doc-description">Technical documentation covering application features, integrations, and system capabilities.</div>
  </a>
  
  <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 14px;">
    <p><strong>Retail Restock System Documentation</strong><br>
    Generated: ${new Date().toLocaleDateString('en-AU', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })}</p>
  </div>
</body>
</html>`;
  
  await fs.writeFile(path.join('pdfs', 'index.html'), indexHTML);
  console.log('  - pdfs/index.html (main index page)');
  
  console.log('\n🌐 Open pdfs/index.html in your browser to access all documents!');
}

// Run the generator
generateAllHTMLs().catch(console.error);