import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
//import { API_URL } from "../services/api.js";

export default function SharedFilePage() {
  const { token } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  //useEffect(() => {
  //   async function loadShare() {
  //     try {
  //       //const response = await fetch(`${API_URL}/api/files/shared/${token}`);
  //       const result = await response.json();
  //       if (!response.ok) {
  //         throw new Error(result.message || "Unable to load shared file");
  //       }
  //       setData(result);
  //     } catch (err) {
  //       setError(err.message);
  //     }
  //   }

  //   loadShare();
  // }, [token]);

  return (
    <section className="shared-page">
      <div className="panel shared-card">
        <p className="eyebrow">Shared file access</p>
        {error ? <p className="error-text">{error}</p> : null}
        {!data && !error ? <p className="helper-text">Loading shared file...</p> : null}
        {data ? (
          <>
            <h2>{data.file.originalName}</h2>
            <p className="lede compact">
              This file was shared from CloudVault. You can preview the metadata below and download it directly.
            </p>
            <div className="shared-meta-grid">
              <article className="panel shared-meta-card">
                <span>Type</span>
                <strong>{data.file.mimeType}</strong>
              </article>
              <article className="panel shared-meta-card">
                <span>Size</span>
                <strong>{data.file.sizeLabel}</strong>
              </article>
              <article className="panel shared-meta-card">
                <span>Shared</span>
                <strong>{new Date(data.share.createdAt).toLocaleDateString()}</strong>
              </article>
            </div>
            <div className="actions">
              <a
                className="button primary"
                href={`${API_URL}/api/files/shared/${token}/download`}
                target="_blank"
                rel="noreferrer"
              >
                Download file
              </a>
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
}
