import React, { useState, useRef, useMemo, useCallback } from 'react';
import { useGetContributionsQuery } from './contributionsApiSlice';
import ContributionsTable from './ContributionsTable';
import ContributionTaxTable from './ContributionTaxTable';
import { useReactToPrint } from 'react-to-print';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import PrintButton from '../../components/PrintButton';

const ContributionTax = ({ members = [], categories = [] }) => {
    const [searchParams, setSearchParams] = useState({
      memberId: '',
      dateFrom: '',
      dateTo: '',
    });
  
    const [sortField, setSortField] = useState('date');
    const [sortDirection, setSortDirection] = useState('desc');
    
    const {
      data: contributions,
      isLoading,
      isError,
      error
    } = useGetContributionsQuery('contributionsList');
  
    const [showModal, setShowModal] = useState(false);
  
    const today = new Date().toISOString().split('T')[0];
    // Memoized options for the member dropdown
    const memberOptions = useMemo(() => {
      if (!members || members.length === 0) {
        return [<option key="empty" value="">No members available</option>];
      }
  
      return [
        <option key="all" value="">All Members</option>,
        ...members
          .sort((a, b) => a.member_id - b.member_id)
          .map((member) => (
            <option key={member._id} value={member._id}>
              {member.member_id} - {member.last_name}
            </option>
          ))
      ];
    }, [members]);
  
    // Handle input changes
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setSearchParams(prev => ({
        ...prev,
        [name]: value
      }));
    };
  
    // Handle sorting
    const handleSort = useCallback((field) => {
      if (sortField === field) {
        setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
      } else {
        setSortField(field);
        setSortDirection('asc');
      }
    }, [sortField]);
  
    // Filter contributions based on selected criteria
    const getFilteredContributions = useCallback(() => {
      if (!contributions?.ids || !contributions?.entities) {
        return [];
      }
  
      let filtered = contributions.ids.map(id => contributions.entities[id]);
  
      // Filter by member ID (using MongoDB ObjectID)
      if (searchParams.memberId) {
        filtered = filtered.filter(contribution => {
          return contribution.member === searchParams.memberId;
        });
      }
  
      // Filter by date range
      if (searchParams.dateFrom || searchParams.dateTo) {
        filtered = filtered.filter(contribution => {
          const contributionDate = new Date(contribution.date);
          contributionDate.setHours(0, 0, 0, 0);
  
          if (searchParams.dateFrom) {
            const fromDate = new Date(searchParams.dateFrom);
            fromDate.setHours(0, 0, 0, 0);
            if (contributionDate < fromDate) return false;
          }
  
          if (searchParams.dateTo) {
            const toDate = new Date(searchParams.dateTo);
            toDate.setHours(23, 59, 59, 999);
            if (contributionDate > toDate) return false;
          }
  
          return true;
        });
      }
  
      // Sort the filtered results
      return filtered.sort((a, b) => {
        let compareResult = 0;
        switch (sortField) {
          case 'date':
            compareResult = new Date(a.date) - new Date(b.date);
            break;
          case 'member':
            const memberA = members.find(m => m._id === a.member)?.last_name || '';
            const memberB = members.find(m => m._id === b.member)?.last_name || '';
            compareResult = memberA.localeCompare(memberB);
            break;
          default:
            break;
        }
        return sortDirection === 'asc' ? compareResult : -compareResult;
      });
    }, [contributions, searchParams, sortField, sortDirection, members]);
  
    const filteredContributions = getFilteredContributions();
  
    const handleFilterByDate = () => {
      setShowModal(false);
    };
  
    if (isLoading) {
      return <div>Loading...</div>;
    }
  
    if (isError) {
      return <div>Error: {error.message}</div>;
    }

    
  
    return (
      <div className="container py-4" style={{ minHeight: '80vh', position: 'relative' }}>
       
        <div className="row">
        <div className="col">
          <PrintButton />
          <button
            className="btn btn-primary tax-button"
            style={{ zIndex: 999 }}
            onClick={() => setShowModal(true)}
          >
            Filter by Date Range and Member
          </button>
        </div>
        </div>
      <div className="row mb-2">

        <div className="col">
          <h1 className="title-tax">Harbor Bible Fellowship Church Giving Statement</h1>
          <h3 className="title-subtax">(Please retain for your records)</h3>
        </div>
      </div>
      <div className="row mb-2">
        <div className="col">
          <h3 className="title-taxmember">
            Name: {members.find(m => m._id === searchParams.memberId)?.first_name} {members.find(m => m._id === searchParams.memberId)?.last_name}<br/>
            Address: {members.find(m => m._id === searchParams.memberId)?.address}<br/>
            Giving number: {members.find(m => m._id === searchParams.memberId)?.member_id}
          </h3>
        </div>
      </div>
      
    
    
   
        {showModal && (
          <div className="modal show d-block">
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
                  <div className="form-group mb-3">
                    <label htmlFor="memberId">Member</label>
                    <select
                      className="form-control"
                      id="memberId"
                      name="memberId"
                      value={searchParams.memberId}
                      onChange={handleInputChange}
                    >
                      {memberOptions}
                    </select>
                  </div>
                  <div className="form-group mb-3">
                    <label htmlFor="dateFrom">Date From</label>
                    <input 
                      type="date" 
                      className="form-control"
                      id="dateFrom"
                      name="dateFrom" 
                      value={searchParams.dateFrom} 
                      onChange={handleInputChange} 
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label htmlFor="dateTo">Date To</label>
                    <input 
                      type="date" 
                      className="form-control"
                      id="dateTo"
                      name="dateTo" 
                      value={searchParams.dateTo} 
                      onChange={handleInputChange} 
                    />
                  </div>
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
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
  
        <ContributionTaxTable 
          contributions={filteredContributions}
          onSort={handleSort}
          sortField={sortField}
          sortDirection={sortDirection}
        />
        <div div className="footer-tax">
  <p>The Church record of your individual and total contributions for the year is shown above. Thank you for supporting the work of the LORD.</p>
  <p>No gifts were sent to or received by the donor in consideration for their contributions.</p>
  <br />
  <div className="signature-area">
    <div className="treasurer-label">Contributions Treasurer:</div>
    <div className="signature-wrapper">
      <div className="signature-line"></div>
      <div className="signature-name">Jose Padilla</div>
     
    </div>
    <div className="date-wrapper">
      <div className="date-label">Date: {today}</div>
      
    </div>
    
  </div>
  <br />
  <div className='church'>
      <h5> Harbor Bible Fellowship Church</h5>
      <h5>1 Matawan Road.</h5>
      <h5>Laurance Harbor, NJ 08879</h5>
      <h5>Phone: (732) 583-9286</h5>
    </div>
        </div>
        </div>

      
    );
  };
  
  
  export default ContributionTax;