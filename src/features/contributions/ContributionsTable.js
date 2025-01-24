import React from 'react';
import Table from 'react-bootstrap/Table';

const ContributionsTable = ({ contributions }) => {
  const groupedContributions = contributions.reduce((acc, contribution) => {
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

  const grandTotal = Object.values(groupedContributions).reduce((acc, category) => {
    return acc + category.total;
  }, 0);

  return (
    <div>
    
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th class="text-left">Category</th>
            <th class="text-left">Member</th>
            <th class="text-left">Date</th>
            <th class="text-left">Note</th>
            <th class="text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(groupedContributions).map(([category, { total, contributions }]) => (
            <React.Fragment key={category}>
              <tr style={{ backgroundColor: '#f5f5f5' }}> {/* Optional category row styling */}
                <td colSpan={5}>
                  <b>{category}</b> (Total: ${total.toFixed(2)})
                </td>
              </tr>
              {contributions.map((contribution) => (
                <tr key={contribution.id}>
                  <td></td>
                  <td class="text-left"> {contribution.member_last_name}</td>
                  <td class="text-left">{contribution.date}</td>
                  <td class="text-left">{contribution.note}</td>
                  <td class="text-right">{contribution.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td> {/* Using currency formatter */}
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={4} style={{ textAlign: 'right', fontWeight: 'bold' }}>Grand Total: </td>
            <td style={{ textAlign: 'right', fontWeight: 'bold' }}>${grandTotal.toFixed(2)}</td>
          </tr>
        </tfoot>
      </Table>
    </div>
  );
};

export default ContributionsTable;