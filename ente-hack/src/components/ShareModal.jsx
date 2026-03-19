import { useState } from 'react';
import { categoryOptions } from '../categoryOptions';
import ducky_base from '../assets/duckies/ducky_base.svg';

const ShareModal = ({ shareCardItems, onClose, onNativeShare }) => {
  const [copyState, setCopyState] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopyState(true);
    setTimeout(() => setCopyState(false), 2000);
  };

  return (
    <div className="download-modal-overlay" onClick={onClose}>
      <div className="share-card-modal" onClick={e => e.stopPropagation()}>
        <button className="download-modal-close" onClick={onClose}>✕</button>

        <div className="share-card-preview">
          <div className="share-card-avatar">
            <img src={ducky_base} alt="" />
            {['cap', 'glasses', 'shoes', 'accessories'].map(cat =>
              shareCardItems[cat] && categoryOptions[cat] ? (
                <img key={cat} src={categoryOptions[cat].find(i => i.id === shareCardItems[cat])?.src} alt="" />
              ) : null
            )}
          </div>
          <div className="share-card-brand">
            <span className="share-card-brand-title">Ducky Drip<sup>®</sup></span>
            <span className="share-card-brand-sub">Crafted by <a href="https://ente.io/about" target="_blank" rel="noopener noreferrer" className="share-card-brand-ente">ente designers</a></span>
          </div>
        </div>

        <div className="share-card-actions">
          <button className="share-card-btn share-card-btn-secondary" onClick={handleCopyLink}>
            {copyState ? (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                Copied!
              </>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                Copy link
              </>
            )}
          </button>
          <button className="share-card-btn share-card-btn-primary" onClick={onNativeShare}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
            Share
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
