import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

const SimpleTable = () => {
  const tableRef = useRef();

  // Setup for printing the table
  const handlePrint = useReactToPrint({
    content: () => tableRef.current,
  });

  return (
    <div>
      {/* Print Button */}
      <button
        onClick={handlePrint}
        style={{
          marginTop: '80px',  // Adjust this value to push the button down (make sure it’s below the navbar)
          padding: '8px 16px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          position: 'relative',
          zIndex: 10, // Ensure the button is above other elements if necessary
        }}
      >
        Print Table
      </button>

      {/* Table Content */}
      <div ref={tableRef} style={{ padding: '20px', backgroundColor: 'white' }}>
        <h1>Test Table</h1>
        <table style={{ width: '100%', border: '1px solid #ddd', marginTop: '20px' }}>
          <thead>
            <tr>
              <th>Category</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Category 1</td>
              <td>$100</td>
            </tr>
            <tr>
              <td>Category 2</td>
              <td>$200</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SimpleTable;