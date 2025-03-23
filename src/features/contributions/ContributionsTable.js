import React, { useMemo } from 'react';
import Table from 'react-bootstrap/Table';

const ContributionsTable = React.memo(({ contributions }) => {
  // Memoize the expensive grouping and calculations
  const { groupedContributions, grandTotal } = useMemo(() => {
    const grouped = contributions.reduce((acc, contribution) => {
      const { category_name } = contribution;
      if (!acc[category_name]) {
        acc[category_name] = {
          total: 0,
          contributions: [],
        };
      }
      acc[category_name].total += contribution.amount;
      acc[category_name].contributions.push(contribution);
      return acc;
    }, {});

    const total = Object.values(grouped).reduce((acc, category) => {
      return acc + category.total;
    }, 0);

    return { groupedContributions: grouped, grandTotal: total };
  }, [contributions]);

  // Create a memoized render of table rows
  const tableContent = useMemo(() => {
    return Object.entries(groupedContributions).map(([category, { total, contributions }]) => (
      <React.Fragment key={category}>
        <tr style={{ backgroundColor: '#f5f5f5' }}>
          <td colSpan={5}>
            <b>{category}</b> (Total: ${total.toFixed(2)})
          </td>
        </tr>
        {contributions.map((contribution) => (
          <tr key={contribution.id}>
            <td></td>
            <td className="text-left">{contribution.member_last_name}</td>
            <td className="text-left">{contribution.date}</td>
            <td className="text-left">{contribution.notes}</td>
            <td className="text-right">
              {new Intl.NumberFormat('en-US', { 
                style: 'currency', 
                currency: 'USD' 
              }).format(contribution.amount)}
            </td>
          </tr>
        ))}
      </React.Fragment>
    ));
  }, [groupedContributions]);

  return (
    <div>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th className="text-left">Category</th>
            <th className="text-left">Member</th>
            <th className="text-left">Date</th>
            <th className="text-left">Note</th>
            <th className="text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {tableContent}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={4} style={{ textAlign: 'right', fontWeight: 'bold' }}>Grand Total: </td>
            <td style={{ textAlign: 'right', fontWeight: 'bold' }}>
              ${grandTotal.toFixed(2)}
            </td>
          </tr>
        </tfoot>
      </Table>
    </div>
  );
});

// Add displayName for better debugging
ContributionsTable.displayName = 'ContributionsTable';

export default ContributionsTable;