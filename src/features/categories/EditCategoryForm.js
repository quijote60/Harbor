import { useState, useEffect } from "react"
import { useUpdateCategoryMutation, useDeleteCategoryMutation } from "./categoriesApiSlice"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons"
import useAuth from "../../hooks/useAuth"
import { toast } from 'react-toastify';
import { Container, Row,Col, Card,CardBody, InputGroup, Button} from 'react-bootstrap';
import { Envelope, Person, Key, List , Journal, Calendar2Check, CurrencyDollar, PencilSquare} from 'react-bootstrap-icons'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const EditCategoryForm = ({ category }) => {
    const { isManager, isAdmin } = useAuth();
    const [updateCategory, { isLoading, isSuccess, isError, error }] = useUpdateCategoryMutation();
    const [deleteCategory, { isSuccess: isDelSuccess, isError: isDelError, error: delerror }] = useDeleteCategoryMutation();
    const navigate = useNavigate();
  
    const CategoryValidationSchema = Yup.object().shape({
      category_id: Yup.number()
        .required('Category ID is required')
        .positive('Category ID must be a positive number')
        .integer('Category ID must be an integer')
        .max(20, 'Category ID must be between 1 and 20')
        .min(1, 'Category ID must be between 1 and 20'),
      category_name: Yup.string()
        .required('Category name is required')
        .min(2, 'Category name must be at least 2 characters')
        .max(50, 'Category name must be at most 50 characters')
    });
  
    useEffect(() => {
      if (isSuccess || isDelSuccess) {
        navigate('/dash/categories');
      }
      if (isError || isDelError) {
        toast.error(error?.data?.message || delerror?.data?.message || "An error occurred");
      }
    }, [isSuccess, isDelSuccess, isError, isDelError, error, delerror, navigate]);
  
    const handleSubmit = async (values) => {
      await updateCategory({ id: category.id, ...values });
    };
  
    const handleDelete = async () => {
      await deleteCategory({ id: category.id });
    };
  
    const InputField = ({ name, label, Icon }) => (
      <div className="form-group mb-3">
        <label htmlFor={name} className="form-label fw-medium">{label}</label>
        <InputGroup>
          <InputGroup.Text>
            <Icon size={20} />
          </InputGroup.Text>
          <Field
            type="text"
            id={name}
            name={name}
            className="form-control"
          />
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
                  <h2 className="text-center mb-4 fs-3">Edit Category</h2>
                  
                  <Formik
                    initialValues={{
                      category_id: category.category_id,
                      category_name: category.category_name
                    }}
                    validationSchema={CategoryValidationSchema}
                    onSubmit={handleSubmit}
                  >
                    {({ isSubmitting }) => (
                      <Form className="px-md-2">
                        <InputField
                          name="category_id"
                          label="Category ID"
                          Icon={List}
                        />
  
                        <InputField
                          name="category_name"
                          label="Category Name"
                          Icon={PencilSquare}
                        />
  
                        <div className="d-flex gap-3 justify-content-end">
                          <Button 
                            type="submit"
                            disabled={isSubmitting || isLoading}
                            variant="primary"
                            className="px-4 py-2"
                          >
                            {isSubmitting ? 'Saving...' : 'Save'}
                          </Button>
  
                          {(isManager || isAdmin) && (
                            <Button 
                              variant="danger"
                              onClick={handleDelete}
                              className="px-4 py-2"
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
  
  export default EditCategoryForm;