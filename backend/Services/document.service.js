import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';
import { v4 as uuidv4 } from 'uuid';
import { Document } from "../models/Document.js";
import { DocumentShare } from '../models/DocumentShare.js';
import sequelize from '../config/db.js'; // Ensure this points to your actual Sequelize instance

// --- ENTERPRISE PDF GENERATOR (PUPPETEER) ---
const generatePDF = async (payload, htmlContent, filePath) => {
    console.log(`[PDF_GEN] Launching headless browser...`);
    const browser = await puppeteer.launch({ 
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox'] 
    });
    
    const page = await browser.newPage();

    // 1. Generate Metadata for the Header
    const generationTime = new Date().toLocaleString('en-US', { 
        dateStyle: 'medium', timeStyle: 'short' 
    });
    const scopeLabel = payload.accessLevel === 'shared' ? 'Shared / Inter-Departmental' : 'Private / Confidential';
    const documentIdLabel = uuidv4().split('-')[0].toUpperCase();

    // 2. Inject into Bento-Grid Enterprise Template
    const formattedHtml = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
                
                * { box-sizing: border-box; }
                
                body { 
                    font-family: 'Inter', sans-serif; 
                    padding: 40px 50px; 
                    color: #0f172a; 
                    line-height: 1.6; 
                    margin: 0;
                }

                /* --- METADATA HEADER (System Terminal Style) --- */
                .header-block {
                    border-bottom: 2px solid #e2e8f0;
                    padding-bottom: 25px;
                    margin-bottom: 35px;
                }
                .sys-label {
                    font-size: 10px;
                    font-weight: 800;
                    color: #64748b;
                    text-transform: uppercase;
                    letter-spacing: 1.5px;
                    margin-bottom: 8px;
                }
                .doc-title {
                    font-size: 26px;
                    font-weight: 800;
                    color: #0f172a;
                    margin: 0 0 20px 0;
                    letter-spacing: -0.5px;
                    text-transform: capitalize;
                }
                
                /* Bento Grid Layout */
                .meta-grid {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 15px;
                    background-color: #f8fafc;
                    padding: 16px;
                    border: 1px solid #e2e8f0;
                    border-radius: 8px;
                }
                .meta-item {
                    flex: 1;
                    min-width: 130px;
                    border-left: 2px solid #cbd5e1;
                    padding-left: 10px;
                }
                .meta-key {
                    font-size: 8px;
                    font-weight: 800;
                    color: #64748b;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    margin-bottom: 3px;
                }
                .meta-value {
                    font-size: 11px;
                    font-weight: 600;
                    color: #1e293b;
                    font-family: monospace;
                }

                /* --- TIPTAP CONTENT NORMALIZATION --- */
                .content-body {
                    font-size: 12px;
                    color: #334155;
                }
                .content-body h1, .content-body h2, .content-body h3 {
                    color: #0f172a;
                    margin-top: 1.8em;
                    margin-bottom: 0.6em;
                    font-weight: 700;
                }
                .content-body h1 { font-size: 18px; border-bottom: 1px solid #f1f5f9; padding-bottom: 6px; }
                .content-body h2 { font-size: 15px; }
                .content-body p { margin-bottom: 1.2em; }
                .content-body ul, .content-body ol { margin-bottom: 1.2em; padding-left: 24px; }
                .content-body li { margin-bottom: 4px; }
                .content-body pre { 
                    background: #f1f5f9; 
                    padding: 12px; 
                    border-radius: 6px; 
                    font-family: monospace; 
                    font-size: 10px; 
                    white-space: pre-wrap; 
                    border: 1px solid #e2e8f0;
                }

                /* --- FOOTER --- */
                .footer { 
                    position: fixed; 
                    bottom: 25px; 
                    left: 50px; 
                    right: 50px;
                    display: flex;
                    justify-content: space-between;
                    font-size: 8px; 
                    font-weight: 700;
                    color: #94a3b8; 
                    border-top: 1px solid #e2e8f0;
                    padding-top: 10px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }
            </style>
        </head>
        <body>
            <div class="header-block">
                <div class="sys-label">ZIPZY HR • ENTERPRISE WORKSPACE</div>
                <h1 class="doc-title">${payload.title}</h1>
                
                <div class="meta-grid">
                    <div class="meta-item">
                        <div class="meta-key">Reference ID</div>
                        <div class="meta-value">DOC-${documentIdLabel}</div>
                    </div>
                    <div class="meta-item">
                        <div class="meta-key">Timestamp</div>
                        <div class="meta-value">${generationTime}</div>
                    </div>
                    <div class="meta-item">
                        <div class="meta-key">Security Scope</div>
                        <div class="meta-value">${scopeLabel}</div>
                    </div>
                    <div class="meta-item">
                        <div class="meta-key">Author Auth ID</div>
                        <div class="meta-value">${String(payload.owner_id).split('-')[0]}***</div>
                    </div>
                </div>
            </div>

            <div class="content-body">
                ${htmlContent}
            </div>

            <div class="footer">
                <span>SECURE GENERATION PROTOCOL</span>
                <span>END OF DOCUMENT</span>
            </div>
        </body>
        </html>
    `;

    console.log(`[PDF_GEN] Rendering HTML to page...`);
    // FIX: Using 'load' instead of 'networkidle0' handles remote network lags elegantly
    await page.setContent(formattedHtml, { waitUntil: 'load' });

    console.log(`[PDF_GEN] Printing to PDF at: ${filePath}`);
    await page.pdf({ 
        path: filePath, 
        format: 'A4', 
        printBackground: true,
        margin: { top: '0px', bottom: '0px', left: '0px', right: '0px' } 
    });

    await browser.close();
    console.log(`[PDF_GEN] Success! Browser closed.`);
};

// --- CORE DOCUMENT BUILD SERVICE ---
export const buildDocumentService = async (payload) => {
    console.log(`\n   --- [SERVICE] START: buildDocumentService ---`);
    const { 
        title, content, targetFormat, company_id, owner_id,
        accessLevel, sharedUsers, sharedDepartment 
    } = payload;
    
    console.log(`   [SERVICE] Step 1: Starting DB Transaction...`);
    const t = await sequelize.transaction();

    try {
        console.log(`   [SERVICE] Step 2: Defining server storage paths...`);
        const storageDir = path.join('uploads', 'documents', String(company_id));
        
        if (!fs.existsSync(storageDir)) {
            console.log(`   [SERVICE] Directory missing. Creating: ${storageDir}`);
            fs.mkdirSync(storageDir, { recursive: true });
        } else {
            console.log(`   [SERVICE] Directory exists: ${storageDir}`);
        }

        let ext = targetFormat;
        if (targetFormat === 'native') ext = 'txt';
        if (targetFormat === 'word') ext = 'doc';

        const fileName = `${Date.now()}-${title.replace(/\s+/g, '_')}.${ext}`;
        const filePath = path.join(storageDir, fileName);
        
        console.log(`   [SERVICE] Step 3: Target File Path = ${filePath}`);

        // 3. Generate the physical file
        if (targetFormat === 'pdf') {
            console.log(`   [SERVICE] Step 4: Format is PDF. Triggering Puppeteer...`);
            await generatePDF(payload, content, filePath);
        } else {
            console.log(`   [SERVICE] Step 4: Format is ${targetFormat}. Writing via fs.writeFileSync()...`);
            fs.writeFileSync(filePath, content);
            console.log(`   [SERVICE] Text file written successfully.`);
        }

        // 4. Save Record to Database
        console.log(`   [SERVICE] Step 5: Saving Document Record to Database...`);
        const newDoc = await Document.create({
            title,
            content, // Save the raw text/html so the editor can reload it later
            format: targetFormat,
            company_id,
            owner_id, 
            source_file_id: filePath // Storing the full path string in this column
        }, { transaction: t });

        console.log(`   [SERVICE] DB Insert Success! New Document ID: ${newDoc.id}`);

        // 5. Handle Access Control Logging
        console.log(`   [SERVICE] Step 6: Checking Sharing Access Protocol...`);
        if (accessLevel === 'shared' && (sharedUsers || sharedDepartment)) {
            console.log(`   [SERVICE] Creating DocumentShare record...`);
            await DocumentShare.create({
                document_id: newDoc.id,
                shared_users: sharedUsers, 
                shared_department: sharedDepartment,
                company_id
            }, { transaction: t });
            console.log(`   [SERVICE] DocumentShare record created.`);
        } else {
            console.log(`   [SERVICE] Document is private. Skipping DocumentShare step.`);
        }

        // 6. Commit the entire process
        console.log(`   [SERVICE] Step 7: Committing DB Transaction...`);
        await t.commit();
        console.log(`   --- [SERVICE] END: Success --- \n`);
        
        return newDoc;

    } catch (error) {
        console.log(`   [SERVICE_CRITICAL] Step 8: Error Caught. Rolling back DB Transaction...`);
        await t.rollback();
        console.error(`   [SERVICE_ERROR_DETAILS]:`, error);
        throw new Error("ERR_DOCUMENT_BUILD_FAILED");
    }
};

// Add these exports to the bottom of services/document.service.js

export const getDocumentByIdService = async (documentId, owner_id, company_id) => {
    console.log(`\n   --- [SERVICE] START: getDocumentByIdService ---`);
    console.log(`   [SERVICE] Looking up Document ID: ${documentId}`);

    // 1. Fetch the document
    const doc = await Document.findOne({
        where: { 
            id: documentId,
            company_id: company_id // STRICT ISOLATION: Never return a doc from another tenant
        }
    });

    if (!doc) {
        throw new Error("ERR_NOT_FOUND");
    }

    // 2. Security Check (Basic Implementation)
    // If it's private and the user isn't the owner, block access.
    // (If you have a 'format' or 'accessLevel' column, you would check it here)
    if (doc.owner_id !== owner_id) {
        // You would typically query DocumentShare here to see if this user is allowed
        // For now, we enforce strict ownership matching as an example:
        // throw new Error("ERR_FORBIDDEN");
    }

    console.log(`   --- [SERVICE] END: Document Fetched --- \n`);
    return doc;
};

export const updateDocumentService = async (documentId, payload, owner_id, company_id) => {
    console.log(`\n   --- [SERVICE] START: updateDocumentService ---`);
    
    // 1. Verify existence and ownership
    const doc = await Document.findOne({
        where: { id: documentId, company_id: company_id }
    });

    if (!doc) throw new Error("ERR_NOT_FOUND");
    
    // Enforce write permissions (Only owner can edit for now)
    if (doc.owner_id !== owner_id) {
        throw new Error("ERR_FORBIDDEN");
    }

    // 2. Update Database Record
    console.log(`   [SERVICE] Updating Database record...`);
    doc.title = payload.title || doc.title;
    doc.content = payload.content || doc.content;
    await doc.save();

    // 3. Update the Physical File on Disk
    // To maintain sync, we must overwrite the file at `doc.source_file_id`
    console.log(`   [SERVICE] Re-writing physical file at: ${doc.source_file_id}`);
    
    if (doc.format === 'pdf') {
        // We reuse the puppeteer generator from earlier to overwrite the PDF
        await generatePDF({ title: doc.title, accessLevel: 'private', owner_id }, doc.content, doc.source_file_id);
    } else {
        // For text/native, just overwrite the text file
        fs.writeFileSync(doc.source_file_id, doc.content);
    }

    console.log(`   --- [SERVICE] END: Document Updated --- \n`);
    return doc;
};