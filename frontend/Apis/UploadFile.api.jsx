const BASE_URL = 'http://localhost:5000/api/user';

// Single file upload
export const uploadFileToVault = async (file) => {

  const token = localStorage.getItem("accessToken");

  if (!token) {
    throw new Error("No authentication token found. Please login.");
  }
  
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${BASE_URL}/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  const result = await response.json();
  if (!response.ok) throw new Error(result.error || 'Upload failed');
  return result;
};

// Bulk upload — fires requests in parallel
export const uploadBulkToVault = async (files, token) => {
  const results = await Promise.allSettled(
    files.map(file => uploadFileToVault(file, token))
  );

  const failed = results.filter(r => r.status === 'rejected');
  if (failed.length > 0) {
    console.error(`${failed.length} file(s) failed to upload:`, failed.map(f => f.reason));
  }

  const succeeded = results
    .filter(r => r.status === 'fulfilled')
    .map(r => r.value);

  if (succeeded.length === 0) throw new Error('All uploads failed');
  return { succeeded, failedCount: failed.length };
};