// Backup and restore utilities for NEET PG Prep

export interface BackupData {
  version: string;
  exportDate: string;
  userProfile: any;
  answeredQuestions: any[];
  metadata: {
    totalQuestions: number;
    exportedBy: string;
  };
}

// Export all data to JSON file
export function exportData(): void {
  if (typeof window === 'undefined') return;

  try {
    // Gather all data from localStorage
    const userProfile = localStorage.getItem('userProfile');
    const answeredQuestions = localStorage.getItem('answeredQuestions');

    const backupData: BackupData = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      userProfile: userProfile ? JSON.parse(userProfile) : null,
      answeredQuestions: answeredQuestions ? JSON.parse(answeredQuestions) : [],
      metadata: {
        totalQuestions: answeredQuestions ? JSON.parse(answeredQuestions).length : 0,
        exportedBy: userProfile ? JSON.parse(userProfile).name : 'User',
      },
    };

    // Create blob and download
    const blob = new Blob([JSON.stringify(backupData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const date = new Date().toISOString().split('T')[0];
    link.href = url;
    link.download = `neet-prep-backup-${date}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error exporting data:', error);
    throw new Error('Failed to export data. Please try again.');
  }
}

// Import data from JSON file
export function importData(file: File): Promise<BackupData> {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No file selected'));
      return;
    }

    if (file.type !== 'application/json') {
      reject(new Error('Invalid file type. Please select a JSON file.'));
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const backupData: BackupData = JSON.parse(content);

        // Validate backup data structure
        if (!backupData.version || !backupData.exportDate) {
          reject(new Error('Invalid backup file format.'));
          return;
        }

        // Restore data to localStorage
        if (backupData.userProfile) {
          localStorage.setItem('userProfile', JSON.stringify(backupData.userProfile));
        }

        if (backupData.answeredQuestions) {
          localStorage.setItem('answeredQuestions', JSON.stringify(backupData.answeredQuestions));
        }

        resolve(backupData);
      } catch (error) {
        reject(new Error('Failed to parse backup file. File may be corrupted.'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file.'));
    };

    reader.readAsText(file);
  });
}

// Get last backup date from localStorage
export function getLastBackupDate(): string | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const lastBackup = localStorage.getItem('lastBackupDate');
    return lastBackup;
  } catch (error) {
    return null;
  }
}

// Save last backup date
export function saveLastBackupDate(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('lastBackupDate', new Date().toISOString());
  } catch (error) {
    console.error('Error saving backup date:', error);
  }
}

// Clear all data (for testing or reset)
export function clearAllData(): void {
  if (typeof window === 'undefined') return;
  
  if (confirm('Are you sure you want to clear ALL data? This cannot be undone!')) {
    localStorage.removeItem('userProfile');
    localStorage.removeItem('answeredQuestions');
    localStorage.removeItem('lastBackupDate');
    window.location.reload();
  }
}

