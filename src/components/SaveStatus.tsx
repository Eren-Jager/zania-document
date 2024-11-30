import React, { useState, useEffect } from 'react';
import Spinner from './Spinner';

interface SaveStatusProps {
  isSaving: boolean;
  hasChanges: boolean;
  lastSaved: Date | null;
}

const SaveStatus: React.FC<SaveStatusProps> = ({ isSaving, hasChanges, lastSaved }) => {
  const [timeString, setTimeString] = useState<string>('Never saved');

  useEffect(() => {
    const updateTime = () => {
      if (!lastSaved) {
        setTimeString('Never saved');
        return;
      }

      const seconds = Math.floor((new Date().getTime() - lastSaved.getTime()) / 1000);

      if (seconds < 60) {
        setTimeString(`${seconds} seconds ago`);
      } else {
        const minutes = Math.floor(seconds / 60);
        setTimeString(`${minutes} minute${minutes === 1 ? '' : 's'} ago`);
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, [lastSaved]);

  return (
    <div className='fixed bottom-4 right-4 bg-white rounded-lg shadow-md p-3 z-50 min-w-[200px]'>
      <div className='flex items-center space-x-2'>
        {isSaving ? (
          <>
            <Spinner size='small' />
            <span className='text-sm'>Saving...</span>
          </>
        ) : (
          <>
            <div
              className={`w-3 h-3 rounded-full ${hasChanges ? 'bg-yellow-400' : 'bg-green-400'}`}
            />
            <span className='text-sm'>{hasChanges ? 'Unsaved changes' : 'All changes saved'}</span>
          </>
        )}
      </div>
      <div className='text-xs text-gray-500 mt-1'>Last saved: {timeString}</div>
    </div>
  );
};

export default SaveStatus;
