import { useState, useEffect } from "react"
import { useUpdateUserMutation, useDeleteUserMutation } from "./usersApiSlice"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons"
import { ROLES } from "../../config/roles"
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
import { PersonBadge, House, Buildings, EnvelopeAt, Incognito} from 'react-bootstrap-icons'
const USER_REGEX = /^[A-z]{3,20}$/
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/

const EditUserForm = ({ user }) => {

    const [updateUser, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useUpdateUserMutation()

    const [deleteUser, {
        isSuccess: isDelSuccess,
        isError: isDelError,
        error: delerror
    }] = useDeleteUserMutation()

    const navigate = useNavigate()

    const [username, setUsername] = useState(user.username)
    const [validUsername, setValidUsername] = useState(false)
    const [password, setPassword] = useState('')
    const [validPassword, setValidPassword] = useState(false)
    const [roles, setRoles] = useState(user.roles)
    const [active, setActive] = useState(user.active)

    useEffect(() => {
        setValidUsername(USER_REGEX.test(username))
    }, [username])

    useEffect(() => {
        setValidPassword(PWD_REGEX.test(password))
    }, [password])

    useEffect(() => {
        console.log(isSuccess)
        if (isSuccess || isDelSuccess) {
            setUsername('')
            setPassword('')
            setRoles([])
            navigate('/dash/users')
        }
        if (isError|| isDelError) {
            toast.error(error?.data?.message || "An error occurred", {
                className: "custom-toast",
                draggable: true,
                position: "top-center",
                theme: "colored"
            })
        }

    }, [isSuccess, isDelSuccess,isError,isDelError,error, navigate])

    const onUsernameChanged = e => setUsername(e.target.value)
    const onPasswordChanged = e => setPassword(e.target.value)

    const onRolesChanged = e => {
        const values = Array.from(
            e.target.selectedOptions,
            (option) => option.value
        )
        setRoles(values)
    }

    const onActiveChanged = () => setActive(prev => !prev)

    const onSaveUserClicked = async (e) => {
        if (password) {
            await updateUser({ id: user.id, username, password, roles, active })
        } else {
            await updateUser({ id: user.id, username, roles, active })
        }
    }

    const onDeleteUserClicked = async () => {
        await deleteUser({ id: user.id })
    }

    const options = Object.values(ROLES).map(role => {
        return (
            <option
                key={role}
                value={role}

            > {role}</option >
        )
    })

    let canSave
    if (password) {
        canSave = [roles.length, validUsername, validPassword].every(Boolean) && !isLoading
    } else {
        canSave = [roles.length, validUsername].every(Boolean) && !isLoading
    }

    const errClass = (isError || isDelError) ? "errmsg" : "offscreen"
    const validUserClass = !validUsername ? 'form__input--incomplete' : ''
    const validPwdClass = password && !validPassword ? 'form__input--incomplete' : ''
    const validRolesClass = !Boolean(roles.length) ? 'form__input--incomplete' : ''

    const errContent = (error?.data?.message || delerror?.data?.message) ?? ''


    const content = (
        <>
        <section className="section section-shaped section-member">
        <div className="d-flex  justify-content-center">
            <p className={errClass}>{errContent}</p>
           
            </div>
        <div className= 'd-flex  justify-content-center align-items-center'>
        <Container className="pt-lg-7">  
        <Row className="justify-content-center">  
        <Col lg="5"> 
        <Card className="bg-secondary shadow border-0">
            <CardBody className="px-lg-5 py-lg-5">
                        <div className="text-center text-muted mb-4">
                            <h2>Edit User</h2>
                        </div>
            < Form onSubmit={e => e.preventDefault()}>
                <div className="form__title-row">
                    
                </div>
                <Form.Group className="mb-3">
                <Form.Label>
                    Username: <span className="nowrap">[3-20 letters]</span></Form.Label>
                    <InputGroup>
                    <InputGroup.Text>
                        <PersonBadge />
                </InputGroup.Text>
                <Form.Control
                    className={`form__input ${validUserClass}`}
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="off"
                    value={username}
                    onChange={onUsernameChanged}
                />
                </InputGroup>
                </Form.Group>
                <Form.Group className="mb-3">
                <Form.Label>
                    Password: <span className="nowrap">[empty = no change]</span> <span className="nowrap">[4-12 chars incl. !@#$%]</span></Form.Label>
                    <InputGroup>
                    <InputGroup.Text>
                        <Incognito />
                </InputGroup.Text>
                <Form.Control
                    className={`form__input ${validPwdClass}`}
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={onPasswordChanged}
                />
                </InputGroup>
                </Form.Group>
                <Form.Group className="mb-3">
                
                   
                    <Form.Check
                        className="form__checkbox"
                        id="user-active"
                        name="user-active"
                        type="checkbox"
                        label="Active"
                        checked={active}
                        onChange={onActiveChanged}
                    />
                
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
                <div style={{ display: 'flex', gap: '10px' }}>
            <Button variant="primary" onClick={onSaveUserClicked}>Save</Button>  
            <Button variant="primary" onClick={onDeleteUserClicked}>Delete</Button>  
            </div>
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
export default EditUserForm