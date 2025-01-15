import React from 'react';
import { useGetContributionsQuery } from "./contributionsApiSlice"
import Contribution from './Contribution'
import { Table, Container, Card } from 'react-bootstrap';
import useTitle from "../../hooks/useTitle"
import PulseLoader from 'react-spinners/PulseLoader'
import { toast } from 'react-toastify';

const ContributionsList = () => {
    useTitle('Harbor Bible: Contributions List')
    const {
        data: contributions,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetContributionsQuery('contributionsList', {
        pollingInterval: 60000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    })

    React.useEffect(() => {
        if (isError) {
            toast.error(error?.data?.message || 'Failed to load contributions');
        }
    }, [isError, error]);

    let content

    if (isLoading) {
        return (
            <Container fluid className="py-5 mt-4">
                <Card className="shadow" style={{ position: 'relative', zIndex: 1 }}>
                    <Card.Body className="p-md-4 p-3 text-center">
                        <PulseLoader color={"#0d6efd"} />
                    </Card.Body>
                </Card>
            </Container>
        );
    }

    if (isError) {
        return (
            <Container fluid className="py-5 mt-4">
                <Card className="shadow" style={{ position: 'relative', zIndex: 1 }}>
                    <Card.Body className="p-md-4 p-3">
                        <div className="alert alert-danger mb-0" role="alert">
                            {error?.data?.message || 'Failed to load contributions'}
                        </div>
                    </Card.Body>
                </Card>
            </Container>
        );
    }

    if (isSuccess) {

        const { ids, entities } = contributions
        console.log(contributions)

        //let filteredIds

        //var d = new Date();
        //d = new Date(d.getTime() - 3000000);
        //var date_format_str = d.getFullYear().toString()+"-"+((d.getMonth()+1).toString().length==2?(d.getMonth()+1).toString():"0"+(d.getMonth()+1).toString())+"-"+(d.getDate().toString().length==2?d.getDate().toString():"0"+d.getDate().toString())+" "+(d.getHours().toString().length==2?d.getHours().toString():"0"+d.getHours().toString())+":"+((parseInt(d.getMinutes()/5)*5).toString().length==2?(parseInt(d.getMinutes()/5)*5).toString():"0"+(parseInt(d.getMinutes()/5)*5).toString())+":00";
        //console.log('testdate',date_format_str);

        const date = new Date();
        const dateWithoutTime = date.toISOString().split('T')[0];
        console.log(dateWithoutTime);


        //filteredIds = ids.filter(contributionId => entities[contributionId].member_id ===  2)
        //filteredIds = ids.filter(contributionId => entities[contributionId].createdAt == dateWithoutTime)
        const filteredIds = ids.filter(contributionId => {
            const contributionDate = new Date(entities[contributionId].createdAt)
                .toISOString()
                .split('T')[0];
            return contributionDate === dateWithoutTime;
        });
        console.log(filteredIds)

        //const tableContent = ids?.length && ids.map(contributionId => <Contribution key={contributionId} contributionId={contributionId} />)

        //const {entities} =  contributions

        //let filteredIds

        //filteredIds = ids.filter(contributionId => entities[contributionId].date >= new Date(new Date().setUTCHours(0, 0, 0, 0)).toISOString())
        //console.log(filteredIds)

        const tableContent = filteredIds.length 
        ? filteredIds.map(contributionId => 
            <Contribution key={contributionId} contributionId={contributionId} />
          )
        : (
            <tr>
                <td colSpan="8" className="text-center py-4">
                    No contributions found for today
                </td>
            </tr>
          );
        
        //const tableContent = 
            //?  ids.map(contributionId => <Contribution key={contributionId} contributionId={contributionId} />)
            //: null
            //entities.filter(contribution => contribution.member === "6697ded2ae32ccf9899fb155").map(contributionId => <Contribution key={contributionId} contributionId={contributionId} />)
            
            return (
                <Container fluid className="py-5 mt-4">
                    <Card className="shadow">
                        <Card.Body className="p-md-4 p-3">
                        <div className="table-responsive" style={{ position: 'relative', zIndex: 2 }}>
                                <Table striped bordered hover className="mb-0 mobile-table">
                                    <thead className="bg-light">
                                        <tr>
                                            <th className="py-3">Created</th>
                                            <th className="py-3">Updated</th>
                                            <th className="py-3">Member ID</th>
                                            <th className="py-3">Member Last Name</th>
                                            <th className="py-3">Category Name</th>
                                            <th className="py-3">Notes</th>
                                            <th className="py-3">Amount</th>
                                            <th className="py-3" style={{ width: '100px', position: 'relative', zIndex: 3 }}>Edit</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tableContent}
                                    </tbody>
                                </Table>
                            </div>
                        </Card.Body>
                    </Card>
                </Container>
            );
        }
    
        return null;
    };
    
    export default ContributionsList;