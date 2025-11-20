import React, { useState } from 'react';
import { Share2, Check } from 'lucide-react';

interface ShareButtonProps {
  countryName: string;
}

export const ShareButton: React.FC<ShareButtonProps> = ({ countryName }) => {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    // Construct URL safely using URL API
    let url = '';
    try {
      const urlObj = new URL(window.location.href);
      urlObj.searchParams.set('country', countryName);
      url = urlObj.toString();
    } catch (e) {
      // Fallback for weird environments
      url = `${window.location.origin}${window.location.pathname}?country=${encodeURIComponent(countryName)}`;
    }
    
    const shareData = {
      title: `TerraScope: ${countryName}`,
      text: `Check out this comprehensive data profile for ${countryName} on TerraScope.`,
      url: url,
    };

    // Try Native Share API first (works well on mobile)
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        // If user aborts, or it fails, we fall through to clipboard
        if ((err as Error).name !== 'AbortError') {
           console.error('Error sharing:', err);
        } else {
            return; // User cancelled
        }
      }
    }

    // Fallback to Clipboard
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <button
      onClick={handleShare}
      className={`
        flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border transition-all
        ${copied 
          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20 cursor-default' 
          : 'bg-purple-500/20 text-purple-400 border-purple-500/20 hover:bg-purple-500/30 cursor-pointer'
        }
      `}
    >
      {copied ? (
        <>
          <Check className="w-3 h-3" /> Copied
        </>
      ) : (
        <>
          <Share2 className="w-3 h-3" /> Share
        </>
      )}
    </button>
  );
};