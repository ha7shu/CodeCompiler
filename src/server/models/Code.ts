export interface Code {
  id: string;
  code: string;
  input: string;
  fileName: string;
  createdAt: Date;
  expiresAt?: Date;
  isPublic: boolean;
  allowEdit: boolean;
  views: number;
}

export interface CreateCodeDTO {
  code: string;
  input: string;
  fileName: string;
  isPublic?: boolean;
  allowEdit?: boolean;
  expiresIn?: number; // Time in hours
}