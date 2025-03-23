import { useState } from "react";
import { useGetContributionsQuery } from "./contributionsApiSlice";
import { format, parseISO } from 'date-fns';
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons"
import {
  Form,
  Button,
  Card,
  CardBody,
  InputGroup,
  Container,
  Row,
  Col,
  Table,
} from 'react-bootstrap';
import { 
  Person, 
  List, 
  Calendar2Check, 
  CurrencyDollar, 
  Search,
  SortDown,
  SortUp
} from 'react-bootstrap-icons';

const ContributionAnnual = ({ members, categories }) => {
  // Search form state
  const [searchParams, setSearchParams] = useState({
    memberId: '',
    dateFrom: '',
    dateTo: '',
   
  });
  const navigate = useNavigate()

  // Sorting state
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');

  const {
    data: contributions,
    isLoading,
    isError,
    error
  } = useGetContributionsQuery('contributionsList');

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle sort toggle
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filter and sort contributions
  const getFilteredContributions = () => {
    console.log('the list i get'+ 'contributions:', contributions); 
    if (!contributions?.ids) return [];
    
    let filtered = contributions.ids
      .map(id => contributions.entities[id])
      .filter(contribution => {
        // Apply filters
        if (searchParams.memberId && contribution.member !== searchParams.memberId) return false;
        //if (searchParams.categoryId && contribution.category !== searchParams.categoryId) return false;
        //if (searchParams.dateFrom && contribution.date < searchParams.dateFrom) return false;
        if (searchParams.dateFrom) {
          const contributionDate = new Date(contribution.date);
          const fromDate = new Date(searchParams.dateFrom);
          if (contributionDate < fromDate) return false;
        }
        //if (searchParams.dateTo && contribution.date > searchParams.dateTo) return false;
        if (searchParams.dateTo) {
          const contributionDate = new Date(contribution.date);
          const toDate = new Date(searchParams.dateTo);
          // Add one day to include the full end date
          toDate.setDate(toDate.getDate() + 1);
          if (contributionDate >= toDate) return false;
        }
        //if (searchParams.amountMin && parseFloat(contribution.amount) < parseFloat(searchParams.amountMin)) return false;
        //if (searchParams.amountMax && parseFloat(contribution.amount) > parseFloat(searchParams.amountMax)) return false;
        return true;
      });

    // Apply sorting
    filtered.sort((a, b) => {
      let compareResult = 0;
      switch (sortField) {
        case 'date':
          compareResult = new Date(a.date) - new Date(b.date);
          break;
        //case 'amount':
          //compareResult = parseFloat(a.amount) - parseFloat(b.amount);
          //break;
        case 'member':
          const memberA = members.find(m => m.id === a.member)?.last_name || '';
          const memberB = members.find(m => m.id === b.member)?.last_name || '';
          compareResult = memberA.localeCompare(memberB);
          break;
        //case 'category':
          //const categoryA = categories.find(c => c.id === a.category)?.category_name || '';
          //const categoryB = categories.find(c => c.id === b.category)?.category_name || '';
          //compareResult = categoryA.localeCompare(categoryB);
          //break;
        default:
          break;
      }
      return sortDirection === 'asc' ? compareResult : -compareResult;
    });
    console.log("filtered:" , filtered);
    return filtered;
  };
  

  const filteredContributions = getFilteredContributions();

  const SortIcon = ({ field }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <SortUp className="ms-1" /> : <SortDown className="ms-1" />;
  };
  const chunkArray = (array, chunkSize) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  };
  const chunkedContributions = chunkArray(filteredContributions, 10);

  return (
    <section className="section section-shaped section-xxl-table">
      <div className="shape shape-style-1 shape-default">
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>
      
      <Container className="pt-lg-7">
        <Row className="justify-content-center">
          <Col lg="8">
            <Card className="bg-secondary shadow border-0">
              <CardBody className="px-lg-5 py-lg-5">
                <div className="text-center text-muted mb-4">
                  <medium>Annual Contributions</medium>
                </div>

                <Form>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Member</Form.Label>
                        <InputGroup>
                          <InputGroup.Text>
                            <Person />
                          </InputGroup.Text>
                          <Form.Select
                            name="memberId"
                            value={searchParams.memberId}
                            onChange={handleInputChange}
                          >
                            <option value="">All Members</option>
                            {members.map(member => (
                              <option key={member.id} value={member.id}>
                                {member.last_name}
                              </option>
                            ))}
                          </Form.Select>
                        </InputGroup>
                      </Form.Group>
                    </Col>

                    
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Date From</Form.Label>
                        <InputGroup>
                          <InputGroup.Text>
                            <Calendar2Check />
                          </InputGroup.Text>
                          <Form.Control
                            type="date"
                            name="dateFrom"
                            value={searchParams.dateFrom}
                            onChange={handleInputChange}
                          />
                        </InputGroup>
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Date To</Form.Label>
                        <InputGroup>
                          <InputGroup.Text>
                            <Calendar2Check />
                          </InputGroup.Text>
                          <Form.Control
                            type="date"
                            name="dateTo"
                            value={searchParams.dateTo}
                            onChange={handleInputChange}
                          />
                        </InputGroup>
                      </Form.Group>
                    </Col>
                  </Row>

                  
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>

      <Container className="mt-4">
        <Card className="shadow">
          <CardBody>
            {isLoading ? (
              <div className="text-center py-4">Loading...</div>
            ) : isError ? (
              <div className="text-center text-danger py-4">
                {error?.data?.message || "An error occurred while fetching data"}
              </div>
            ) : (
              <>
                <div className="text-end mb-4">
                  <small>Found {filteredContributions.length} contributions</small>
                </div>
                <div className="table-responsive">
                <div className="multi-column-container">
                    
                <Table hover>
  <thead>
    <tr>
      <th
        onClick={() => handleSort('date')}
        style={{ width: '30%' }} // Adjust width as needed
      >
        Date <SortIcon field="date" />
      </th>
      <th
        onClick={() => handleSort('amount')}
        style={{ width: '20%'}} // Adjust width as needed
      >
        Amount <SortIcon field="amount" />
      </th>
    </tr>
  </thead>
  <tbody>
    {filteredContributions.map((contribution) => (
      <tr key={contribution.id}>
        <td style={{ width: '150px' }}>
          {format(
            new Date(
              new Date(contribution.date).getTime() +
                new Date().getTimezoneOffset() * 60000
            ),
            'MMM dd, yyyy'
          )}
        </td>
        <td style={{ width: '100px' }}>${parseFloat(contribution.amount).toFixed(2)}</td>
      </tr>
    ))}
  </tbody>
</Table>
</div>
                </div>
              </>
            )}
          </CardBody>
        </Card>
      </Container>
    </section>
  );
};

export default ContributionAnnual;
