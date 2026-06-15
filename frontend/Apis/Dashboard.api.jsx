
/**
 * Fetches the aggregated stats for the Dashboard (Total Files, Users, Storage).
 * Scoped to the logged-in user's companyId via JWT.
 */
export const getDashboardSummary = async () => {
    // 1. Retrieve the token from LocalStorage
    const token = localStorage.getItem("accessToken");

    if (!token) {
        throw new Error("No authentication token found. Please login.");
    }

    try {
        // 2. Execute the fetch request
        const response = await fetch("http://localhost:5000/api/user/dashboardsummary", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` // Critical for the authenticate middleware
            }
        });

        // 3. Handle non-200 responses
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to fetch dashboard metrics");
        }

        // 4. Return the data to the component
        const result = await response.json();
        return result.summary; // Matches your controller's structure

    } catch (error) {
        console.error("Dashboard Service Error:", error.message);
        throw error; // Propagate to the UI for error handling
    }
};