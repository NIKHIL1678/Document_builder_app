
import { File } from "../models/File.js";
import { Document } from "../models/Document.js";
import { generateSignedUrl } from "./AWSs3Service.js";

export const getAllFilesService = async (
    user_id,
    company_id,
    monthly_view_query
) => {
    console.log(
        `Fetching unified ledger for ${user_id} belongs to ${company_id}`
    );

    try {
        const MONTHLY_VIEW_LIMIT = Number(
            process.env.MONTHLY_VIEW_LIMIT || 100
        );

        const hasExceededLimit =
            Number(monthly_view_query || 0) >= MONTHLY_VIEW_LIMIT;

        // FETCH USER UPLOADS
        const allFiles = await File.findAll({
            where: {
                user_id,
                company_id,
            },
            order: [["created_at", "DESC"]],
            limit: 10,
        });

        // FETCH SYSTEM DOCUMENTS
        const allDocs = await Document.findAll({
            where: {
                owner_id: user_id,
                company_id,
            },
            order: [["created_at", "DESC"]],
            limit: 10,
        });

        // NORMALIZE VAULT FILES
        const normalizedFiles = allFiles.map((file) => ({
            id: file.id,
            original_name: file.original_name,
            mime_type: file.mime_type,
            size: file.size,
            is_encrypted: file.is_encrypted,
            created_at: file.created_at,
            source_type: "vault_upload",

            // Example:
            // documents/1/myfile.pdf
            signedUrl: hasExceededLimit
                ? null
                : `http://localhost:5000/uploads/${file.storage_path.replace(/\\/g, "/")}`,

            accessBlocked: hasExceededLimit,
        }));

        // NORMALIZE INTERNAL DOCUMENTS
        const normalizedDocs = allDocs.map((doc) => {
            const approxSize = doc.content
                ? Buffer.byteLength(doc.content, "utf8")
                : 0;

            const ext =
                doc.format === "native"
                    ? ".txt"
                    : `.${doc.format}`;

            const localFileUrl = doc.source_file_id
                ? `http://localhost:5000/${doc.source_file_id.replace(/\\/g, "/")}`
                : null;

            return {
                id: doc.id,
                original_name: `${doc.title}${ext}`,
                mime_type:
                    doc.format === "pdf"
                        ? "application/pdf"
                        : "text/plain",
                size: approxSize,
                is_encrypted: false,
                created_at: doc.created_at,
                source_type: "system_document",
                signedUrl: hasExceededLimit
                    ? null
                    : localFileUrl,
                accessBlocked: hasExceededLimit,
            };
        });

        // MERGE + SORT
        const unifiedLedger = [
            ...normalizedFiles,
            ...normalizedDocs,
        ]
            .sort(
                (a, b) =>
                    new Date(b.created_at).getTime() -
                    new Date(a.created_at).getTime()
            )
            .slice(0, 10);

        return {
            success: true,
            data: unifiedLedger,
            limitExceeded: hasExceededLimit,
        };
    } catch (error) {
        console.error(
            "Error fetching unified files:",
            error
        );

        return {
            success: false,
            message: "Failed to fetch knowledge ledger",
        };
    }
};

/* Get Single File By ID */
export const getFileByIdService = async (file_id, user_id, company_id) => {
    console.log(`Fetching file ${file_id}`);

    try {
        const file = await File.findOne({
            where: {
                file_id,
                user_id,
                company_id,
            },
        });

        if (!file) {
            return {
                success: false,
                message: "File not found",
            };
        }

        return {
            success: true,
            data: file,
        };

    } catch (error) {
        console.error("Error fetching file:", error);

        return {
            success: false,
            message: "Failed to fetch file",
        };
    }
};


/* Delete File By ID */
export const deleteFileByIdService = async (file_id, user_id, company_id) => {
    console.log(`Deleting file ${file_id}`);

    try {
        const deletedRows = await File.destroy({
            where: {
                file_id,
                user_id,
                company_id,
            },
        });

        if (deletedRows === 0) {
            return {
                success: false,
                message: "File not found",
            };
        }

        return {
            success: true,
            message: "File deleted successfully",
        };

    } catch (error) {
        console.error("Error deleting file:", error);

        return {
            success: false,
            message: "Failed to delete file",
        };
    }
};