import React, { useState } from 'react';
import { Pencil } from 'lucide-react';

interface FileNameEditorProps {
  fileName: string;
  extension: string;
  onChange: (newName: string) => void;
  readOnly?: boolean;
}

const FileNameEditor: React.FC<FileNameEditorProps> = ({ fileName, extension, onChange, readOnly = false }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(fileName);

  const handleSubmit = () => {
    const trimmedValue = editValue.trim();
    if (trimmedValue) {
      onChange(trimmedValue);
    } else {
      setEditValue(fileName);
    }
    setIsEditing(false);
  };

  return (
    <div className="flex items-center gap-2 min-w-0">
      {isEditing ? (
        <div className="flex items-center max-w-[200px]">
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleSubmit}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            className="bg-gray-700 px-2 py-1 rounded w-full"
            autoFocus
          />
          <span className="text-gray-400 ml-1 shrink-0">{extension}</span>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <span className="text-gray-300 truncate">{fileName}{extension}</span>
          {!readOnly && (
            <button
              onClick={() => {
                setIsEditing(true);
                setEditValue(fileName);
              }}
              className="text-gray-400 hover:text-white shrink-0"
            >
              <Pencil className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default FileNameEditor;