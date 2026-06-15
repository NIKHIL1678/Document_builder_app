
import { getDashboardSummary } from "../Services/DashboardSummary.js";

export const DashboardSummary = async (req, res) => {
    // 1. Destructure from the authenticated user object
    const { userId, companyId } = req.user;

    // 2. Early Exit if Identity is missing (Safety First)
    if (!userId || !companyId) {
        return res.status(401).json({ error: "Unauthorized: Missing Tenant Context" });
    }

    try {
        // 3. Call your Service (The "Heavy Lifter")
        const summaryData = await getDashboardSummary(userId, companyId);

        // 4. Check if the service returned data
        if (summaryData) {
            return res.status(200).json({
                message: "Dashboard Summary Fetched Successfully",
                summary: summaryData
            });
        } else {
            return res.status(404).json({ message: "No data found for this tenant." });
        }

    } catch (error) {
        console.error("Dashboard Controller Error:", error.message);
        return res.status(500).json({ 
            error: "Failed to compile dashboard metrics",
            details: process.env.NODE_ENV === 'development' ? error.message : null
        });
    }
};