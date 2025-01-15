import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from 'react-router-dom'
import { useGetMembersQuery } from './membersApiSlice'
import { memo } from 'react'
import Button from 'react-bootstrap/Table'; 

const Member = ({ memberId }) => {

    const {member} = useGetMembersQuery('membersList',{
        selectFromResult: ({data}) => ({
            member: data?.entities[memberId]
        }),
    })

    const navigate = useNavigate()

    if (!member) return null;

   
    const created = new Date(member.createdAt).toLocaleString('en-US', { 
      day: 'numeric', 
      month: 'short',
      year: 'numeric' 
    });
    const updated = new Date(member.updatedAt).toLocaleString('en-US', { 
      day: 'numeric', 
      month: 'short',
      year: 'numeric' 
    });
        const handleEdit = () => {
            navigate(`/dash/members/${memberId}`); 
        };

        return (
           
            <tr  className="align-middle">
                
                <td data-label="Created">{created}</td>
      <td data-label="Updated">{updated}</td>
      <td data-label="Member ID">{member.member_id}</td>
      <td data-label="First Name">{member.first_name}</td>
      <td data-label="Last Name">{member.last_name}</td>
      <td data-label="Address">{member.address}</td>
      <td data-label="City">{member.city}</td>
      <td data-label="State">{member.state}</td>
      <td data-label="Zip Code">{member.zip_code}</td>
      <td className="text-center">
        <Button
          variant="light"
          size="sm"
          onClick={handleEdit}
          className="rounded-circle p-2"
          title="Edit member"
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

export default Member