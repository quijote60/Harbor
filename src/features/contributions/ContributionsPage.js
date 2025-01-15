import React, { useState, useRef, useMemo } from 'react';
import { useGetContributionsQuery } from './contributionsApiSlice';
import ContributionsTable from './ContributionsTable';
import { useReactToPrint } from 'react-to-print';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const ContributionsPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { items, isLoading, isError, error } = useGetContributionsQuery(
    'contributionsList',
    {
      selectFromResult: ({ data }) => ({
        items: data && Object.values(data.entities),
      }),
    }
  );

  const tableRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => tableRef.current,
  });

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleFilterByDate = () => {
    setShowModal(false);
  };

  const formattedItems = useMemo(() => {
    if (!items) return [];

    // Function to convert date to YYYY-MM-DD format preserving the UTC date
    const formatToLocalDate = (dateString) => {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    };

    // Format the selected date to match the UTC date at midnight
    const selectedLocalDate = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate()
    ).toISOString().split('T')[0];

    const formattedData = items.map((item) => ({
      ...item,
      date: formatToLocalDate(item.date),
    }));

    return selectedDate
      ? formattedData.filter((item) => item.date === selectedLocalDate)
      : formattedData;
  }, [items, selectedDate]);

  if (isLoading) {
    return <div className="container mt-4">Loading contributions...</div>;
  }

  if (isError) {
    return (
      <div className="container mt-4">
        Error fetching contributions: {error.message || 'An unknown error occurred.'}
      </div>
    );
  }

  // Format display date in local timezone
  const displayDate = selectedDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });

  return (
    <div className="container py-4" style={{ minHeight: '80vh', position: 'relative' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <button 
          className="btn btn-primary" 
          style={{marginTop:"80px", zIndex:999}}
          onClick={() => setShowModal(true)}
        >
          Filter by Date
        </button>
      </div>

      {showModal && (
        <>
          <div 
            className="modal-backdrop"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 1040
            }}
            onClick={() => setShowModal(false)}
          />
          <div
            className="modal show d-block"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 1050,
              overflow: 'hidden'
            }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Filter Contributions</h5>
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => setShowModal(false)}
                  />
                </div>
                <div className="modal-body">
                  <DatePicker
                    selected={selectedDate}
                    onChange={handleDateChange}
                    className="form-control"
                    dateFormat="MM/dd/yyyy"
                    shouldCloseOnSelect={false}
                  />
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-primary" 
                    onClick={handleFilterByDate}
                  >
                    Filter
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <div>
        {formattedItems.length > 0 ? (
          <div>
            <h1 className="mb-4">
              Contributions for {displayDate}
            </h1>
            <div ref={tableRef} className="mb-4" style={{ minHeight: '200px' }}>
              <ContributionsTable contributions={formattedItems} />
            </div>          
            <button 
              className="btn btn-secondary" 
              onClick={handlePrint}
            >
              Print Contributions Table
            </button>
          </div>
        ) : (
          <div className="alert alert-info">
            No contributions found for {displayDate}.
          </div>
        )}
      </div>
    </div>
  );
};

export default ContributionsPage;