import { useGetUsersQuery } from "./usersApiSlice"
import User from './User'
import Table from 'react-bootstrap/Table';
import useTitle from "../../hooks/useTitle"
import PulseLoader from 'react-spinners/PulseLoader'
import { Container, Row, Col, Card, CardBody, InputGroup, Button } from 'react-bootstrap';

const UsersList = () => {
    useTitle('Harbor Bible: Counters List');
    const {
      data: users,
      isLoading,
      isSuccess,
      isError,
      error
    } = useGetUsersQuery(undefined, {
      pollingInterval: 60000,
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true
    });
  
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
      const { ids } = users;
  
      const tableContent = ids?.length ? (
        ids.map(userId => <User key={userId} userId={userId} />)
      ) : (
        <tr>
          <td colSpan="6" className="text-center py-4">No users found</td>
        </tr>
      );
  
      return (
        <Container fluid className="py-5 mt-4">
          <Card className="shadow">
            <Card.Body className="p-md-4 p-3">
              <div className="table-responsive" style={{ position: 'relative', zIndex: 2 }}>
                <Table striped bordered hover className="mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th className="py-3">Created</th>
                      <th className="py-3">Updated</th>
                      <th className="py-3">Username</th>
                      <th className="py-3">Roles</th>
                      <th className="py-3">Active</th>
                      <th className="py-3" style={{ width: '100px', position: 'relative', zIndex: 3 }}>Edit</th>
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
  
  export default UsersList;