import { useState, useEffect } from "react"
import { useAddNewContributionMutation } from "./contributionsApiSlice"

import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave } from "@fortawesome/free-solid-svg-icons"
import { toast } from 'react-toastify';
import { Person, List, Calendar2Check, Journal, CurrencyDollar } from 'react-bootstrap-icons'

import ContributionsList from "./ContributionsList"

import {Form,
    Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Container,
  Row,
  Col,
} from 'react-bootstrap';

//const USER_REGEX = /^[A-z]{3,20}$/
//const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/

const NewContributionForm = ({members, categories}) => {

    const [addNewContribution, {
       // isLoading,
        isSuccess,
        isError,
        error
    }] = useAddNewContributionMutation()

    //const selectorData = useSelector(selectAllMembers);
    //const selectorData2 = useSelector(selectAllCategories);

    const navigate = useNavigate()
    //const date1 = new Date();
    //const defaultValue = date1.toLocaleDateString('en-CA');
    const dateTest = new Date()
    const dateWithoutTime = dateTest.toISOString().split('T')[0];
    console.log(dateWithoutTime);

    useEffect(() => {
       
        if (isSuccess) {
            setMember('')
            setCategory('')
            setDate(dateWithoutTime)
            setNotes('')
            setAmount('')
            navigate('/dash/contributions/new')
        }
        if (isError) {
            toast.error(error?.data?.message || "An error occurred", {
                className: "custom-toast",
                draggable: true,
                position: "top-center",
                theme: "colored"
            })
        }
        
    }, [isSuccess, isError,error], navigate)

    

    //if (!members.length) {
        //const members = useSelector(selectAllMembers)
    //}

   // if(!categories.length) {
        //const categories = useSelector(selectAllCategories)
   // }

    const [member, setMember] = useState('')
    const [category, setCategory] = useState('')
    const [date, setDate] = useState(dateWithoutTime)
    const [notes, setNotes] = useState('')
    const [amount, setAmount] = useState('')
    

    

    

    const onMemberIdChanged = e => setMember(e.target.value)
    const onCategoryIdChanged = e => setCategory(e.target.value)
    const onDateChanged = e => setDate(e.target.value)
    const onNotesChanged = e => setNotes(e.target.value)
    const onAmountChanged = e => setAmount(e.target.value)

    const optionsMember = members.map(member => {
        return (
           
            <option
                key={member.id}
                value={member.id}
            > {member.last_name}</option >
        )
    })

    const optionsCategory = categories.map(category => {
        return (
            
            <option
                key={category.id}
                value={category.id}
            > {category.category_name}</option >
            
        )
    })

    const canSave = [date, amount].every(Boolean) 

    const onSaveUserClicked = async (e) => {
        e.preventDefault()
        if (canSave) {
            await addNewContribution({ member, category, date, notes, amount })
            //setMember('')
            //setCategory('')
            //setDate('')
            //setNotes('')
            //setAmount('')
            window.location.reload(false);
           // navigate('/dash/contributions/new')
        }
    }

    

    const errClass = isError ? "errmsg" : "offscreen"
    //const validUserClass = !validUsername ? 'form__input--incomplete' : ''
    //const validPwdClass = !validPassword ? 'form__input--incomplete' : ''
    //const validRolesClass = !Boolean(roles.length) ? 'form__input--incomplete' : ''


    const content = (
        <>
            <section className="section section-shaped section-xxl-table">
            <div className= 'd-flex  justify-content-center  '>
            <p className={errClass}>{error?.data?.message}</p>
            </div>
           
              
              <div className="shape shape-style-1 shape-default">
                
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
                
              </div>
             
            <Container className="pt-lg-7">
                <Row className="justify-content-center">  
                    <Col lg="5"> 
                    <Card className="bg-secondary shadow border-0">
                        <CardBody className="px-lg-5 py-lg-5">
                        <div className="text-center text-muted mb-4">
                            <medium>New Contribution</medium>
                        </div>
                             
            <Form onSubmit={onSaveUserClicked}>
            <div className="form__title-row">
            
                    <div className="form__action-buttons">
                    
                        {/* <button
                            className="icon-button"
                            title="Save"
                            disabled={!canSave}
                        >
                            <FontAwesomeIcon icon={faSave} />
                        </button> */}
                    </div>   
                    </div>
                <Form.Group className="mb-3">
                <Form.Label>Member</Form.Label>
                <InputGroup>
                    <InputGroup.Text>
                        <Person />
                </InputGroup.Text>
                <Form.Select
                    style = {{width: "auto"}}
                    placeholder="member"
                    id="memberId"
                    name="memberId"
                    
                    
                    onChange={onMemberIdChanged}
                >
                    <option value="none" > 
                    </option> 
                     
                    {optionsMember}
                </Form.Select>
                </InputGroup>
                </Form.Group>
                <Form.Group className="mb-3">
                <Form.Label>Category:</Form.Label>
                <InputGroup>
                    <InputGroup.Text>
                        <List />
                        </InputGroup.Text>
                <Form.Select
                    style = {{width: "auto"}}
                    id="categoryId"
                    name="categoryId"
                    value={category}
                    onChange={onCategoryIdChanged}
                >
                     <option value="none" > 
                     </option> 
                    {optionsCategory}
                </Form.Select>
                </InputGroup>
                </Form.Group>
                
            <Form.Group className="mb-3">
                <Form.Label> Date: </Form.Label>
                <InputGroup>
                    <InputGroup.Text>
                        <Calendar2Check />
                </InputGroup.Text>
                <Form.Control                 
                    type='date'
                    placeholder='Date*'
                    name='date'
                    
                    value={date}
                    onChange={onDateChanged}
                    required
                />
                </InputGroup>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Notes:</Form.Label>
                <InputGroup>
                    <InputGroup.Text>
                        <Journal />
                </InputGroup.Text>
                <Form.Control                   
                    type='text'
                    placeholder='Notes*'
                    name='notes'
                    value={notes}
                    onChange={onNotesChanged}
                    
                />
                </InputGroup>
            </Form.Group>
            <Form.Group className="mb-3">
                    <Form.Label>Amount</Form.Label>
                    <InputGroup>
                    <InputGroup.Text>
                        <CurrencyDollar />
                        </InputGroup.Text>
                    <Form.Control
                        
                        type='numbe'
                        placeholder='Amount*'
                        name='amount'
                        value={amount}
                        onChange={onAmountChanged}
                        
                        required
                    />
                    </InputGroup>
                </Form.Group>

                <Button variant="primary" onClick={onSaveUserClicked}>Save</Button>

            </Form>
            
            </CardBody>
            </Card> 
            
            </Col>
            </Row>
            </Container>
            
            
            
            
            <br></br>
            <Container>
            <Card className="card-profile shadow mt--300">
            <div className="px-4">
            <Row className="justify-content-center">
            <ContributionsList/>
            </Row>
            </div>
            </Card>
            </Container>
            
            </section>
            
        </>
    )

    return content
}
export default NewContributionForm
