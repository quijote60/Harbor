import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useLoginMutation } from './authApiSlice';
import { setCredentials } from './authSlice';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import {
    Button,
    Card,
    CardHeader,
    CardBody,
    Col,
    FormGroup,
    Label,
    Input,
} from 'reactstrap';
import PulseLoader from 'react-spinners/PulseLoader';

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [login, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useLoginMutation();

    useEffect(() => {
        if (isSuccess) {
            toast.success("Login successful!", {
                className: "custom-toast",
                draggable: true,
                position: "top-center",
                theme: "colored"
            });
            navigate('/dash');
        }
        if (isError) {
            console.log('Error from useEffect:', error);
            const errorMessage = error?.data?.message ||
                                error?.data?.error ||
                                error?.error ||
                                "Failed to login. Please try again.";
            toast.error(errorMessage, {
                className: "custom-toast",
                draggable: true,
                position: "top-center",
                theme: "colored"
            });
        }
    }, [isSuccess, isError, error, navigate]);

    if (isLoading) {
        return <PulseLoader color={'#FFF'} />;
    }

    const LoginValidationSchema = Yup.object().shape({
        username: Yup.string()
            .required('Username is required'),
        password: Yup.string()
            .required('Password is required'),
    });

    return (
        <div className="position-relative min-vh-100 d-flex justify-content-center align-items-center" style={{ background: '#f8f9fa' }}>
            {/* Background shapes with proper z-index */}
            <div 
                className="position-absolute w-100 h-100 overflow-hidden" 
                style={{ zIndex: 0 }}
            >
                <div className="shape shape-style-1 shape-default">
                    {[...Array(9)].map((_, index) => (
                        <span key={index} className="position-absolute" />
                    ))}
                </div>
            </div>

            <Col lg="6" md="8" className="mx-auto" style={{ maxWidth: '600px', zIndex: 1 }}>
                <Card className="bg-secondary shadow border-0">
                    <CardHeader className="bg-transparent pb-5">
                        <div className="text-center mt-2 mb-4">
                            <h2>Login</h2>
                        </div>
                    </CardHeader>
                    <CardBody className="px-lg-5 py-lg-5">
                        <Formik
                            initialValues={{
                                username: '',
                                password: '',
                            }}
                            validationSchema={LoginValidationSchema}
                            onSubmit={async (values, { setSubmitting }) => {
                                try {
                                    const { accessToken } = await login(values).unwrap();
                                    dispatch(setCredentials({ accessToken }));
                                    setSubmitting(false);
                                    // Success handling is managed by useEffect
                                } catch (err) {
                                    setSubmitting(false);
                                    // Error handling is managed by useEffect
                                }
                            }}
                        >
                            {({ isSubmitting, errors, touched }) => (
                                <Form role="form">
                                    <FormGroup>
                                        <Label for="username" className="fw-medium">Username</Label>
                                        <Field
                                            as={Input}
                                            type="text"
                                            name="username"
                                            id="username"
                                            autoComplete="off"
                                            className={`form-control ${touched.username && errors.username ? 'is-invalid' : ''}`}
                                        />
                                        <ErrorMessage
                                            name="username"
                                            component="div"
                                            className="invalid-feedback"
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="password" className="fw-medium">Password</Label>
                                        <Field
                                            as={Input}
                                            type="password"
                                            name="password"
                                            id="password"
                                            className={`form-control ${touched.password && errors.password ? 'is-invalid' : ''}`}
                                        />
                                        <ErrorMessage
                                            name="password"
                                            component="div"
                                            className="invalid-feedback"
                                        />
                                    </FormGroup>
                                    <div className="text-center">
                                        <Button
                                            className="mt-4"
                                            disabled={isSubmitting || isLoading}
                                            color="primary"
                                            type="submit"
                                        >
                                            {isSubmitting ? 'Logging in...' : 'Login'}
                                        </Button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </CardBody>
                </Card>
            </Col>
        </div>
    );
};

export default Login;