import React, { forwardRef } from 'react';

const PrintableContent = forwardRef(({ data, date }, ref) => (
  <div ref={ref}>
    <style type="text/css" media="print">
      {`
        @page { size: auto; margin: 20mm; }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid black; padding: 8px; text-align: left; }
        .header { margin-bottom: 20px; }
        .stats { display: flex; gap: 20px; margin-bottom: 20px; }
        .stat-box { border: 1px solid black; padding: 15px; flex: 1; }
      `}
    </style>
    
    <div className="header">
      <h1>Contributions for {date}</h1>
      <div className="stats">
        <div className="stat-box">
          <h2>Approved: {data.approvedCount}</h2>
        </div>
        <div className="stat-box">
          <h2>Pending: {data.pendingCount}</h2>
        </div>
      </div>
    </div>

    <table>
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
        {Object.entries(data.groupedContributions || {}).map(([category, { total, contributions }]) => (
          <React.Fragment key={category}>
            <tr>
              <td colSpan={5} style={{backgroundColor: '#f3f4f6'}}>
                <strong>{category}</strong> (Total: ${total.toFixed(2)})
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
          <td colSpan={4}><strong>Grand Total</strong></td>
          <td>${data.grandTotal?.toFixed(2)}</td>
        </tr>
      </tfoot>
    </table>
  </div>
));

export default PrintableContent;