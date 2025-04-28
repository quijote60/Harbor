import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useGetContributionsQuery } from "./contributionsApiSlice";
import Contribution from './Contribution';
import { Table, Container, Card } from 'react-bootstrap';
import useTitle from "../../hooks/useTitle";
import PulseLoader from 'react-spinners/PulseLoader';
import { toast } from 'react-toastify';

const ContributionsList = ({ pollingPaused = false }) => {
  useTitle('Harbor Bible: Contributions List');
  const [isFocused, setIsFocused] = useState(document.hasFocus());
  const [todayDate] = useState(() => new Date().toISOString().split('T')[0]); // Memoize today's date

  const pollingInterval = pollingPaused ? 0 : (isFocused ? 15000 : 45000);

  const {
    data: contributions,
    isLoading,
    isSuccess,
    isError,
    error,
    refetch
  } = useGetContributionsQuery('contributionsList', {
    pollingInterval,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,
  });

  // Handle focus/blur events with debouncing
  useEffect(() => {
    let timeoutId;
    const handleFocus = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => setIsFocused(true), 300);
    };
    const handleBlur = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => setIsFocused(false), 300);
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
      clearTimeout(timeoutId);
    };
  }, []);

  // Memoize the refresh function with debouncing
  const refreshData = useCallback(() => {
    if (!isFocused) return;
    refetch();
  }, [refetch, isFocused]);

  // Optimize filtering and rendering of contributions
  const filteredContributions = useMemo(() => {
    if (!contributions?.ids || !contributions?.entities) return [];
    
    // Pre-filter the IDs first
    const filteredIds = contributions.ids.filter(contributionId => {
      const contribution = contributions.entities[contributionId];
      if (!contribution) return false;
      if (contributionId.startsWith('temp-')) return true;
      
      const contributionDate = contribution.createdAt?.split('T')[0];
      return contributionDate === todayDate;
    });

    // Only map the filtered IDs to components
    return filteredIds.map(contributionId => (
      <Contribution
        key={contributionId}
        contributionId={contributionId}
        contribution={contributions.entities[contributionId]}
      />
    ));
  }, [contributions, todayDate]);

  // Handle errors with debouncing
  useEffect(() => {
    let timeoutId;
    if (isError) {
      timeoutId = setTimeout(() => {
        toast.error(error?.data?.message || 'Failed to load contributions');
      }, 300);
    }
    return () => clearTimeout(timeoutId);
  }, [isError, error]);

  if (isLoading) {
    return (
      <Container fluid className="mt-5 py-3">
        <Card className="shadow">
          <Card.Body className="p-md-4 p-3 text-center">
            <PulseLoader color={"#0d6efd"} size={12} speedMultiplier={0.7} />
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <Container fluid className="mt-5 py-3">
      <Card className="shadow">
        <Card.Body className="p-md-4 p-3">
          <div className="table-responsive">
            <Table hover className="align-middle">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Member ID</th>
                  <th>Last Name</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Notes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredContributions.length ? (
                  filteredContributions
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-4">
                      No contributions found for today
                      <button 
                        className="btn btn-sm btn-outline-primary ms-3" 
                        onClick={refreshData}
                        disabled={!isFocused}
                      >
                        Refresh
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

// Prevent unnecessary re-renders
export default React.memo(ContributionsList);