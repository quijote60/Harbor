import {useEffect}from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useAddNewUserMutation } from "./usersApiSlice";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { PersonBadge, Incognito } from 'react-bootstrap-icons';
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
import { ROLES } from "../../config/roles";

// Validation Schema


const NewUserForm2 = () => {
    useTitle('Harbor Bible: New Counter');
    const navigate = useNavigate();

    const [addNewUser, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useAddNewUserMutation();

    // Initial form values
    const initialValues = {
        username: '',
        password: '',
        re_password: '',
        roles: ['Employee']
    };

    const validationSchema = Yup.object().shape({
        username: Yup.string()
            .matches(/^[A-z]{3,20}$/, 'Username must be 3-20 letters')
            .required('Username is required'),
        password: Yup.string()
            .matches(/^[A-z0-9!@#$%]{4,12}$/, 'Password must be 4-12 characters including !@#$%')
            .required('Password is required'),
        re_password: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Passwords must match')
            .required('Confirm password is required'),
        roles: Yup.array()
            .min(1, 'At least one role is required')
    });

    // Handle form submission
    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            // Extract only necessary fields for user creation
            const { username, password, roles } = values;
            
            // Attempt to add new user
            await addNewUser({ username, password, roles });
            
            // Reset submitting state
            setSubmitting(false);
        } catch (err) {
            // Handle any submission errors
            toast.error(error?.data?.message || "An error occurred", {
                className: "custom-toast",
                draggable: true,
                position: "top-center",
                theme: "colored"
            });
            setSubmitting(false);
        }
    };

    // Handle successful user creation
    useEffect(() => {
        if (isSuccess) {
            navigate('/dash/users');
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

    return (
        <section className="section section-shaped section-member">
            <div className="d-flex justify-content-center align-items-center">
                <Container className="pt-lg-7">
                    <Row className="justify-content-center">
                        <Col lg="5">
                            <Card className="bg-secondary shadow border-0">
                                <CardBody className="px-lg-5 py-lg-5">
                                    <div className="text-center text-muted mb-4">
                                        <h2>New User</h2>
                                    </div>
                                    
                                    <Formik
                                        initialValues={initialValues}
                                        validationSchema={validationSchema}
                                        onSubmit={handleSubmit}
                                    >
                                        {({ 
                                            values, 
                                            errors, 
                                            touched, 
                                            handleChange, 
                                            handleBlur, 
                                            isSubmitting 
                                        }) => (
                                            <Form>
                                                {/* Username Field */}
                                                <BootstrapForm.Group className="mb-3">
                                                    <BootstrapForm.Label>
                                                        Username: <span className="nowrap">[3-20 letters]</span>
                                                    </BootstrapForm.Label>
                                                    <InputGroup>
                                                        <InputGroup.Text>
                                                            <PersonBadge />
                                                        </InputGroup.Text>
                                                        <Field
                                                            as={BootstrapForm.Control}
                                                            type="text"
                                                            name="username"
                                                            placeholder="User Name*"
                                                            autoComplete="new-password"
                                                        />
                                                    </InputGroup>
                                                    <ErrorMessage 
                                                        name="username" 
                                                        component="div" 
                                                        className="text-danger" 
                                                    />
                                                </BootstrapForm.Group>

                                                {/* Password Field */}
                                                <BootstrapForm.Group className="mb-3">
                                                    <BootstrapForm.Label>
                                                        Password: <span className="nowrap">[4-12 chars incl. !@#$%]</span>
                                                    </BootstrapForm.Label>
                                                    <InputGroup>
                                                        <InputGroup.Text>
                                                            <Incognito />
                                                        </InputGroup.Text>
                                                        <Field
                                                            as={BootstrapForm.Control}
                                                            type="password"
                                                            name="password"
                                                            placeholder="Password*"
                                                        />
                                                    </InputGroup>
                                                    <ErrorMessage 
                                                        name="password" 
                                                        component="div" 
                                                        className="text-danger" 
                                                    />
                                                </BootstrapForm.Group>

                                                {/* Confirm Password Field */}
                                                <BootstrapForm.Group className="mb-3">
                                                    <BootstrapForm.Label>Confirm Password</BootstrapForm.Label>
                                                    <InputGroup>
                                                        <InputGroup.Text>
                                                            <Incognito />
                                                        </InputGroup.Text>
                                                        <Field
                                                            as={BootstrapForm.Control}
                                                            type="password"
                                                            name="re_password"
                                                            placeholder="Confirm Password*"
                                                        />
                                                    </InputGroup>
                                                    <ErrorMessage 
                                                        name="re_password" 
                                                        component="div" 
                                                        className="text-danger" 
                                                    />
                                                </BootstrapForm.Group>

                                                {/* Roles Field */}
                                                <BootstrapForm.Group className="mb-3">
                                                    <BootstrapForm.Label>ASSIGNED ROLES:</BootstrapForm.Label>
                                                    <Field
                                                        as={BootstrapForm.Select}
                                                        name="roles"
                                                        multiple
                                                        size="3"
                                                        style={{width: "auto"}}
                                                    >
                                                        {Object.values(ROLES).map(role => (
                                                            <option 
                                                                key={role} 
                                                                value={role}
                                                            >
                                                                {role}
                                                            </option>
                                                        ))}
                                                    </Field>
                                                    <ErrorMessage 
                                                        name="roles" 
                                                        component="div" 
                                                        className="text-danger" 
                                                    />
                                                </BootstrapForm.Group>

                                                {/* Submit Button */}
                                                <Button 
                                                    variant="primary" 
                                                    type="submit" 
                                                    disabled={isSubmitting || isLoading}
                                                >
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
            </div>
        </section>
    );
};

export default NewUserForm2;