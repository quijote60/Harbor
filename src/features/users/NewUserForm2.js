import React ,{useEffect}from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useAddNewUserMutation } from "./usersApiSlice";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { PersonBadge, Incognito, PersonGear } from 'react-bootstrap-icons';
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
    const [addNewUser, { isLoading, isSuccess, isError, error }] = useAddNewUserMutation();
    const navigate = useNavigate();
  
    const UserValidationSchema = Yup.object().shape({
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
  
    React.useEffect(() => {
      if (isSuccess) {
        navigate('/dash/users');
      }
      if (isError) {
        toast.error(error?.data?.message || "An error occurred");
      }
    }, [isSuccess, isError, navigate, error]);
  
    const handleSubmit = async (values, { setSubmitting }) => {
      try {
        const { username, password, roles } = values;
        await addNewUser({ username, password, roles });
        setSubmitting(false);
      } catch (err) {
        toast.error(error?.data?.message || "An error occurred");
        setSubmitting(false);
      }
    };
  
    const InputField = ({ name, label, type = 'text', Icon, as, children, hint }) => (
      <div className="form-group mb-3">
        <label htmlFor={name} className="form-label fw-medium">
          {label}
          {hint && <span className="nowrap ms-2 text-muted small">[{hint}]</span>}
        </label>
        <InputGroup>
          <InputGroup.Text>
            <Icon size={20} />
          </InputGroup.Text>
          <Field
            as={as}
            type={type}
            id={name}
            name={name}
            className="form-control"
          >
            {children}
          </Field>
        </InputGroup>
        <ErrorMessage name={name} component="div" className="text-danger mt-1 small" />
      </div>
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
                  <h2 className="text-center mb-4 fs-3">New User</h2>
  
                  <Formik
                    initialValues={{
                      username: '',
                      password: '',
                      re_password: '',
                      roles: ['Employee']
                    }}
                    validationSchema={UserValidationSchema}
                    onSubmit={handleSubmit}
                  >
                    {({ isSubmitting }) => (
                      <Form className="px-md-2">
                        <InputField
                          name="username"
                          label="Username"
                          Icon={PersonBadge}
                          hint="3-20 letters"
                        />
  
                        <InputField
                          name="password"
                          label="Password"
                          type="password"
                          Icon={Incognito}
                          hint="4-12 chars incl. !@#$%"
                        />
  
                        <InputField
                          name="re_password"
                          label="Confirm Password"
                          type="password"
                          Icon={Incognito}
                        />
  
                        <InputField
                          name="roles"
                          label="Assigned Roles"
                          as="select"
                          Icon={PersonGear}
                          multiple
                        >
                          {Object.values(ROLES).map(role => (
                            <option key={role} value={role}>{role}</option>
                          ))}
                        </InputField>
  
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
      </div>
    );
  };
  
  export default NewUserForm2;