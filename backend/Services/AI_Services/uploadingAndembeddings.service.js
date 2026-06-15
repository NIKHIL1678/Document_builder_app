import axios from "axios";
import FormData from "form-data";
import fs from "fs";

export const createPdfEmbeddings = async (filePath) => {
    try {
        const formData = new FormData();

        formData.append(
            "file",
            fs.createReadStream(filePath)
        );

        const response = await axios.post(
            "http://127.0.0.1:8000/embeddings/pdf",
            formData,
            {
                headers: formData.getHeaders(),
                maxBodyLength: Infinity,
            }
        );

        return response.data;

    } catch (error) {
        console.error(
            "AI Embeddings Error:",
            error.response?.data || error.message
        );

        return {
            success: false,
            error:
                error.response?.data ||
                error.message
        };
    }
};