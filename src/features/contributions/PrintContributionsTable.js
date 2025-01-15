import React from 'react';

const PrintContributionsTable = ({ contributions }) => {
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
    <div 
      style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        width: '100%', 
        zIndex: 9999 
      }} 
    > 
    <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}> 
      <thead>
        <tr>
          <th style={{ border: '1px solid #ddd', padding: '8px' }}>Category</th>
          <th style={{ border: '1px solid #ddd', padding: '8px' }}>Member</th>
          <th style={{ border: '1px solid #ddd', padding: '8px' }}>Date</th>
          <th style={{ border: '1px solid #ddd', padding: '8px' }}>Note</th>
          <th style={{ border: '1px solid #ddd', padding: '8px' }}>Amount</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(groupedContributions).map(([category, { total, contributions }]) => (
          <React.Fragment key={category}>
            <tr>
              <td colSpan={5} style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>
                {category} (Total: ${total.toFixed(2)})
              </td>
            </tr>
            {contributions.map((contribution) => (
              <tr key={contribution.id}>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}></td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{contribution.member_last_name}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{contribution.date}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{contribution.note}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>${contribution.amount.toFixed(2)}</td>
              </tr>
            ))}
          </React.Fragment>
        ))}
      </tbody>
      <tfoot>
        <tr>
          <td colSpan={4} style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>Grand Total</td>
          <td style={{ border: '1px solid #ddd', padding: '8px' }}>${grandTotal.toFixed(2)}</td>
        </tr>
      </tfoot>
    </table>
    </div>
  );
};

export default PrintContributionsTable;