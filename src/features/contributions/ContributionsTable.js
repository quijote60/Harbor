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
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Category</th>
            <th>Member</th>
            <th>Date</th>
            <th>Note</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(groupedContributions).map(([category, { total, contributions }]) => (
            <React.Fragment key={category}>
              <tr>
                <td colSpan={5}>
                  <b>{category}</b> (Total: ${total.toFixed(2)})
                </td>
              </tr>
              {contributions.map((contribution) => (
                <tr key={contribution.id}>
                  <td></td>
                  <td>{contribution.member_last_name}</td>
                  <td>{contribution.date}</td>
                  <td>{contribution.note}</td>
                  <td>${contribution.amount.toFixed(2)}</td>
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={4}><b>Grand Total</b></td>
            <td>${grandTotal.toFixed(2)}</td>
          </tr>
        </tfoot>
      </Table>
    </div>
  );
};

export default ContributionsTable;