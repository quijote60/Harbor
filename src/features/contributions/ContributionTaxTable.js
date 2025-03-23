import React, { useState, useMemo } from 'react';
import { Table, Row, Col } from 'react-bootstrap';
import { format, parseISO } from 'date-fns';

const ContributionTaxTable = ({ contributions }) => {
  const contributionsPerPage = 10;
  const numPages = Math.ceil(contributions.length / contributionsPerPage);

  const grandTotal = contributions.reduce((total, c) => total + c.amount, 0);

  return (
    <Row>
      <Col md={12}>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {Array.from({ length: numPages }, (_, i) => i).map((pageNumber) => {
            const startIndex = pageNumber * contributionsPerPage;
            const endIndex = Math.min((pageNumber + 1) * contributionsPerPage, contributions.length);
            const pageContributions = contributions.slice(startIndex, endIndex);
            const pageGrandTotal = pageContributions.reduce((total, c) => total + c.amount, 0);

            return (
              <div key={pageNumber} style={{ width: '48%', margin: '1%' }}>
                <Table striped bordered hover responsive style={{ height: '100%' }}>
                  <thead>
                    <tr>
                      <th className="text-left">Date</th>
                      <th className="text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageContributions.map((contribution) => (
                      <tr key={contribution.id}>
                        <td>
                          {format(
                            new Date(new Date(contribution.date).getTime() + new Date().getTimezoneOffset() * 60000),
                            'MMM dd, yyyy'
                          )}
                        </td>
                        <td className="text-right">
                          {contribution.amount.toLocaleString('en-US', {
                            style: 'currency',
                            currency: 'USD',
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td className="text-right" style={{ fontWeight: 'bold' }}>
                        {/* Conditionally render grand total label */}
                        {pageNumber === numPages - 1 ? "Grand Total:" : "Page Total:"} 
                      </td>
                      <td className="text-right" style={{ fontWeight: 'bold' }}>
                        {/* Conditionally render correct total value */}
                        {pageNumber === numPages - 1 ? `$${grandTotal.toFixed(2)}` : `$${pageGrandTotal.toFixed(2)}`}
                      </td>
                    </tr>
                  </tfoot>
                </Table>
              </div>
            );
          })}
        </div>
      </Col>
    </Row>
  );
};

export default ContributionTaxTable;
