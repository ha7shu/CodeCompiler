import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import CodeEditor from './components/Editor/CodeEditor';
import SharedCode from './components/Editor/SharedCode';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CodeEditor />} />
        <Route path="/code/:id" element={<SharedCode />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;