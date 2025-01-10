import express from 'express';
import { generateId } from '../utils/id';
import { Code, CreateCodeDTO } from '../models/Code';

const router = express.Router();

// In-memory storage (replace with database)
const codeStore = new Map<string, Code>();

// Create new code share
router.post('/api/code', (req, res) => {
  try {
    const { code, input, fileName, isPublic = true, allowEdit = false, expiresIn = 24 } = req.body as CreateCodeDTO;
    
    const id = generateId();
    const now = new Date();
    
    const codeEntry: Code = {
      id,
      code,
      input,
      fileName,
      createdAt: now,
      expiresAt: new Date(now.getTime() + expiresIn * 60 * 60 * 1000),
      isPublic,
      allowEdit,
      views: 0
    };
    
    codeStore.set(id, codeEntry);
    
    res.status(201).json({ id, allowEdit });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save code' });
  }
});

// Get shared code
router.get('/api/code/:id', (req, res) => {
  try {
    const { id } = req.params;
    const code = codeStore.get(id);
    
    if (!code) {
      return res.status(404).json({ error: 'Code not found' });
    }
    
    if (code.expiresAt && code.expiresAt < new Date()) {
      codeStore.delete(id);
      return res.status(404).json({ error: 'Code has expired' });
    }
    
    code.views += 1;
    codeStore.set(id, code);
    
    res.json(code);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve code' });
  }
});

export default router;