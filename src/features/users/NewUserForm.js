import { useState, useEffect } from "react"
import { useAddNewUserMutation } from "./usersApiSlice"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave } from "@fortawesome/free-solid-svg-icons"
import { ROLES } from "../../config/roles"
import { toast } from 'react-toastify';
import { PersonBadge, House, Buildings, EnvelopeAt, Incognito} from 'react-bootstrap-icons'
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
const USER_REGEX = /^[A-z]{3,20}$/
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/

const NewUserForm = () => {
    useTitle('Harbor Bible: New Counter')
    const [addNewUser, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useAddNewUserMutation()

    const navigate = useNavigate()

    const [username, setUsername] = useState('')
    const [validUsername, setValidUsername] = useState(false)
    const [password, setPassword] = useState('')
    const [re_password, setRe_Password] = useState('')
    const [validPassword, setValidPassword] = useState(false)
    const [roles, setRoles] = useState(["Employee"])

    useEffect(() => {
        setValidUsername(USER_REGEX.test(username))
    }, [username])

    useEffect(() => {
        setValidPassword(PWD_REGEX.test(password))
    }, [password])

    useEffect(() => {
        if (isSuccess) {
            setUsername('')
            setPassword('')
            setRoles([])
            navigate('/dash/users')
        }
        if (isError) {
            toast.error(error?.data?.message || "An error occurred", {
                className: "custom-toast",
                draggable: true,
                position: "top-center",
                theme: "colored"
            })
        }
    }, [isSuccess,isError,error, navigate])

    const onUsernameChanged = e => setUsername(e.target.value)
    const onPasswordChanged = e => setPassword(e.target.value)
    const onRePasswordChanged = e => setRe_Password(e.target.value)

    const onRolesChanged = e => {
        const values = Array.from(
            e.target.selectedOptions, //HTMLCollection 
            (option) => option.value
        )
        setRoles(values)
    }

    const canSave = [roles.length, validUsername, validPassword].every(Boolean) && !isLoading

    const onSaveUserClicked = async (e) => {
        e.preventDefault()
        if (canSave) {
            await addNewUser({ username, password, roles })
        }
    }

    const options = Object.values(ROLES).map(role => {
        return (
            <option
                key={role}
                value={role}

            > {role}</option >
        )
    })

    const errClass = isError ? "errmsg" : "offscreen"
    //const validUserClass = !validUsername ? 'form__input--incomplete' : ''
    //const validPwdClass = !validPassword ? 'form__input--incomplete' : ''
    const validRolesClass = !Boolean(roles.length) ? 'form__input--incomplete' : ''


    const content = (
        <>
        <section className="section section-shaped section-member">
            <div className= 'd-flex  justify-content-center align-items-center'>
            <p className={errClass}>{error?.data?.message}</p>
           </div>
           <div className= 'd-flex  justify-content-center align-items-center'>
           <Container className="pt-lg-7"> 
           <Row className="justify-content-center">
           <Col lg="5"> 
           <Card className="bg-secondary shadow border-0">
                        <CardBody className="px-lg-5 py-lg-5">
                        <div className="text-center text-muted mb-4">
                            <h2>New User</h2>
                        </div>   
            <Form onSubmit={onSaveUserClicked}>
            <div className="form__title-row">
                </div>
            
            <Form.Group className="mb-3">
                <Form.Label> Username: <span className="nowrap">[3-20 letters]</span></Form.Label>
                <InputGroup>
                    <InputGroup.Text>
                        <PersonBadge />
                </InputGroup.Text>
                <Form.Control                 
                    type='text'
                    placeholder='User Name*'
                    name='username'
                    autoComplete="new-password"
                    value={username}
                    onChange={onUsernameChanged}
                    required
                />
                </InputGroup>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Password: <span className="nowrap">[empty = no change]</span> <span className="nowrap">[4-12 chars incl. !@#$%]</span></Form.Label>
                <InputGroup>
                    <InputGroup.Text>
                        <Incognito />
                </InputGroup.Text>
                <Form.Control                   
                    type='password'
                    placeholder='Password*'
                    name='password'
                    value={password}
                    onChange={onPasswordChanged}
                    minLength='6'
                    required
                />
                </InputGroup>
            </Form.Group>
            <Form.Group className="mb-3">
                    <Form.Label>Confirm Password</Form.Label>
                    <InputGroup>
                    <InputGroup.Text>
                        <Incognito />
                </InputGroup.Text>
                    <Form.Control
                        
                        type='password'
                        placeholder='Confirm Password*'
                        name='re_password'
                        value={re_password}
                        onChange={onRePasswordChanged}
                        minLength='6'
                        required
                    />
                    </InputGroup>
                </Form.Group>

                <Form.Group className="mb-3">
                <Form.Label>ASSIGNED ROLES:</Form.Label>
                <Form.Select
                    style = {{width: "auto"}}
                    id="roles"
                    name="roles"
                    className={`form__select ${validRolesClass}`}
                    multiple={true}
                    size="3"
                    value={roles}
                    onChange={onRolesChanged}
                >
                    {options}
                </Form.Select>
                </Form.Group>
                <Button variant="primary" onClick={onSaveUserClicked}>Save</Button>  
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
export default NewUserForm
