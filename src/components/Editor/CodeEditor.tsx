import React, { useState } from 'react';
import { Play, Share2, FileCode2 } from 'lucide-react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs';
import FileNameEditor from './FileNameEditor';
import ShareDialog from './ShareDialog';
import { compileAndRun } from '../../lib/compiler';
import { saveCode } from '../../lib/mockStorage';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/themes/prism-tomorrow.css';

interface CodeEditorProps {
  initialCode?: string;
  initialInput?: string;
  initialFileName?: string;
  readOnly?: boolean;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  initialCode = '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello World!";\n    return 0;\n}',
  initialInput = '',
  initialFileName = 'Main',
  readOnly = false,
}) => {
  const [code, setCode] = useState<string>(initialCode);
  const [input, setInput] = useState<string>(initialInput);
  const [output, setOutput] = useState<string>('Output will appear here...');
  const [fileName, setFileName] = useState<string>(initialFileName);
  const [isEditing, setIsEditing] = useState(false);
  const [isCompiling, setIsCompiling] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [allowEdit, setAllowEdit] = useState(true);
  const [shareLink, setShareLink] = useState('');
  const [hasCompiled, setHasCompiled] = useState(false);

  const handleCompileAndRun = async () => {
    setIsCompiling(true);
    setOutput('Compiling...');
    
    try {
      const result = await compileAndRun(code, input);
      if (result.success) {
        setOutput(result.output);
        setHasCompiled(true);
      } else {
        setOutput(`Error: ${result.error}`);
      }
    } catch (error) {
      setOutput('An error occurred while compiling the code.');
    } finally {
      setIsCompiling(false);
    }
  };

  const handleShare = async () => {
    if (!hasCompiled) {
      setOutput('Please compile your code at least once before sharing.');
      return;
    }

    try {
      const { id } = await saveCode(code, input, fileName);
      const baseUrl = window.location.origin;
      const link = `${baseUrl}/code/${id}${allowEdit ? '?edit=true' : ''}`;
      setShareLink(link);
      setShareDialogOpen(true);
    } catch (error) {
      setOutput('Failed to generate share link. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      <header className="bg-gray-800 p-4 flex-none">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FileCode2 className="w-6 h-6" />
            CodeCompiler
          </h1>
          {!readOnly && (
            <button
              onClick={handleShare}
              disabled={!hasCompiled}
              className="hidden md:flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg text-sm disabled:bg-gray-600 disabled:cursor-not-allowed"
              title={!hasCompiled ? "Compile your code first" : "Share your code"}
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 container mx-auto p-4 overflow-y-auto md:overflow-hidden">
        <div className="flex flex-col md:flex-row gap-4 md:h-[calc(100vh-7rem)]">
          <div className="w-full md:w-[60%] flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <FileNameEditor
                fileName={fileName}
                extension=".cpp"
                onChange={(name) => {
                  setFileName(name);
                  setIsEditing(false);
                }}
                readOnly={readOnly}
              />
              {!readOnly && (
                <button
                  onClick={handleShare}
                  disabled={!hasCompiled}
                  className={`md:hidden flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg text-sm disabled:bg-gray-600 disabled:cursor-not-allowed ${isEditing ? 'hidden' : ''}`}
                  title={!hasCompiled ? "Compile your code first" : "Share your code"}
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              )}
            </div>
            
            <div className="h-[calc(100vh-19.5rem)] md:h-[calc(100vh-9.5rem)] relative bg-gray-800 rounded-lg overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-8 bg-gray-700 text-gray-400 text-xs text-right pr-2 select-none">
                {code.split('\n').map((_, i) => (
                  <div key={i} className="leading-6">
                    {i + 1}
                  </div>
                ))}
              </div>
              <div className="h-full overflow-auto">
                <Editor
                  value={code}
                  onValueChange={readOnly ? undefined : setCode}
                  highlight={code => highlight(code, languages.cpp, 'cpp')}
                  padding={10}
                  style={{
                    fontFamily: '"Fira code", "Fira Mono", monospace',
                    fontSize: 14,
                    lineHeight: '1.5',
                    marginLeft: '2rem'
                  }}
                  className="focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-full"
                  readOnly={readOnly}
                />
              </div>
            </div>

            <div className="h-[2rem] flex items-center">
              <button
                onClick={handleCompileAndRun}
                disabled={isCompiling}
                className={`flex items-center justify-center gap-2 ${
                  isCompiling ? 'bg-gray-600' : 'bg-green-600 hover:bg-green-700'
                } px-3 py-1.5 rounded-lg text-sm w-fit transition-colors`}
              >
                <Play className="w-4 h-4" />
                {isCompiling ? 'Compiling...' : 'Compile & Run'}
              </button>
            </div>
          </div>

          <div className="w-full md:w-[40%] flex flex-col gap-4">
            <div className="h-[120px] md:h-[calc((100vh-10rem)/3)]">
              <h2 className="text-lg font-semibold mb-2">Input (stdin)</h2>
              <textarea
                value={input}
                onChange={readOnly ? undefined : (e) => setInput(e.target.value)}
                className="w-full h-[calc(100%-2rem)] bg-gray-800 p-4 rounded-lg font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter program input here..."
                readOnly={readOnly}
              />
            </div>
            <div className="h-[240px] md:h-[calc((100vh-10rem)*2/3)]">
              <h2 className="text-lg font-semibold mb-2">Output (stdout)</h2>
              <div className="w-full h-[calc(100%-2rem)] bg-gray-800 p-4 rounded-lg font-mono text-sm overflow-auto whitespace-pre-wrap">
                {output}
              </div>
            </div>
          </div>
        </div>
      </main>

      <ShareDialog
        isOpen={shareDialogOpen}
        onClose={() => setShareDialogOpen(false)}
        shareLink={shareLink}
        allowEdit={allowEdit}
        onAllowEditChange={setAllowEdit}
      />
    </div>
  );
};

export default CodeEditor;