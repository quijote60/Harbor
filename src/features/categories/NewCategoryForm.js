import { useState, useEffect} from "react"
import { useAddNewCategoryMutation, useGetCategoriesQuery, selectAllCategories } from "./categoriesApiSlice"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import useTitle from "../../hooks/useTitle"
import {Form, Container, Row,Col, Card,CardBody, InputGroup, Button} from 'react-bootstrap';
import { List ,PencilSquare} from 'react-bootstrap-icons'
import { toast } from 'react-toastify';


const NewCategoryForm = () => {
    useTitle('harbor bible: New Counter')
    const [addNewCategory, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useAddNewCategoryMutation()

    const { 
        isLoading: isLoadingCategories,
        isError: isErrorFetching,
        error: fetchError
    } = useGetCategoriesQuery()

    const existingCategories = useSelector(selectAllCategories)

    const navigate = useNavigate()

    const [category_id, setCategoryId] = useState('')
    const [category_name, setCategoryName] = useState('')
    
    const [categoryIdError, setCategoryIdError] = useState('');
    const [categoryNameError, setCategoryNameError] = useState('');

    const allCategoryIds = Array.from({ length: 20 }, (_, i) => i + 1)

    const availableCategoryIds = allCategoryIds.filter(id => {
        // If we're still loading or there's an error, show all options
        if (isLoadingCategories || isErrorFetching) return true
        
        // Check if this ID is already used by converting to string for comparison
        const isUsed = existingCategories.some(
            category => category.category_id === id.toString() || 
                       category.category_id === id
        )
        return !isUsed
    })
    

    const validateCategoryId = (categoryId) => {
        const intValue = parseInt(categoryId);
        if (isNaN(intValue) || intValue < 1 || intValue > 20) {
          return "Category ID must be a number between 1 and 20";
        }
        return null;
      };

    const validateCategoryName =  (category_name) => {
        if(category_name == ""){
            return "Category name needs to be populated";
        }
    }


      useEffect(() => {
        if (isSuccess) {
          setCategoryId("");
          setCategoryName("");
          navigate("/dash/categories");
        }
        if (isError) {
            toast.error(error?.data?.message || "An error occurred", {
                className: "custom-toast",
                draggable: true,
                position: "top-center",
                theme: "colored"
            })
        }
      }, [isSuccess, isError,navigate, error]);


            

    const onCategoryIdChanged = e => setCategoryId(e.target.value)
    const onCategoryNameChanged = e => setCategoryName(e.target.value)

    const canSave = [category_id, category_name].every(Boolean) && !isLoading

    const onSaveCategoryClicked = async (e) => {
          e.preventDefault()
          if (canSave) {
              await addNewCategory({ category_id, category_name })
          }
      }
  



      const successToast = () => {
        toast.success("Success custom Toast", {
            className: "custom-toast",
            draggable: true,
            position: "top-center",
            theme: "colored"
        })
    }

    const errClass = isError ? "errmsg" : "offscreen"
    const errContent = (error?.data?.message)

    

    const content = (
        <>
       
        <section className="section section-shaped section-login">
            <div>
            <p className={errClass}>{error?.data?.message}</p>
            
            </div>
            
            <div className='d-flex  justify-content-center'> {/* Removed align-items-center */}
            <Container className="pt-lg-7"> 
            <Row className="justify-content-center"> 
            <Col lg="5">
            <Card className="bg-secondary shadow border-0">
            <CardBody className="px-lg-5 py-lg-5">   

                        <div className="text-center text-muted mb-4">   

                            <medium>New Category</medium>
                        </div>
            <Form onSubmit={onSaveCategoryClicked}>
            <div className="form__title-row">
            
                    </div>
                    <Form.Group className="mb-3">
                                            <Form.Label>Category ID:</Form.Label>
                                            <InputGroup>
                                                <InputGroup.Text>
                                                    <List />
                                                </InputGroup.Text>
                                                <Form.Select
                                                    name='category_id'
                                                    value={category_id}
                                                    onChange={onCategoryIdChanged}
                                                    disabled={isLoadingCategories}
                                                >
                                                    <option value="">
                                                        {isLoadingCategories 
                                                            ? "Loading available IDs..." 
                                                            : "Select a Category ID"}
                                                    </option>
                                                    {availableCategoryIds.map(num => (
                                                        <option key={num} value={num}>
                                                            {num}
                                                        </option>
                                                    ))}
                                                </Form.Select>
                                            </InputGroup>
                                            {availableCategoryIds.length === 0 && !isLoadingCategories && (
                                                <p className="text-danger mt-2">No category IDs available (all IDs 1-20 are used)</p>
                                            )}
                                        </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Category Name: </Form.Label>
                <InputGroup>
                <InputGroup.Text>
                        <PencilSquare />
                        </InputGroup.Text>
                <Form.Control                   
                    type='text'
                    placeholder='Category Name*'
                    name='category_name'
                    value={category_name}
                    onChange={onCategoryNameChanged}
                    onBlur={() => {
                        const error = validateCategoryName(category_name);
                        setCategoryNameError(error);
                      }}
                    
                    
                />
                </InputGroup>
                {categoryNameError && <p className="error">{categoryNameError}</p>}
            </Form.Group>
            <Button variant="primary" 
            onClick={onSaveCategoryClicked} 
            disabled={!canSave}
            className={!canSave ? 'button-disabled' : ''}>Save</Button>  
            
                

            </Form>
            </CardBody>
            </Card>    
            </Col>
            </Row>
            </Container>
            </div>
            </section>
        </>
    )

    return content
}
export default NewCategoryForm
