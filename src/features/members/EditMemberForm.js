import { useState, useEffect } from "react"
import { useUpdateMemberMutation, useDeleteMemberMutation } from "./membersApiSlice"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons"
import { STATES } from "../../config/states"

import useAuth from "../../hooks/useAuth"
import { PersonBadge, House, Buildings, EnvelopeAt, Person} from 'react-bootstrap-icons'
import { toast } from 'react-toastify'
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


const EditMemberForm = ({ member }) => {
    const { isManager, isAdmin } = useAuth();
    const navigate = useNavigate();

    const [updateMember, { isLoading }] = useUpdateMemberMutation();
    const [deleteMember] = useDeleteMemberMutation();

    const initialValues = {
        member_id: member.member_id,
        first_name: member.first_name,
        last_name: member.last_name,
        address: member.address,
        city: member.city,
        state: member.state,
        zip_code: member.zip_code,
        email: member.email
    };

    const validationSchema = Yup.object().shape({
        member_id: Yup.string()
            .required('Member ID is required'),
        first_name: Yup.string()
            .max(50, 'First name must be less than 50 characters'),
        last_name: Yup.string()
            .required('Last name is required'),
        address: Yup.string()
            .required('Address is required'),
        city: Yup.string()
            .required('City is required'),
        state: Yup.string()
            .required('State is required'),
        zip_code: Yup.string()
            .matches(/^\d{5}$/, 'Invalid zip code'),
        email: Yup.string()
            .email('Invalid email address')
    });

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            await updateMember({
                id: member.id,
                ...values
            });
            toast.success('Member updated successfully');
            navigate('/dash/members');
        } catch (error) {
            toast.error(error?.data?.message || 'An error occurred');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        try {
            await deleteMember({ id: member.id });
            toast.success('Member deleted successfully');
            navigate('/dash/members');
        } catch (error) {
            toast.error(error?.data?.message || 'An error occurred');
        }
    };

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
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </Field>
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
                                <h2 className="text-center mb-4 fs-3">Edit Member</h2>
                                <Formik
                                    initialValues={initialValues}
                                    validationSchema={validationSchema}
                                    onSubmit={handleSubmit}
                                >
                                    {({ isSubmitting }) => (
                                        <Form className="px-md-2">
                                            <InputField
                                                name="member_id"
                                                label="Member ID"
                                                Icon={PersonBadge}
                                            />
                                            
                                            <InputField
                                                name="first_name"
                                                label="First Name"
                                                Icon={Person}
                                            />
                                            
                                            <InputField
                                                name="last_name"
                                                label="Last Name"
                                                Icon={Person}
                                            />
                                            
                                            <InputField
                                                name="address"
                                                label="Address"
                                                Icon={House}
                                            />
                                            
                                            <InputField
                                                name="city"
                                                label="City"
                                                Icon={Buildings}
                                            />
                                            
                                            <SelectField
                                                name="state"
                                                label="State"
                                                Icon={Buildings}
                                                options={Object.values(STATES).map(state => ({
                                                    value: state,
                                                    label: state
                                                }))}
                                            />
                                            
                                            <InputField
                                                name="zip_code"
                                                label="Zip Code"
                                                Icon={Buildings}
                                            />
                                            
                                            <InputField
                                                name="email"
                                                label="Email"
                                                type="email"
                                                Icon={EnvelopeAt}
                                            />

                                            <div className="d-flex gap-2">
                                                <Button 
                                                    type="submit" 
                                                    disabled={isSubmitting || isLoading}
                                                    variant="primary"
                                                >
                                                    {isSubmitting ? 'Saving...' : 'Save'}
                                                </Button>
                                                
                                                {(isManager || isAdmin) && (
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

export default EditMemberForm;