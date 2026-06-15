import { User } from "../models/User.js";
import { File } from "../models/File.js";
import { Sequelize } from 'sequelize';

export const getDashboardSummary = async ( userId, companyId ) => {
    console.log(' ---- Fetching Dashboard Summary -----');

    try {

        // We run these in parallel using Promise.all for maximum speed
        const [fileCount, totalSize, files ] = await Promise.all([
            File.count({ where: { company_id: companyId } }),
            File.sum('size', { where: { company_id: companyId } }),
            File.findAll( {
                where :{
                    user_id : userId,
                    company_id: companyId,
                },
                // 1. Sort by newest first
                order: [['createdAt', 'DESC']], 
                // 2. Only take the top 5
                limit: 5
            })
        ]);

        return ({
            success: true,
            data: {
                totalFiles: fileCount || 0,
                storageUsed: totalSize || 0, // in bytes
                storageFormatted: `${((totalSize || 0) / (1024 * 1024)).toFixed(2)} MB`,
                vaultStatus: "Active & Secure",
                files: files,
            }
        });

    } catch (error) {
        console.error("Dashboard Fetch Error:", error);
        return ({ 
            success: false, 
            message: "Failed to compile dashboard metrics" 
        });
    }
};