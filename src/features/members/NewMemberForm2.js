import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useAddNewMemberMutation, useGetMembersQuery, selectAllMembers } from "./membersApiSlice";
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import ComboboxField from '../../components/ComboboxField';
import { PersonBadge, House, Buildings, EnvelopeAt, Person } from 'react-bootstrap-icons';
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
import useTitle from "../../hooks/useTitle";
import { STATES } from "../../config/states";

// Validation Schema


const NewMemberForm2 = () => {
    useTitle('Harbor Bible: New Member');
    const [addNewMember, { isLoading }] = useAddNewMemberMutation();
    const navigate = useNavigate();
    
    const { isLoading: isLoadingMembers } = useGetMembersQuery();
    const existingMembers = useSelector(selectAllMembers);

    const allMemberIds = Array.from({ length: 100 }, (_, i) => i + 1);
    const availableMemberIds = allMemberIds.filter(id => {
        if (isLoadingMembers) return true;
        return !existingMembers.some(
            member => member.member_id === id.toString() || 
                     member.member_id === id
        );
    });

    const initialValues = {
        member_id: '',
        first_name: '',
        last_name: '',
        address: '',
        city: '',
        state: '',
        zip_code: '',
        email: ''
    };

    const validationSchema = Yup.object().shape({
        member_id: Yup.number()
        .typeError('Member ID must be a number')
        .positive('Member ID must be positive')
        .required('Member ID is required')
        .test(
            'is-available',
            'This Member ID is already in use',
            value => !existingMembers.some(
                member => member.member_id === value?.toString() || 
                         member.member_id === value
            )
        ),
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
            await addNewMember(values);
            toast.success('Member added successfully');
            navigate('/dash/members');
        } catch (error) {
            toast.error(error?.data?.message || 'An error occurred');
        } finally {
            setSubmitting(false);
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
                                <h2 className="text-center mb-4 fs-3">New Member</h2>
                                <Formik
                                    initialValues={initialValues}
                                    validationSchema={validationSchema}
                                    onSubmit={handleSubmit}
                                >
                                    {({ isSubmitting }) => (
                                        <Form className="px-md-2">
                                            <ComboboxField
                                                name="member_id"
                                                label="Member ID"
                                                options={availableMemberIds.map(id => ({
                                                value: id,
                                                label: id.toString()
                                                }))}
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

                                            <Button 
                                                type="submit" 
                                                disabled={isSubmitting || isLoading}
                                                variant="primary"
                                            >
                                                {isSubmitting ? 'Saving...' : 'Save'}
                                            </Button>
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

export default NewMemberForm2;