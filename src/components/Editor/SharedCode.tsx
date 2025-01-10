import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import CodeEditor from './CodeEditor';
import { getCode } from '../../lib/mockStorage';

const SharedCode: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sharedCode, setSharedCode] = useState<{
    code: string;
    input: string;
    fileName: string;
  } | null>(null);

  useEffect(() => {
    const fetchSharedCode = async () => {
      try {
        if (!id) throw new Error('Invalid code ID');
        const data = await getCode(id);
        setSharedCode(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load code');
        setTimeout(() => navigate('/'), 3000);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSharedCode();
  }, [id, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading shared code...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <p className="text-red-400 mb-2">{error}</p>
          <p className="text-gray-400">Redirecting to editor...</p>
        </div>
      </div>
    );
  }

  return (
    <CodeEditor
      initialCode={sharedCode?.code}
      initialInput={sharedCode?.input}
      initialFileName={sharedCode?.fileName}
      readOnly={!searchParams.get('edit')}
    />
  );
};

export default SharedCode;