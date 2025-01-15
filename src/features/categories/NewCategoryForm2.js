import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useAddNewCategoryMutation, useGetCategoriesQuery, selectAllCategories } from "./categoriesApiSlice";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import useTitle from "../../hooks/useTitle";
import { Container, Row, Col, Card, CardBody, InputGroup, Button } from 'react-bootstrap';
import { List, PencilSquare } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';

const NewCategoryForm2 = () => {
    useTitle('harbor bible: New Counter');
    const [addNewCategory, { isLoading, isSuccess, isError, error }] = useAddNewCategoryMutation();
    const { isLoading: isLoadingCategories, isError: isErrorFetching } = useGetCategoriesQuery();
    const existingCategories = useSelector(selectAllCategories);
    const navigate = useNavigate();
  
    const allCategoryIds = Array.from({ length: 20 }, (_, i) => i + 1);
    const availableCategoryIds = allCategoryIds.filter(id => {
      if (isLoadingCategories || isErrorFetching) return true;
      return !existingCategories.some(
        category => category.category_id === id.toString() || category.category_id === id
      );
    });
  
    const CategoryValidationSchema = Yup.object().shape({
      category_id: Yup.number()
        .required('Category ID is required')
        .oneOf(availableCategoryIds, 'This category ID is already in use')
        .positive('Category ID must be a positive number')
        .integer('Category ID must be an integer')
        .max(20, 'Category ID must be between 1 and 20')
        .min(1, 'Category ID must be between 1 and 20'),
      category_name: Yup.string()
        .required('Category name is required')
        .min(2, 'Category name must be at least 2 characters')
        .max(50, 'Category name must be at most 50 characters')
    });
  
    React.useEffect(() => {
      if (isSuccess) {
        navigate("/dash/categories");
      }
      if (isError) {
        toast.error(error?.data?.message || "An error occurred");
      }
    }, [isSuccess, isError, navigate, error]);
  
    const handleSubmit = async (values, { setSubmitting }) => {
      try {
        await addNewCategory({
          category_id: values.category_id,
          category_name: values.category_name
        });
        setSubmitting(false);
      } catch (err) {
        toast.error(err?.data?.message || "An error occurred");
        setSubmitting(false);
      }
    };
  
    const InputField = ({ name, label, type = 'text', Icon, as, children }) => (
      <div className="form-group mb-3">
        <label htmlFor={name} className="form-label fw-medium">{label}</label>
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
                  <h2 className="text-center mb-4 fs-3">New Category</h2>
                  
                  <Formik
                    initialValues={{
                      category_id: '',
                      category_name: ''
                    }}
                    validationSchema={CategoryValidationSchema}
                    onSubmit={handleSubmit}
                  >
                    {({ isSubmitting }) => (
                      <Form className="px-md-2">
                        <InputField
                          name="category_id"
                          label="Category ID"
                          as="select"
                          Icon={List}
                        >
                          <option value="">
                            {isLoadingCategories ? "Loading available IDs..." : "Select a Category ID"}
                          </option>
                          {availableCategoryIds.map(num => (
                            <option key={num} value={num}>{num}</option>
                          ))}
                        </InputField>
  
                        <InputField
                          name="category_name"
                          label="Category Name"
                          Icon={PencilSquare}
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
      </div>
    );
  };
  
  export default NewCategoryForm2;
