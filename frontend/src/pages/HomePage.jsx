import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="home-page">
      <section className="hero hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">Enterprise cloud storage</p>
          <h1>Give teams one secure place to store, govern, and share critical files.</h1>
          <p className="lede">
            CloudVault combines secure uploads, workspace organization, direct sharing, and operational visibility in a product experience built for modern teams.
          </p>
          <div className="actions">
            <Link to="/register" className="button primary">Start free workspace</Link>
            <Link to="/login" className="button secondary">View product login</Link>
          </div>
          <div className="trust-row">
            <span>Role-ready access</span>
            <span>Protected APIs</span>
            <span>Share workflows</span>
          </div>
        </div>

        <div className="hero-preview panel">
          <div className="preview-top">
            <div>
              <p className="preview-label">Operations overview</p>
              <h3>Storage control center</h3>
            </div>
            <div className="status-pill">Live</div>
          </div>
          <div className="preview-stats">
            <article>
              <span>Workspace health</span>
              <strong>98.4%</strong>
            </article>
            <article>
              <span>Active shares</span>
              <strong>128</strong>
            </article>
            <article>
              <span>Protected assets</span>
              <strong>24.6K</strong>
            </article>
          </div>
          <div className="preview-list">
            <div className="preview-row">
              <strong>Board reports</strong>
              <span>Policy-protected</span>
            </div>
            <div className="preview-row">
              <strong>Finance archive</strong>
              <span>Shared with 6 users</span>
            </div>
            <div className="preview-row">
              <strong>Legal holds</strong>
              <span>Audit-ready</span>
            </div>
          </div>
        </div>
      </section>

      <section className="feature-band">
        <article className="panel feature-card">
          <p className="eyebrow">Security</p>
          <h3>Guard sensitive content</h3>
          <p>Validated uploads, protected routes, and storage controls create a safer baseline for internal business data.</p>
        </article>
        <article className="panel feature-card">
          <p className="eyebrow">Operations</p>
          <h3>Organize at scale</h3>
          <p>Folders, share links, tags, starred assets, and workspace summaries help teams move from ad-hoc file storage to a governed product workflow.</p>
        </article>
        <article className="panel feature-card">
          <p className="eyebrow">Product</p>
          <h3>Built with product thinking</h3>
          <p>Governance panels, team access views, prioritization, and workflow-oriented actions make this feel like a storage product, not just a file uploader.</p>
        </article>
      </section>
    </div>
  );
}
