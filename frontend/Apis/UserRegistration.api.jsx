export const userRegister = async (userData) => {
    try {
        const response = await fetch("http://localhost:5000/api/user/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: userData.name,
                email: userData.email,
                password: userData.password, // Frontend sends plain text; Backend hashes it
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            // This catches the 400 (User exists) or 500 (Server error)
            throw new Error(data.message || "Registration failed");
        }

        // --- TOKEN MANAGEMENT ---
        // Save the access token in localStorage or App State
        if (data.accessToken) {
            localStorage.setItem("accessToken", data.accessToken);
        }

        return data;

    } catch (error) {
        console.error("Frontend Registration Error:", error.message);
        throw error;
    }
};