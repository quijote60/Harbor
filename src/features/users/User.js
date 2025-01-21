import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from 'react-router-dom'
import { useGetUsersQuery } from './usersApiSlice'
import { memo } from 'react'
import { Container, Row, Col, Card, CardBody, InputGroup, Button, Badge } from 'react-bootstrap';


const User = ({ userId }) => {
    const { user } = useGetUsersQuery('usersList', {
      selectFromResult: ({ data }) => ({
        user: data?.entities[userId]
      }),
    });
    const navigate = useNavigate();
  
    if (!user) return null;
  
    //const created = new Date(user.createdAt).toLocaleString('en-US', { day: 'numeric', month: 'long' });
    //const updated = new Date(user.updatedAt).toLocaleString('en-US', { day: 'numeric', month: 'long' });
    const handleEdit = () => navigate(`/dash/users/${userId}`);
  console.log(user);
    // Apply inactive styling if user is not active
    const rowClassName = `align-middle ${!user.active ? 'table-secondary' : ''}`;
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? '-' : 
          date.toLocaleString('en-US', { 
            day: 'numeric', 
            month: 'long',
            year: 'numeric'
          });
      };
  
    return (
      <tr className={rowClassName}>
        <td className="py-3">{formatDate(user.createdAt)}</td>
        <td className="py-3">{formatDate(user.updatedAt)}</td>
        <td className="py-3">{user.username}</td>
        <td className="py-3">
          {user.roles.map(role => (
            <Badge 
              key={role} 
              bg="secondary" 
              className="me-1"
            >
              {role}
            </Badge>
          ))}
        </td>
        <td className="py-3 text-center">
          <Badge 
            bg={user.active ? "success" : "danger"}
          >
            {user.active ? "Yes" : "No"}
          </Badge>
        </td>
        <td className="py-3 text-center" style={{ position: 'relative', zIndex: 3 }}>
          <Button
            variant="light"
            size="sm"
            onClick={handleEdit}
            className="rounded-circle p-2"
            title="Edit user"
            style={{ position: 'relative', zIndex: 4 }}
          >
            <FontAwesomeIcon 
              icon={faPenToSquare} 
              className="text-primary"
            />
          </Button>
        </td>
      </tr>
    );
  };
  
  const memoizedUser = memo(User);
  export default memoizedUser;