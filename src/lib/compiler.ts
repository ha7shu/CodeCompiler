interface CompileResponse {
  success: boolean;
  output: string;
  error?: string;
}

export async function compileAndRun(code: string, input: string): Promise<CompileResponse> {
  try {
    const response = await fetch('https://api.codecompiler.com/compile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
        input,
        language: 'cpp',
      }),
    });

    if (!response.ok) {
      throw new Error('Compilation failed');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    return {
      success: false,
      output: '',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}