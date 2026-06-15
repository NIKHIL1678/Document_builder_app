const BASE_URL = "http://localhost:5000/api/user/documents"; // Updated base URL

/* Initialize New Document */
export const initializeDocument = async (documentData) => {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    throw new Error("No authentication token found. Please login.");
  }

  const response = await fetch(`${BASE_URL}/initialize`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(documentData),
  });

  const result = await response.json();

  console.log("STATUS:", response.status);
  console.log("RESPONSE:", result);

  if (!response.ok) {
    throw new Error(result.message || "Failed to initialize document");
  }

  return result;
};

/* Get Single Document by ID */
export const getDocumentById = async (documentId) => {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    throw new Error("No authentication token found. Please login.");
  }

  const response = await fetch(`${BASE_URL}/${documentId}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to fetch document");
  }

  return result;
};

// Update document content
export const updateDocument = async (documentId, payload) => {
    const token = localStorage.getItem("accessToken");
    const response = await fetch(`http://localhost:5000/api/user/documents/${documentId}`, {
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(payload)
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message);
    return result;
};