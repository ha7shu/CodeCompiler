import React, { useState } from 'react';
import { X, Check } from 'lucide-react';

interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  shareLink: string;
  allowEdit: boolean;
  onAllowEditChange: (allow: boolean) => void;
}

const ShareDialog: React.FC<ShareDialogProps> = ({
  isOpen,
  onClose,
  shareLink,
  allowEdit,
  onAllowEditChange,
}) => {
  const [showCopied, setShowCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg p-4 w-[90%] max-w-sm md:max-w-md md:p-6 relative">
        {/* Copy notification */}
        <div
          className={`absolute left-1/2 top-full -translate-x-1/2 mt-4 bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-opacity duration-200 ${
            showCopied ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Check className="w-4 h-4" />
          Copied to clipboard!
        </div>

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg md:text-xl font-semibold">Share Code</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="space-y-3 md:space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Allow others to edit</label>
            <button
              onClick={() => onAllowEditChange(!allowEdit)}
              className={`relative inline-flex h-5 md:h-6 w-10 md:w-11 items-center rounded-full transition-colors ${
                allowEdit ? 'bg-blue-600' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-3.5 md:h-4 w-3.5 md:w-4 transform rounded-full bg-white transition-transform ${
                  allowEdit ? 'translate-x-5 md:translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          
          <div>
            <label className="text-sm font-medium block mb-1.5">Share link</label>
            <div className="flex flex-col gap-2">
              <input
                type="text"
                value={shareLink}
                readOnly
                className="w-full bg-gray-700 rounded px-2.5 py-1.5 text-sm"
              />
              <button
                onClick={handleCopy}
                className="bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded text-sm w-full md:w-auto"
              >
                Copy
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareDialog;