import React, { useState, useEffect, useRef } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import Spinner from './Spinner';
import SaveStatus from './SaveStatus';
import { Document } from '../types/document';
import { thumbnailMap } from '../data/documents';
import { apiService } from '../services/api';

const DocumentGrid: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loadingImages, setLoadingImages] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  const previousDocumentsRef = useRef<string>('');

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const data = await apiService.getDocuments();
        setDocuments(data);
        previousDocumentsRef.current = JSON.stringify(data);
      } catch (error) {
        console.error('Failed to fetch documents:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  useEffect(() => {
    if (!loading) {
      const currentDocuments = JSON.stringify(documents);
      if (currentDocuments !== previousDocumentsRef.current) {
        setHasChanges(true);
      }
    }
  }, [documents, loading]);

  useEffect(() => {
    const autoSave = async () => {
      if (hasChanges && !isSaving) {
        setIsSaving(true);
        try {
          await apiService.saveDocuments(documents);
          setLastSaved(new Date());
          previousDocumentsRef.current = JSON.stringify(documents);
          setHasChanges(false);
        } catch (error) {
          console.error('Failed to auto-save documents:', error);
        } finally {
          setIsSaving(false);
        }
      }
    };

    const interval = setInterval(autoSave, 5000);
    return () => clearInterval(interval);
  }, [documents, hasChanges, isSaving]);

  const handleImageLoad = (type: string) => {
    setLoadingImages((prev) => ({
      ...prev,
      [type]: false,
    }));
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) {
      const items = Array.from(documents);
      const [movedItem] = items.splice(result.source.index, 1);
      items.push(movedItem);

      const updatedItems = items.map((item, index) => ({
        ...item,
        position: index,
      }));

      setDocuments(updatedItems);
      return;
    }

    const items = Array.from(documents);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updatedItems = items.map((item, index) => ({
      ...item,
      position: index,
    }));

    setDocuments(updatedItems);
  };

  React.useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedImage(null);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, []);

  if (loading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <Spinner size='large' />
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-100'>
      <SaveStatus isSaving={isSaving} hasChanges={hasChanges} lastSaved={lastSaved} />

      <div className='container mx-auto px-4 py-8'>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable
            droppableId='droppable'
            // Always use horizontal direction for better drag behavior
            direction='horizontal'
          >
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className='flex flex-wrap gap-6'
                style={{
                  minHeight: '80vh',
                  width: '100%',
                }}
              >
                {documents.map((item, index) => (
                  <Draggable key={item.type} draggableId={item.type} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`
                          w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]
                          ${snapshot.isDragging ? 'z-50' : 'z-0'}
                        `}
                        style={{
                          ...provided.draggableProps.style,
                        }}
                      >
                        <div
                          className={`bg-white rounded-xl shadow transition-all duration-200 h-full ${
                            snapshot.isDragging
                              ? 'shadow-2xl scale-105'
                              : 'shadow-md hover:shadow-xl hover:scale-102'
                          }`}
                          onClick={() => setSelectedImage(thumbnailMap[item.type])}
                        >
                          <div className='p-4'>
                            <div className='relative aspect-video overflow-hidden rounded-lg'>
                              {loadingImages[item.type] && (
                                <div className='absolute inset-0 bg-gray-50 flex items-center justify-center'>
                                  <Spinner size='medium' />
                                </div>
                              )}
                              <img
                                src={thumbnailMap[item.type]}
                                alt={item.title}
                                className={`w-full h-full object-cover transition-opacity duration-300 ${
                                  loadingImages[item.type] ? 'opacity-0' : 'opacity-100'
                                }`}
                                onLoad={() => handleImageLoad(item.type)}
                                onError={() => handleImageLoad(item.type)}
                              />
                            </div>
                            <h3 className='mt-4 text-xl font-semibold text-gray-800'>
                              {item.title}
                            </h3>
                          </div>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      {selectedImage && (
        <div
          className='fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4'
          onClick={() => setSelectedImage(null)}
        >
          <div className='w-full max-w-5xl bg-white rounded-xl p-6'>
            <div className='relative aspect-video'>
              <img
                src={selectedImage}
                alt='Selected document'
                className='w-full h-full object-contain rounded-lg'
              />
            </div>
            <h2 className='text-2xl font-bold text-center mt-6'>
              {documents.find((doc) => thumbnailMap[doc.type] === selectedImage)?.title ||
                'Document'}
            </h2>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentGrid;
