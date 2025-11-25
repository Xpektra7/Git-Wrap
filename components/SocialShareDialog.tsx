import React, { useRef } from 'react';
import SocialCard from './SocialCard'; // Assuming it's in the same directory path as before
import shareStat from '../lib/social'; // The existing download function

interface SocialShareDialogProps {
  username?: string;
  title: string;
  value?: any;
  subtitle?: string;
  extra?: any;
  onClose: () => void;
}

// Helper function to build the share text
const buildShareText = (title: string, value: any, username: string) => {
    return encodeURIComponent(`Check out my GitWrap stat: ${title} - ${value}! See your own year in review at gitwrap-nine.vercel.app ! @${username}`);
};

const SocialShareDialog = ({ username, title, value, subtitle, extra, onClose }: SocialShareDialogProps) => {
  const previewRef = useRef<HTMLDivElement | null>(null);

  const shareText = buildShareText(title, value, username || 'user');
  const shareUrl = encodeURIComponent('https://gitwrap-nine.vercel.app'); // Replace with your actual URL

  // Action: Download the image
  const handleDownload = () => {
    // We use the existing shareStat function for the download action
    if (previewRef.current) {
        shareStat(previewRef.current, title);
    }
  };

  return (
    // Modal Overlay
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 transition-opacity">
      
      {/* Modal Content Container */}
      <div className="bg-(--background-color) rounded-lg shadow-2xl max-w-4xl w-full flex flex-col md:flex-row overflow-hidden relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-(--border) hover:text-(--color) z-50 p-2"
        >
          &times;
        </button>

        {/* --- Left Side: Social Card Preview (Scaled Down) --- */}
        <div className="p-4 md:p-8 flex items-center justify-center bg-(--background-color) w-full md:w-1/2">
          <div ref={previewRef} className="w-full aspect-square transform origin-top-left shadow-2xl relative">
            {/* RENDER THE SOCIAL CARD FOR PREVIEW */}
            <SocialCard 
                username={username} 
                title={title} 
                value={value} 
                subtitle={subtitle} 
                extra={extra} 
            />
          </div>
        </div>

        {/* --- Right Side: Actions --- */}
        <div className="p-6 md:p-8 w-full md:w-1/2 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Share Your GitWrap!</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Download the image or share it directly to your favorite platform.</p>
            
            <div className="space-y-3">
              {/* 1. Download Button */}
              <button
                onClick={handleDownload}
                className="w-full flex items-center justify-center bg-purple-600 text-(--color) font-semibold py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors"
              >
                📥 Download Image
              </button>

              {/* 2. Share to X (formerly Twitter) */}
              <a
                href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center bg-[#1DA1F2] text(--color) font-semibold py-3 px-4 rounded-lg hover:bg-[#1A93E4] transition-colors"
              >
                🐦 Share to X
              </a>

              {/* 3. Share to WhatsApp (Web/Mobile) */}
              <a
                href={`https://api.whatsapp.com/send?text=${shareText}%20${shareUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center bg-[#25D366] text(--color) font-semibold py-3 px-4 rounded-lg hover:bg-[#128C7E] transition-colors"
              >
                💬 Share to WhatsApp
              </a>

              {/* 4. Share to Reddit (REPLACED INSTAGRAM) */}
              <a
                href={`https://www.reddit.com/submit?url=${shareUrl}&title=${shareText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center bg-[#FF4500] text-white font-semibold py-3 px-4 rounded-lg hover:bg-[#FF5722] transition-colors"
              >
                👽 Share to Reddit
              </a>

            </div>
          </div>
          
          <button onClick={onClose} className="mt-8 text-sm text-(--color) hover:text(--color)">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SocialShareDialog;