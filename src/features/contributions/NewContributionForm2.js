import { useState, useEffect } from "react";
import { useAddNewContributionMutation } from "./contributionsApiSlice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { toast } from 'react-toastify';
import ContributionsList from "./ContributionsList";
import * as Yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { 
    Button, 
    Card, 
    CardBody, 
    Container, 
    Row, 
    Col, 
    Form as BootstrapForm, 
    InputGroup 
} from 'react-bootstrap';
import { Person, List, Calendar2Check, Journal, CurrencyDollar } from 'react-bootstrap-icons';

const NewContributionForm2 = ({ members, categories }) => {
  const [addNewContribution, { isSuccess, isError, error }] = useAddNewContributionMutation();
  const navigate = useNavigate();
  const dateTest = new Date();
  const dateWithoutTime = dateTest.toISOString().split('T')[0];

  useEffect(() => {
    if (isSuccess) {
      navigate('/dash/contributions/new');
    }
    if (isError) {
      toast.error(error?.data?.message || "An error occurred", {
        className: "custom-toast",
        draggable: true,
        position: "top-center",
        theme: "colored"
      });
    }
  }, [isSuccess, isError, error, navigate]);

  const validationSchema = Yup.object().shape({
    member: Yup.string()
      .required('Member is required'),
    category: Yup.string()
      .required('Category is required'),
    date: Yup.date()
      .required('Date is required')
      .max(new Date(), 'Date cannot be in the future'),
    notes: Yup.string()
      .max(500, 'Notes must be less than 500 characters'),
    amount: Yup.number()
      .required('Amount is required')
      .positive('Amount must be positive')
  });

  const optionsMember = members.map(member => (
    <option key={member.id} value={member.id}>
        {member.member_id} - {member.last_name}
    </option>
));

  const optionsCategory = categories.map(category => (
    <option key={category.id} value={category.id}>{category.category_name}</option>
  ));

  return (
    <>
      <section className="section section-shaped section-xxl-table">
        <div className="d-flex justify-content-center">
          <p className={isError ? "errmsg" : "offscreen"}>{error?.data?.message}</p>
        </div>
        <div className="shape shape-style-1 shape-default">
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
        <Container className="pt-lg-7">
          <Row className="justify-content-center">
            <Col lg="5">
              <Card className="bg-secondary shadow border-0">
                <CardBody className="px-lg-5 py-lg-5">
                  <div className="text-center text-muted mb-4">
                    <medium>New Contribution</medium>
                  </div>
                  <Formik
                    initialValues={{
                      member: '',
                      category: '',
                      date: dateWithoutTime,
                      notes: '',
                      amount: ''
                    }}
                    validationSchema={validationSchema}
                    onSubmit={async (values, { setSubmitting }) => {
                      await addNewContribution(values);
                      setSubmitting(false);
                    }}
                  >
                    {({ isSubmitting }) => (
                      <Form>
                        <BootstrapForm.Group className="mb-3">
                          <BootstrapForm.Label htmlFor="member">Member</BootstrapForm.Label>
                          <InputGroup>
                            
                              <InputGroup.Text>
                                <Person />
                              </InputGroup.Text>
                            
                            <Field
                              as="select"
                              style={{ width: "auto" }}
                              className="form-control"
                              name="member"
                            >
                              <option value="">Select a member</option>
                              {optionsMember}
                            </Field>
                            <ErrorMessage name="member" component="div" className="invalid-feedback" />
                          </InputGroup>
                        </BootstrapForm.Group>
                        <BootstrapForm.Group className="mb-3">
                          <BootstrapForm.Label htmlFor="category">Category</BootstrapForm.Label>
                          <InputGroup>
                            
                              <InputGroup.Text>
                                <List />
                              </InputGroup.Text>
                            
                            <Field
                              as="select"
                              style={{ width: "auto" }}
                              className="form-control"
                              name="category"
                            >
                              <option value="">Select a category</option>
                              {optionsCategory}
                            </Field>
                            <ErrorMessage name="category" component="div" className="invalid-feedback" />
                          </InputGroup>
                        </BootstrapForm.Group>
                        <BootstrapForm.Group className="mb-3">
                          <BootstrapForm.Label htmlFor="date">Date</BootstrapForm.Label>
                          <InputGroup>
                            
                              <InputGroup.Text>
                                <Calendar2Check />
                              </InputGroup.Text>
                            
                            <Field
                              type="date"
                              className="form-control"
                              name="date"
                            />
                            <ErrorMessage name="date" component="div" className="invalid-feedback" />
                          </InputGroup>
                        </BootstrapForm.Group>
                        <BootstrapForm.Group className="mb-3">
                          <BootstrapForm.Label htmlFor="notes">Notes</BootstrapForm.Label>
                          <InputGroup>
                            
                              <InputGroup.Text>
                                <Journal />
                              </InputGroup.Text>
                            
                            <Field
                              type="text"
                              className="form-control"
                              name="notes"
                            />
                            <ErrorMessage name="notes" component="div" className="invalid-feedback" />
                          </InputGroup>
                        </BootstrapForm.Group>
                        <BootstrapForm.Group className="mb-3">
                          <BootstrapForm.Label htmlFor="amount">Amount</BootstrapForm.Label>
                          <InputGroup>
                            
                              <InputGroup.Text>
                                <CurrencyDollar />
                              </InputGroup.Text>
                            
                            <Field
                              type="number"
                              className="form-control"
                              name="amount"
                            />
                            <ErrorMessage name="amount" component="div" className="invalid-feedback" />
                          </InputGroup>
                        </BootstrapForm.Group>
                        <Button variant="primary" type="submit" disabled={isSubmitting}>
                          Save
                        </Button>
                      </Form>
                    )}
                  </Formik>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
        <br />
        <Container>
          <Card className="card-profile shadow mt--300">
            <div className="px-4">
              <Row className="justify-content-center">
                <ContributionsList />
              </Row>
            </div>
          </Card>
        </Container>
      </section>
    </>
  );
};

export default NewContributionForm2;