import { Document } from '../types/document';

const STORAGE_KEY = 'document_grid_data';

export const initialDocuments = [
  { type: 'bank-draft', title: 'Bank Draft', position: 0 },
  { type: 'bill-of-lading', title: 'Bill of Lading', position: 1 },
  { type: 'invoice', title: 'Invoice', position: 2 },
  { type: 'bank-draft-2', title: 'Bank Draft 2', position: 3 },
  { type: 'bill-of-lading-2', title: 'Bill of Lading 2', position: 4 },
];

export const storageService = {
  getData: (): Document[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : initialDocuments;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return initialDocuments;
    }
  },

  saveData: (documents: Document[]): void => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(documents));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  },

  clearData: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  },
};
