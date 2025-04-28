import { useState, useEffect } from "react"
import { useAddNewContributionMutation } from "./contributionsApiSlice"
import React from "react"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave } from "@fortawesome/free-solid-svg-icons"
import { toast } from 'react-toastify';
import { Person, List, Calendar2Check, Journal, CurrencyDollar } from 'react-bootstrap-icons'
import * as Yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import ContributionsList from "./ContributionsList"

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

//const USER_REGEX = /^[A-z]{3,20}$/
//const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/

const NewContributionForm = ({members, categories}) => {

  const [addNewContribution, { isLoading }] = useAddNewContributionMutation();
  const navigate = useNavigate();
  const dateTest = new Date();
  const dateWithoutTime = dateTest.toISOString().split('T')[0];
  const [dropdownOpen, setDropdownOpen] = useState(false);

    
   // console.log(dateWithoutTime);

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

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
      try {
        await addNewContribution(values).unwrap(); // Use unwrap to handle the promise directly
        toast.success('Contribution added successfully');
        resetForm();
        navigate('/dash/contributions/new');
      } catch (error) {
        toast.error(error?.data?.message || 'An error occurred');
      } finally {
        setSubmitting(false);
      }
    };

    const optionsMember = [...members]  // Create a copy of the array to avoid mutating the original
  .sort((a, b) => a.last_name.localeCompare(b.last_name))  // Sort by last_name alphabetically
  .map(member => {
    return (
      <option
        key={member.id}
        value={member.id}
      > 
        {member.last_name} - {member.member_id}
      </option>
    )
});

  const optionsCategory = categories.map(category => {
      return (
          
          <option
              key={category.id}
              value={category.id}
          > {category.category_name}</option >
          
      )
  })

  

    const handleDropdownOpen = () => setDropdownOpen(true);
    const handleDropdownClose = () => setDropdownOpen(false);

    const SelectField = ({ name, label, Icon, options }) => (
      <BootstrapForm.Group className="mb-3">
        <BootstrapForm.Label htmlFor={name} className="fw-medium">
          {label}
        </BootstrapForm.Label>
        <InputGroup>
          <InputGroup.Text>
            <Icon />
          </InputGroup.Text>
          <Field
            as="select"
            id={name}
            name={name}
            className="form-control"
            onFocus={handleDropdownOpen}
            onBlur={handleDropdownClose}
          >
            <option value="">Select {label}</option>
            {options}
          </Field>
        </InputGroup>
        <ErrorMessage name={name} component="div" className="text-danger mt-1 small" />
      </BootstrapForm.Group>
    );

    const InputField = ({ name, label, type = 'text', Icon }) => {
      // Add this function inside the component
      const handleWheel = (e) => {
        if (type === 'number') {
          e.target.blur();
        }
      };
    
      return (
        <BootstrapForm.Group className="mb-3">
          <BootstrapForm.Label htmlFor={name} className="fw-medium">
            {label}
          </BootstrapForm.Label>
          <InputGroup>
            <InputGroup.Text>
              <Icon />
            </InputGroup.Text>
            <Field
              type={type}
              id={name}
              name={name}
              onWheel={handleWheel}
              className="form-control"
            />
          </InputGroup>
          <ErrorMessage name={name} component="div" className="text-danger mt-1 small" />
        </BootstrapForm.Group>
      );
    };

    

    

   


    return (
      <div className="h-100">
        <div className="shape shape-style-1 shape-default">
          {[...Array(8)].map((_, i) => (
            <span key={i} />
          ))}
        </div>
  
        {/* Form Section */}
        <div className="container mt-5 mb-4">
          <div className="row justify-content-center">
            <div className="col-12 col-md-8">
              <div className="card shadow">
                <div className="card-body p-md-4 p-3">
                  <h2 className="text-center mb-4 fs-3">New Contribution</h2>
                  <Formik
                    initialValues={{
                      member: '',
                      category: '',
                      date: dateWithoutTime,
                      notes: '',
                      amount: ''
                    }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                  >
                    {({ isSubmitting }) => (
                      <Form className="px-md-2">
                        <SelectField
                          name="member"
                          label="Member"
                          Icon={Person}
                          options={optionsMember}
                        />
                        <SelectField
                          name="category"
                          label="Category"
                          Icon={List}
                          options={optionsCategory}
                        />
                        <InputField
                          name="date"
                          label="Date"
                          type="date"
                          Icon={Calendar2Check}
                        />
                        <InputField
                          name="notes"
                          label="Notes"
                          Icon={Journal}
                        />
                        <InputField
                          name="amount"
                          label="Amount"
                          type="number"
                          Icon={CurrencyDollar}
                        />
                        
                        <div className="d-grid d-md-flex justify-content-md-end">
                          <Button 
                            type="submit" 
                            disabled={isSubmitting || isLoading}
                            variant="primary"
                            className="px-4 py-2"
                          >
                            {isSubmitting ? 'Saving...' : 'Save'}
                          </Button>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        {/* Table Section */}
        <div className="container mt-5 mb-4">
          <div className="row">
            <div className="col-12">
              <div className="card shadow" style={{ position: 'relative', zIndex: 1 }}>
                <div className="card-body p-md-4 p-3">
                  <div className="table-responsive">
                    <ContributionsList pollingPaused={dropdownOpen} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default NewContributionForm