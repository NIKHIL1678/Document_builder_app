const BASE_URL = "http://localhost:5000/api/user";

/* Get All Files */
export const getAllFiles = async () => {

  const token = localStorage.getItem("accessToken");

  if (!token) {
    throw new Error("No authentication token found. Please login.");
  }

  const response = await fetch(`${BASE_URL}/files/all`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const result = await response.json();

  console.log("STATUS:", response.status);
  console.log("RESPONSE:", result);

  if (!response.ok) {
    throw new Error(result.message || "Failed to fetch files");
  }

  return result;
};

/* Get File By ID */
export const getFileById = async (fileId) => {

  const token = localStorage.getItem("accessToken");

  if (!token) {
    throw new Error("No authentication token found. Please login.");
  }

  const response = await fetch(`${BASE_URL}/file/${fileId}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to fetch file");
  }

  return result;
};


/* Delete File By ID */
export const deleteFileById = async (fileId) => {

  const token = localStorage.getItem("accessToken");

  if (!token) {
    throw new Error("No authentication token found. Please login.");
  }


  const response = await fetch(`${BASE_URL}/file/${fileId}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to delete file");
  }

  return result;
};