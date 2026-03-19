const DownloadModal = ({ downloadSlang, onClose, onDownloadWithBg, onDownloadTransparent }) => {
  return (
    <div className="download-modal-overlay" onClick={onClose}>
      <div className="download-modal" onClick={e => e.stopPropagation()}>
        <button className="download-modal-close" onClick={onClose}>✕</button>
        <h2 className="download-modal-title">{downloadSlang}</h2>
        <p className="download-modal-subtitle">Choose how you want to save your Ducky.</p>
        <div className="download-modal-actions">
          <button className="download-modal-btn download-modal-btn-primary" onClick={onDownloadWithBg}>
            With background
          </button>
          <button className="download-modal-btn download-modal-btn-secondary" onClick={onDownloadTransparent}>
            Without background
          </button>
        </div>
      </div>
    </div>
  );
};

export default DownloadModal;
