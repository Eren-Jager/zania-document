// src/mocks/handlers.ts
import { http, HttpResponse } from 'msw';
import type { Document } from '../types/document';
import { storageService } from '../services/storage';

export const handlers = [
  // Get all documents
  http.get('/api/documents', async () => {
    const data = storageService.getData();
    return HttpResponse.json(data);
  }),

  // Add new document
  http.post('/api/documents', async ({ request }) => {
    try {
      const newDocument = (await request.json()) as Document;
      const currentData = storageService.getData();
      const updatedData = [
        ...currentData,
        {
          type: newDocument.type,
          title: newDocument.title,
          position: currentData.length,
        },
      ];

      storageService.saveData(updatedData);
      return HttpResponse.json(newDocument, { status: 201 });
    } catch {
      return HttpResponse.json({ error: 'Invalid document data' }, { status: 400 });
    }
  }),

  // Update documents (for reordering)
  http.put('/api/documents', async ({ request }) => {
    try {
      const updatedDocuments = (await request.json()) as Document[];
      storageService.saveData(updatedDocuments);
      return HttpResponse.json(updatedDocuments);
    } catch {
      return HttpResponse.json({ error: 'Invalid documents data' }, { status: 400 });
    }
  }),
];
