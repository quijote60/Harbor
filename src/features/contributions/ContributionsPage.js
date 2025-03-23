import React, { useState, useRef, useMemo, useCallback } from 'react';
import { useGetContributionsQuery } from './contributionsApiSlice';
import ContributionsTable from './ContributionsTable';
import { useReactToPrint } from 'react-to-print';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const ContributionsPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const printRef = useRef();
  
  // Optimize the query to only fetch what we need
  const { data, isLoading, isError, error } = useGetContributionsQuery('contributionsList', {
    selectFromResult: ({ data, isLoading, isError, error }) => ({
      data,  // Return the whole data object
      isLoading,
      isError,
      error
    }),
  });

  // Memoize the print handler
  const handlePrint = useCallback(useReactToPrint({
    content: () => printRef.current
  }), [printRef]);

  const handleDateChange = useCallback((date) => {
    setSelectedDate(date);
  }, []);

  const handleFilterByDate = useCallback(() => {
    setShowModal(false);
  }, []);

  // Optimize data processing with useMemo
  const formattedItems = useMemo(() => {
    // First check if data exists at all
    if (!data || !data.entities) return [];
    
    // Get the items from data.entities
    const items = Object.values(data.entities);
    
    if (items.length === 0) return [];
  
    // Pre-compute the selected date string once
    const selectedLocalDate = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate()
    ).toISOString().split('T')[0];

    // Process and filter in a single pass
    return items
    .filter(item => {
      const itemDate = new Date(item.date).toISOString().split('T')[0];
      return itemDate === selectedLocalDate;
    })
    .map(item => ({
      ...item,
      date: new Date(item.date).toISOString().split('T')[0]
    }));
}, [data, selectedDate]);

  // Memoize the display date to prevent unnecessary recalculations
  const displayDate = useMemo(() => {
    return selectedDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  }, [selectedDate]);

  if (isLoading) {
    return <div className="container mt-4">Loading contributions...</div>;
  }

  if (isError) {
    return (
      <div className="container mt-4">
        Error fetching contributions: {error?.message || 'An unknown error occurred.'}
      </div>
    );
  }

  // Separate modal into its own component to reduce render complexity
  const FilterModal = () => (
    showModal && (
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
    )
  );

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

      <FilterModal />

      <div>
        {formattedItems.length > 0 ? (
          <>
            <div className='print-container' ref={printRef}>
              <h1 className="mb-4 title-report">
                Contributions for {displayDate}
              </h1>
              <div className="mb-4" style={{ minHeight: '200px' }}>
                <ContributionsTable contributions={formattedItems} />
              </div>  
              <div className='signature'>
                <h3>Signature counter 1: </h3>
                <h3>Signature counter 2: </h3>
              </div>  
            </div>     
            <button 
              className="btn btn-primary" 
              onClick={handlePrint}
            >
              Print Contributions Table
            </button>
          </>
        ) : (
          <div className="alert alert-info">
            No contributions found for {displayDate}.
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(ContributionsPage);