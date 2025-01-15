import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useGetAllContributionsByMonthYearQuery } from './contributionsApiSlice';

const ContributionsByMonthChart = () => {
    const { data: contributionsByMonthYear, isLoading } = useGetAllContributionsByMonthYearQuery();
  
    if (isLoading) {
      return <div>Loading...</div>;
    }
  
    return (
      <BarChart width={800} height={400} data={contributionsByMonthYear}>
        <XAxis dataKey="monthYear" />
        <YAxis />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <Legend />
        <Bar dataKey="sumOfAmount" fill="#8884d8" />
      </BarChart>
    );
  };
  
  export default ContributionsByMonthChart;