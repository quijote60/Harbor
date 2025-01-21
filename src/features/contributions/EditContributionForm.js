import { useState, useEffect } from "react"
import { useUpdateContributionMutation, useDeleteContributionMutation } from "./contributionsApiSlice"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons"
import { Envelope, Person, Key, List , Journal, Calendar2Check, CurrencyDollar} from 'react-bootstrap-icons'
import useAuth from "../../hooks/useAuth"
import * as Yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { toast } from 'react-toastify';
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
const EditContributionForm = ({ contribution, members, categories }) => {
    const { isManager, isAdmin, isEmployee } = useAuth();
    const navigate = useNavigate();
  
    const [updateContribution, { isLoading: isUpdateLoading }] = useUpdateContributionMutation();
    const [deleteContribution] = useDeleteContributionMutation();
  
 // Format the date to YYYY-MM-DD
 const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};

    const initialValues = {
      member: contribution.member,
      category: contribution.category,
      date: formatDate(contribution.date),  // Format the date here
      notes: contribution.notes,
      amount: contribution.amount
    };
  
    const validationSchema = Yup.object().shape({
        member: Yup.string().required('Member is required'),
        category: Yup.string().required('Category is required'),
        date: Yup.date()
          .required('Date is required')
          .max(new Date(), 'Date cannot be in the future'),
        notes: Yup.string().nullable(), // Changed this line to allow null/empty values
        amount: Yup.number()
          .required('Amount is required')
          .positive('Amount must be positive')
      });
  
      const handleSubmit = async (values, { setSubmitting }) => {
        try {
          // Transform empty string to null for the notes field
          const transformedValues = {
            ...values,
            notes: values.notes?.trim() || null,
            // Ensure date is in the correct format for the backend
            date: new Date(values.date).toISOString()
          };
      
          await updateContribution({
            id: contribution.id,
            ...transformedValues
          });
          toast.success('Contribution updated successfully');
          navigate('/dash/contributions/search');
        } catch (error) {
          toast.error(error?.data?.message || 'An error occurred');
        } finally {
          setSubmitting(false);
        }
      };
  
    const handleDelete = async () => {
      try {
        await deleteContribution({ id: contribution.id });
        toast.success('Contribution deleted successfully');
        navigate('/dash/contributions/search');
      } catch (error) {
        toast.error(error?.data?.message || 'An error occurred');
      }
    };
  
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
          >
            <option value="">Select {label}</option>
            {options.map(option => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </Field>
        </InputGroup>
        <ErrorMessage name={name} component="div" className="text-danger mt-1 small" />
      </BootstrapForm.Group>
    );
  
    const InputField = ({ name, label, type = 'text', Icon }) => (
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
            className="form-control"
          />
        </InputGroup>
        <ErrorMessage name={name} component="div" className="text-danger mt-1 small" />
      </BootstrapForm.Group>
    );
  
    return (
      <div className="h-100 pt-md-5 pt-3">
        <div className="shape shape-style-1 shape-default">
          {[...Array(8)].map((_, i) => (
            <span key={i} />
          ))}
        </div>
        <div className="container mb-4">
          <div className="row justify-content-center">
            <div className="col-12 col-md-8">
              <div className="card shadow">
                <div className="card-body p-md-4 p-3" style={{ zIndex: 2 }}>
                  <h2 className="text-center mb-4 fs-3">Edit Contribution</h2>
                  <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                  >
                    {({ isSubmitting }) => (
                      <Form className="px-md-2">
                        <SelectField
                          name="member"
                          label="Member"
                          Icon={Person}
                          options={members.map(m => ({
                            id: m.id,
                            label: m.last_name
                          }))}
                        />
                        <SelectField
                          name="category"
                          label="Category"
                          Icon={List}
                          options={categories.map(c => ({
                            id: c.id,
                            label: c.category_name
                          }))}
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
                        
                        <div className="d-flex gap-2">
                          <Button 
                            type="submit" 
                            disabled={isSubmitting || isUpdateLoading}
                            variant="primary"
                          >
                            {isSubmitting ? 'Saving...' : 'Save'}
                          </Button>
                          
                          {(isManager || isAdmin || isEmployee) && (
                            <Button
                              variant="danger"
                              onClick={handleDelete}
                              disabled={isSubmitting}
                            >
                              Delete
                            </Button>
                          )}
                        </div>
                      </Form>
                    )}
                  </Formik>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default EditContributionForm;