// Mock storage to simulate backend until real API is ready
const mockStorage = new Map<string, {
  code: string;
  input: string;
  fileName: string;
}>();

export const generateId = () => Math.random().toString(36).substring(2, 15);

export const saveCode = async (code: string, input: string, fileName: string) => {
  const id = generateId();
  mockStorage.set(id, { code, input, fileName });
  return { id };
};

export const getCode = async (id: string) => {
  const code = mockStorage.get(id);
  if (!code) {
    throw new Error('Code not found');
  }
  return code;
};