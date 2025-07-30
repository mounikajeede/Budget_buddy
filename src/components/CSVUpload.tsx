import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { X, Upload, FileText, AlertCircle } from 'lucide-react';
import { useBudget } from '../contexts/BudgetContext';
import Papa from 'papaparse';
import toast from 'react-hot-toast';

interface CSVUploadProps {
  onClose: () => void;
}

const CSVUpload: React.FC<CSVUploadProps> = ({ onClose }) => {
  const { importTransactions } = useBudget();
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewData, setPreviewData] = useState<any[]>([]);

  const processCSV = useCallback((file: File) => {
    setIsProcessing(true);
    
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        try {
          const transactions = results.data
            .filter((row: any) => row.amount && row.description)
            .map((row: any) => ({
              amount: Math.abs(parseFloat(row.amount)),
              category: row.category || 'Other',
              description: row.description || 'Imported transaction',
              date: row.date ? new Date(row.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
              type: parseFloat(row.amount) >= 0 ? 'income' : 'expense',
            }));

          if (transactions.length === 0) {
            toast.error('No valid transactions found in CSV file');
            setIsProcessing(false);
            return;
          }

          setPreviewData(transactions.slice(0, 5)); // Show first 5 for preview
          
          // Auto-import after a brief preview
          setTimeout(() => {
            importTransactions(transactions);
            toast.success(`Successfully imported ${transactions.length} transactions!`);
            onClose();
          }, 2000);

        } catch (error) {
          toast.error('Error processing CSV file');
          setIsProcessing(false);
        }
      },
      error: (error) => {
        toast.error('Error reading CSV file');
        setIsProcessing(false);
      },
    });
  }, [importTransactions, onClose]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const csvFile = files.find(file => file.type === 'text/csv' || file.name.endsWith('.csv'));
    
    if (csvFile) {
      processCSV(csvFile);
    } else {
      toast.error('Please upload a CSV file');
    }
  }, [processCSV]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processCSV(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-lg"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Import CSV Transactions
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isProcessing && previewData.length === 0 && (
          <>
            <div
              onDrop={handleDrop}
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                isDragOver 
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                  : 'border-gray-300 dark:border-gray-600'
              }`}
            >
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Upload CSV File
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Drag and drop your CSV file here, or click to browse
              </p>
              
              <input
                type="file"
                accept=".csv"
                onChange={handleFileInput}
                className="hidden"
                id="csv-upload"
              />
              <label
                htmlFor="csv-upload"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
              >
                <FileText className="w-4 h-4" />
                Choose File
              </label>
            </div>

            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                    CSV Format Requirements
                  </h4>
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    Your CSV should include columns: amount, description, category, date
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {isProcessing && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Processing CSV File...
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Please wait while we import your transactions
            </p>
          </div>
        )}

        {previewData.length > 0 && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Preview (First 5 transactions)
            </h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {previewData.map((transaction, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {transaction.description}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {transaction.category}
                    </p>
                  </div>
                  <div className={`font-semibold ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}${transaction.amount}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-4 text-center">
              Importing transactions automatically...
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default CSVUpload;