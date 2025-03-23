import { useGetMembersQuery } from "./membersApiSlice"
import Member from './Member'
import Table from 'react-bootstrap/Table';
import useTitle from "../../hooks/useTitle"
import PulseLoader from 'react-spinners/PulseLoader'
import { Container, Row, Col, Card, CardBody, InputGroup, Button } from 'react-bootstrap';
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';

const MembersList = () => {
  useTitle('Harbor Bible: Members List');

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: null,
  });

  const {
    data: members,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetMembersQuery('membersList', {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  const handleSort = (key) => {
    console.log('Sorting by:', key);
    setSortConfig((prevSort) => {
      const newDirection =
        prevSort.key === key && prevSort.direction === 'asc'
          ? 'desc'
          : 'asc';
      console.log('New sort direction:', newDirection);
      return {
        key,
        direction: newDirection,
      };
    });
  };

  const getSortClass = (columnKey) => {
    if (sortConfig.key !== columnKey) return 'sort-none';
    return sortConfig.direction === 'asc' ? 'sort-asc' : 'sort-desc';
  };

  if (isLoading) {
    return (
      <Container fluid className="py-5 mt-4">
        <Card className="shadow" style={{ position: 'relative', zIndex: 1 }}>
          <Card.Body className="p-md-4 p-3 text-center">
            <PulseLoader color={"#0d6efd"} />
          </Card.Body>
        </Card>
      </Container>
    );
  }

  if (isError) {
    return (
      <Container fluid className="py-5 mt-4">
        <Card className="shadow" style={{ position: 'relative', zIndex: 1 }}>
          <Card.Body className="p-md-4 p-3">
            <div className="alert alert-danger mb-0" role="alert">
              {error?.data?.message}
            </div>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  if (isSuccess) {
    const { ids, entities } = members;

    // Sort the ids array based on sortConfig
    const sortedIds = [...ids].sort((a, b) => {
      if (!sortConfig.key) return 0;

      const memberA = entities[a];
      const memberB = entities[b];

      const aValue = memberA[sortConfig.key];
      const bValue = memberB[sortConfig.key];

      if (sortConfig.key === 'member_id') {
        // Compare member IDs as numbers
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      } else if (sortConfig.key === 'last_name') {
        // Compare last names alphabetically
        return sortConfig.direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return 0; // Handle other columns (if applicable)
    });

    const tableContent = sortedIds?.length
      ? sortedIds.map((memberId) => (
          <Member key={memberId} memberId={memberId} />
        ))
      : (
          <tr>
            <td colSpan="11" className="text-center py-4">
              No members found
            </td>
          </tr>
        );

    return (
      <>
        
        <Container fluid className="py-3 mt-4">
          <Card className="shadow">
            <Card.Body className="p-md-4 p-3">
              <button onClick={() => window.print()} className="btn btn-primary mb-3">
                Print Table
              </button>
              <div className="table-responsive" style={{ position: 'relative', zIndex: 2 }}>
                <div className="printable-table">
                  <Table striped bordered hover className="mb-0 mobile-table">
                    <thead className="bg-light">
                      <tr>
                        <th className="py-3">Created</th>
                        <th className="py-3">Updated</th>
                        <th 
                          className={`py-3 px-4 sortable-header ${getSortClass('member_id')}`} 
                          onClick={() => handleSort('member_id')} 
                          role="button"
                        >
                          <span>Member ID</span>
                          <div className="sort-icon">
                            {sortConfig.key === 'member_id' && (
                              sortConfig.direction === 'asc' ? (
                                <FontAwesomeIcon icon={faSortUp} />
                              ) : (
                                <FontAwesomeIcon icon={faSortDown} />
                              )
                            )}
                          </div>
                        </th>
                        <th className="py-3">First Name</th>
                        <th 
                          className={`py-3 px-4 sortable-header ${getSortClass('last_name')}`} 
                          onClick={() => handleSort('last_name')} 
                          role="button"
                        >
                          <span>Last Name</span>
                          <div className="sort-icon">
                            {sortConfig.key === 'last_name' && (
                              sortConfig.direction === 'asc' ? (
                                <FontAwesomeIcon icon={faSortUp} />
                              ) : (
                                <FontAwesomeIcon icon={faSortDown} />
                              )
                            )}
                          </div>
                        </th>
                        <th className="py-3">Address</th>
                        <th className="py-3">City</th>
                        <th className="py-3">State</th>
                        <th className="py-3">Zip Code</th>
                        <th className="py-3">Email</th>
                        <th className="py-3 edit-column " style={{ width: '100px', position: 'relative', zIndex: 3 }}>Edit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableContent}
                    </tbody>
                  </Table>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Container>
      </>
    );
  }

  return null;
};

export default MembersList;