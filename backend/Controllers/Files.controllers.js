
import { 
    getAllFilesService,
    getFileByIdService,
    deleteFileByIdService,
} from "../Services/Files.services.js";

export const getAllFiles = async (req, res) => {

    console.log("File Fetch API Hit");

    try {
        const { userId, companyId, Monthly_View_query } = req.user;

        const result = await getAllFilesService(userId, companyId, Monthly_View_query);

        if (result.success) {
            return res.status(200).json({
                message: "Files have been fetched successfully",
                allFiles: result.data, // assuming service returns data
                success: true,
            });
        }

        return res.status(400).json({
            message: "Files have not been fetched successfully",
            success: false,
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
};

/* Get Single File Controller */
export const getFileById = async (req, res) => {
    console.log("Get File By ID API Hit");

    try {
        const { userId, companyId, Monthly_View_Query} = req.user;
        const { fileId } = req.params;

        const result = await getFileByIdService(
            fileId,
            userId,
            companyId
        );

        if (result.success) {
            return res.status(200).json({
                message: "File fetched successfully",
                file: result.data,
                success: true,
            });
        }

        return res.status(404).json({
            message: result.message,
            success: false,
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
};


/* Delete File Controller */
export const deleteFileById = async (req, res) => {
    console.log("Delete File API Hit");

    try {
        const { userId, companyId } = req.user;
        const { fileId } = req.params;

        const result = await deleteFileByIdService(
            fileId,
            userId,
            companyId
        );

        if (result.success) {
            return res.status(200).json({
                message: result.message,
                success: true,
            });
        }

        return res.status(404).json({
            message: result.message,
            success: false,
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
};