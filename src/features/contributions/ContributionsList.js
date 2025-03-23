import React from 'react';
import { useGetContributionsQuery } from "./contributionsApiSlice";
import Contribution from './Contribution';
import { Table, Container, Card } from 'react-bootstrap';
import useTitle from "../../hooks/useTitle";
import PulseLoader from 'react-spinners/PulseLoader';
import { toast } from 'react-toastify';

const ContributionsList = () => {
  useTitle('Harbor Bible: Contributions List');

  const {
    data: contributions,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetContributionsQuery('contributionsList', {
    pollingInterval: 15000, // Reduced to 15 seconds for faster updates
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  React.useEffect(() => {
    if (isError) {
      toast.error(error?.data?.message || 'Failed to load contributions');
    }
  }, [isError, error]);

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
              {error?.data?.message || 'Failed to load contributions'}
            </div>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  if (isSuccess) {
    const { ids, entities } = contributions;

    const date = new Date();
    const dateWithoutTime = date.toISOString().split('T')[0];

    const filteredIds = ids.filter((contributionId) => {
      const contributionDate = new Date(entities[contributionId].createdAt)
        .toISOString()
        .split('T')[0];
      return contributionDate === dateWithoutTime;
    });

    const tableContent = filteredIds.length
      ? filteredIds.map((contributionId) => (
          <Contribution
            key={contributionId}
            contributionId={contributionId}
            contribution={entities[contributionId]} // Pass the contribution data as a prop
          />
        ))
      : (
          <tr>
            <td colSpan="8" className="text-center py-4">
              No contributions found for today
            </td>
          </tr>
        );

    return (
      <Container fluid className="py-5 mt-4">
        <Card className="shadow">
          <Card.Body className="p-md-4 p-3">
            <div className="table-responsive" style={{ position: 'relative', zIndex: 2 }}>
              <Table striped bordered hover className="mb-0 mobile-table">
                <thead className="bg-light">
                  <tr>
                    <th className="py-3">Created</th>
                    <th className="py-3">Updated</th>
                    <th className="py-3">Member ID</th>
                    <th className="py-3">Member Last Name</th>
                    <th className="py-3">Category Name</th>
                    <th className="py-3">Notes</th>
                    <th className="py-3">Amount</th>
                    <th className="py-3" style={{ width: '100px', position: 'relative', zIndex: 3 }}>
                      Edit
                    </th>
                  </tr>
                </thead>
                <tbody>{tableContent}</tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return null;
};

export default ContributionsList;