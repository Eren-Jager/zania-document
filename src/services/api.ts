import { Document } from '../types/document';

export const apiService = {
  getDocuments: async (): Promise<Document[]> => {
    const response = await fetch('/api/documents');
    if (!response.ok) {
      throw new Error('Failed to fetch documents');
    }
    return response.json();
  },

  saveDocuments: async (documents: Document[]): Promise<Document[]> => {
    const response = await fetch('/api/documents', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(documents),
    });

    if (!response.ok) {
      throw new Error('Failed to save documents');
    }
    return response.json();
  },

  addDocument: async (document: Omit<Document, 'position'>): Promise<Document> => {
    const response = await fetch('/api/documents', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(document),
    });

    if (!response.ok) {
      throw new Error('Failed to add document');
    }
    return response.json();
  },
};
