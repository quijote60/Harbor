import { useState, useEffect } from "react"
import { useAddNewMemberMutation, useGetMembersQuery, selectAllMembers } from "./membersApiSlice"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { STATES } from "../../config/states"
import { PersonBadge, House, Buildings, EnvelopeAt} from 'react-bootstrap-icons'
import { toast } from 'react-toastify';
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
import useTitle from "../../hooks/useTitle"


const NewMemberForm = () => {

    useTitle('Harbor Bible: New Member')

    const [addNewMember, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useAddNewMemberMutation()

    const { 
        isLoading: isLoadingMembers,
        isError: isErrorFetching,
        error: fetchError
    } = useGetMembersQuery()

    const existingMembers = useSelector(selectAllMembers)

    const navigate = useNavigate()

    const [member_id, setMemberId] = useState('')
    const [first_name, setFirstName] = useState('')
    const [last_name, setLastName] = useState('')
    const [address, setAddress] = useState('')
    const [city, setCity] = useState('')
    const [state, setState] = useState('')
    const [zip_code, setZipCode] = useState('')
    const [email, setEmail] = useState('')
    
    const [memberIdError, setMemberIdError] = useState('');
    //const [categoryNameError, setCategoryNameError] = useState('');
    
    const allMemberIds = Array.from({ length: 100 }, (_, i) => i + 1)

    const availableMemberIds = allMemberIds.filter(id => {
        // If we're still loading or there's an error, show all options
        if (isLoadingMembers || isErrorFetching) return true
        
        // Check if this ID is already used by converting to string for comparison
        const isUsed = existingMembers.some(
            member => member.member_id === id.toString() || 
                       member.member_id === id
        )
        return !isUsed
    })
    

    useEffect(() => {
        if (isSuccess) {
            setMemberId('')
            setFirstName('')
            setLastName('')
            setAddress('')
            setCity('')
            setState('')
            setZipCode('')
            setEmail('')
            navigate('/dash/members')
        }
        if (isError) {
            toast.error(error?.data?.message || "An error occurred", {
                className: "custom-toast",
                draggable: true,
                position: "top-center",
                theme: "colored"
            })
        }
    }, [isSuccess, isError, error,navigate])

    const onMemberIdChanged = e => setMemberId(e.target.value)
    const onFirstNameChanged = e => setFirstName(e.target.value)
    const onLastNameChanged = e => setLastName(e.target.value)
    const onAddressChanged = e => setAddress(e.target.value)
    const onCityChanged = e => setCity(e.target.value)
    const onStateChanged = e => setState(e.target.value)
    const onZipCodeChanged = e => setZipCode(e.target.value)
    const onEmailChanged = e => setEmail(e.target.value)
    

    

    const canSave = [member_id,  last_name].every(Boolean) && !isLoading

    const onSaveMemberClicked = async (e) => {
        e.preventDefault()
        if (canSave) {
            await addNewMember({member_id, first_name, last_name, address, city, state, zip_code, email })
        }
    }

    const options = Object.values(STATES).map(state => {
        return (
            <option
                key={state}
                value={state}

            > {state}</option >
        )
    })

    

    const errClass = isError ? "errmsg" : "offscreen"
    //const validUserClass = !validUsername ? 'form__input--incomplete' : ''
    //const validPwdClass = !validPassword ? 'form__input--incomplete' : ''
    //const validRolesClass = !Boolean(roles.length) ? 'form__input--incomplete' : ''


    const content = (
        <>
            <section className="section section-shaped section-member">
            
            <div>
            <p className={errClass}>{error?.data?.message}</p>
           
            </div>
            <div className= 'd-flex  justify-content-center align-items-center'>
            <Container className="pt-lg-7">  
            <Row className="justify-content-center">  
            <Col lg="5"> 
            <Card className="bg-secondary shadow border-0">
                        <CardBody className="px-lg-5 py-lg-5">
                        <div className="text-center text-muted mb-4">
                            <medium>New Member</medium>
                        </div>
            <Form onSubmit={onSaveMemberClicked}>
            
            <Form.Group className="mb-3">
                <Form.Label>Member ID:</Form.Label>
                    <InputGroup>
                        <InputGroup.Text>
                            <PersonBadge />
                        </InputGroup.Text>
                             <Form.Select
                                name='member_id'
                                value={member_id}
                                onChange={onMemberIdChanged}
                                disabled={isLoadingMembers}
                            >
                                <option value="">
                                {isLoadingMembers 
                                ? "Loading available IDs..." 
                                : "Select a Member ID"}
                                </option>
                                {availableMemberIds.map(num => (
                                    <option key={num} value={num}>
                                    {num}
                                </option>
                                ))}
                            </Form.Select>
                        </InputGroup>
                        {availableMemberIds.length === 0 && !isLoadingMembers && (
                        <p className="text-danger mt-2">No member IDs available (all IDs 1-100 are used)</p>
                )}
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>First Name: </Form.Label>
                <InputGroup>
                    <InputGroup.Text>
                        <PersonBadge />
                </InputGroup.Text>
                <Form.Control                   
                    type='text'
                    placeholder='First Name*'
                    name='first_name'
                    value={first_name}
                    onChange={onFirstNameChanged}
                    
                />
                </InputGroup>
            </Form.Group>
            
            <Form.Group className="mb-3">
                <Form.Label>Last Name: </Form.Label>
                <InputGroup>
                    <InputGroup.Text>
                        <PersonBadge />
                </InputGroup.Text>
                <Form.Control                   
                    type='text'
                    placeholder='Last Name*'
                    name='last_name'
                    value={last_name}
                    onChange={onLastNameChanged}
                    required
                />
                </InputGroup>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Address: </Form.Label>
                <InputGroup>
                    <InputGroup.Text>
                        <House />
                </InputGroup.Text>
                <Form.Control                   
                    type='text'
                    placeholder='Address*'
                    name='address'
                    value={address}
                    onChange={onAddressChanged}
                    
                />
                </InputGroup>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>City: </Form.Label>
                <InputGroup>
                    <InputGroup.Text>
                        <Buildings/>
                </InputGroup.Text>
                <Form.Control                   
                    type='text'
                    placeholder='City*'
                    name='city'
                    value={city}
                    onChange={onCityChanged}
                   
                />
                </InputGroup>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>State:</Form.Label>
                <InputGroup>
                    <InputGroup.Text>
                        <Buildings/>
                </InputGroup.Text>
                <Form.Select
                    style = {{width: "auto"}}
                    id="state"
                    name="state"
                    value={state}
                    onChange={onStateChanged}
                >
                    {options}
                </Form.Select>
                </InputGroup>
                </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Zip Code: </Form.Label>
                <InputGroup>
                    <InputGroup.Text>
                        <Buildings/>
                </InputGroup.Text>
                <Form.Control                   
                    type='text'
                    placeholder='Zip Code*'
                    name='zip_code'
                    value={zip_code}
                    onChange={onZipCodeChanged}
                    
                />
                </InputGroup>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Email: </Form.Label>
                <InputGroup>
                    <InputGroup.Text>
                        <EnvelopeAt/>
                </InputGroup.Text>
                <Form.Control                   
                    type='email'
                    placeholder='Email*'
                    name='email'
                    value={email}
                    onChange={onEmailChanged}
                   
                />
                </InputGroup>
            </Form.Group>
            <Button variant="primary" onClick={onSaveMemberClicked}>Save</Button>  

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
export default NewMemberForm
