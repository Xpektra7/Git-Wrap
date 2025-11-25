import React, { useRef } from 'react';
import SocialCard from './SocialCard';
import shareStat from '../lib/social';

// --- shadcn/ui Imports ---
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription, // Added for semantic clarity
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, X, Twitter, MessageSquare, BoltIcon } from "lucide-react";

interface SocialShareDialogProps {
  username?: string;
  title: string;
  value?: any;
  subtitle?: string;
  extra?: any;
  onClose: () => void;
}

// Helper function to build the share text (Unchanged)
const buildShareText = (title: string, value: any, username: string) => {
    return encodeURIComponent(`Check out my GitWrap stat: ${title} - ${value}! See your own year in review at gitwrap-nine.vercel.app ! @${username}`);
};

const SocialShareDialog = ({ username, title, value, subtitle, extra, onClose }: SocialShareDialogProps) => {
  const previewRef = useRef(null);

  const shareText = buildShareText(title, value, username || 'user');
  const shareUrl = encodeURIComponent('https://gitwrap-nine.vercel.app');

  // Action: Download the image (Unchanged)
  const handleDownload = () => {
    if (previewRef.current) {
        shareStat(previewRef.current, title);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      {/* 1. Simplified DialogContent: Narrower max-w and p-0 for full-width image */}
      <DialogContent className="max-w-md w-fit p-0 gap-0 flex flex-col overflow-hidden">
        
        {/* 2. Dialog Header (Metadata) */}
        <DialogHeader className="p-4 border-b border-border">
          <DialogTitle className="text-lg font-bold text-foreground">
            Share Your Stat Card
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {title}: {value}
          </DialogDescription>
        </DialogHeader>

        {/* 3. Image Preview Section (Full Width) */}
        {/* We use aspect-ratio and scale to make the square card fit well */}
        <div className="shrink-0 bg-background flex items-center justify-center p-">
          <div 
            ref={previewRef} 
            // The card itself is 600x600 but is scaled down to fit the narrow dialog width
            className="transform origin-top-left shadow-2xl relative scale-100"
          >
            <SocialCard 
                username={username} 
                title={title} 
                value={value} 
                subtitle={subtitle} 
                extra={extra} 
            />
          </div>
        </div>

        {/* 4. Dialog Footer (Round Circular Icons, No Text) */}
        <div className="flex justify-around items-center p-2 border-t border-border">
          
          {/* A. Download Button */}
          <Button
            onClick={handleDownload}
            variant="ghost"
            size="icon"
            // Use the standard primary color for a main action
            className="rounded-full w-12 h-12 text-primary hover:bg-primary/10 transition-colors"
            title="Download Image"
          >
            <Download className="w-5 h-5" />
          </Button>

          {/* B. Share to X (Twitter) */}
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="rounded-full w-12 h-12 text-[#1DA1F2] hover:bg-[#1DA1F2]/10 transition-colors"
            title="Share to X"
          >
            <a
              href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Twitter className="w-5 h-5" />
            </a>
          </Button>

          {/* C. Share to WhatsApp */}
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="rounded-full w-12 h-12 text-[#25D366] hover:bg-[#25D366]/10 transition-colors"
            title="Share to WhatsApp"
          >
            <a
              href={`https://api.whatsapp.com/send?text=${shareText}%20${shareUrl}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageSquare className="w-5 h-5" />
            </a>
          </Button>

          {/* D. Share to Reddit */}
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="rounded-full w-12 h-12 text-[#FF4500] hover:bg-[#FF4500]/10 transition-colors"
            title="Share to Reddit"
          >
            <a
              href={`https://www.reddit.com/submit?url=${shareUrl}&title=${shareText}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <BoltIcon className="w-5 h-5" />
            </a>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SocialShareDialog;