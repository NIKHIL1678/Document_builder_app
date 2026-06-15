
import { 
    buildDocumentService,
    getDocumentByIdService, 
    updateDocumentService 
} from '../services/document.service.js';

export const handleDocumentInitialization = async (req, res) => {
    console.log(`\n=== [CONTROLLER] START: handleDocumentInitialization ===`);
    
    try {
        console.log(`[CONTROLLER] Step 1: Destructuring req.body...`);
        const { 
            title, 
            content, 
            targetFormat, 
            accessLevel, 
            sharedUsers, 
            sharedDepartment 
        } = req.body;

        console.log(`[CONTROLLER] Step 2: Validating mandatory fields (title, accessLevel)...`);
        if (!title || !accessLevel) {
            console.log(`[CONTROLLER] FAILED: Missing title or accessLevel.`);
            return res.status(400).json({ 
                success: false, 
                message: "ERR_VALIDATION_MISSING_REQUIRED_FIELDS" 
            });
        }

        console.log(`[CONTROLLER] Step 3: Extracting Auth identity...`);
        const owner_id = req.user?.userId || req.user?.id;
        const company_id = req.user?.companyId || req.user?.company_id;

        console.log(`[CONTROLLER] Extracted Owner ID :`, owner_id);
        console.log(`[CONTROLLER] Extracted Company ID:`, company_id);

        if (!owner_id || !company_id) {
            console.log(`[CONTROLLER] FAILED: owner_id or company_id is null/undefined.`);
            return res.status(403).json({ 
                success: false, 
                message: "ERR_UNAUTHORIZED_SESSION: Invalid Token Payload" 
            });
        }

        console.log(`[CONTROLLER] Step 4: Calling buildDocumentService...`);
        const newDoc = await buildDocumentService({
            title,
            content: content || "", 
            targetFormat: targetFormat || "native",
            accessLevel,
            sharedUsers,
            sharedDepartment,
            owner_id,
            company_id
        });

        console.log(`[CONTROLLER] Step 5: Service returned success. Document ID: ${newDoc.id}`);
        console.log(`=== [CONTROLLER] END: Returning 201 Response ===\n`);

        return res.status(201).json({
            success: true,
            message: "Document generated and saved successfully.",
            data: {
                documentId: newDoc.id 
            }
        });

    } catch (error) {
        console.error(`[CONTROLLER_ERROR] Catch block triggered:`, error.message);
        
        if (error.message === "ERR_DOCUMENT_BUILD_FAILED") {
            return res.status(500).json({ 
                success: false, 
                message: "Internal server error: Document generation failed." 
            });
        }

        return res.status(500).json({ 
            success: false, 
            message: "Internal server error." 
        });
    }
};

// --- GET DOCUMENT ---
export const getDocument = async (req, res) => {
    try {
        const { id } = req.params;
        const owner_id = req.user?.userId || req.user?.id;
        const company_id = req.user?.companyId || req.user?.company_id;

        const document = await getDocumentByIdService(id, owner_id, company_id);

        return res.status(200).json({
            success: true,
            data: document
        });

    } catch (error) {
        console.error(`[CONTROLLER_ERROR] getDocument:`, error.message);
        if (error.message === "ERR_NOT_FOUND") return res.status(404).json({ success: false, message: "Document not found." });
        if (error.message === "ERR_FORBIDDEN") return res.status(403).json({ success: false, message: "Access denied." });
        
        return res.status(500).json({ success: false, message: "Internal server error." });
    }
};

// --- UPDATE DOCUMENT ---
export const updateDocument = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;
        const owner_id = req.user?.userId || req.user?.id;
        const company_id = req.user?.companyId || req.user?.company_id;

        if (!title && !content) {
            return res.status(400).json({ success: false, message: "No data provided to update." });
        }

        const updatedDoc = await updateDocumentService(id, { title, content }, owner_id, company_id);

        return res.status(200).json({
            success: true,
            message: "Document synchronized successfully.",
            data: updatedDoc
        });

    } catch (error) {
        console.error(`[CONTROLLER_ERROR] updateDocument:`, error.message);
        if (error.message === "ERR_NOT_FOUND") return res.status(404).json({ success: false, message: "Document not found." });
        if (error.message === "ERR_FORBIDDEN") return res.status(403).json({ success: false, message: "Permission denied." });
        
        return res.status(500).json({ success: false, message: "Internal server error." });
    }
};