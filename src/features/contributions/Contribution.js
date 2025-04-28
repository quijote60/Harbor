import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from 'react-router-dom';
import { memo } from 'react';
import { Button } from 'react-bootstrap';

const Contribution = ({ contributionId, contribution }) => {
  const navigate = useNavigate();

  if (!contribution) return null;

  const created = new Date(contribution.createdAt).toLocaleString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const updated = new Date(contribution.updatedAt).toLocaleString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const handleEdit = () => navigate(`/dash/contributions/${contributionId}`);

  return (
    <tr className="align-middle">
      <td data-label="Created" className="py-3">{created}</td>
      <td data-label="Member ID" className="py-3">{contribution.member_id}</td>
      <td data-label="Last Name" className="py-3">{contribution.member_last_name}</td>
      <td data-label="Category" className="py-3">{contribution.category_name}</td>
      <td data-label="Amount" className="py-3">
        ${Number(contribution.amount).toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </td>
      <td data-label="Notes" className="py-3">{contribution.notes}</td>
      
      <td className="py-3 text-center">
        <Button
          variant="light"
          size="sm"
          onClick={handleEdit}
          className="rounded-circle p-2"
          title="Edit contribution"
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

export default memo(Contribution);