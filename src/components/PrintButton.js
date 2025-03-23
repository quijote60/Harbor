import React from 'react';


const PrintButton = () => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <style>
        {`
          @media print {
            .btn-print, .tax-button {
              display: none !important;
            }
            body {
              padding: 20px !important;
              margin: 0 !important;
              background: white !important;
            }
            .container {
              width: 100% !important;
              max-width: none !important;
              padding: 0 !important;
              margin: 0 !important;
            }
            .modal {
              display: none !important;
            }
          }
        `}
      </style>
      <button 
        onClick={handlePrint}
        className="btn btn-secondary btn-print me-2"
        style={{ zIndex: 999 }}
      >
        Print Report
      </button>
    </>
  );
};

export default PrintButton;