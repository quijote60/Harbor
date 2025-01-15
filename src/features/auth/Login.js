import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from './authSlice';
import { useLoginMutation } from './authApiSlice';
import usePersist from '../../hooks/usePersist';
import useTitle from '../../hooks/useTitle';
import PulseLoader from 'react-spinners/PulseLoader';
import { Envelope, Person, Key } from 'react-bootstrap-icons';
import {
  Form,
  Button,
  Card,
  CardHeader,
  CardBody,
  InputGroup,
  Container,
  Row,
  Col,
} from 'react-bootstrap';

const Login = () => {
  useTitle('Counter Login');
  const userRef = useRef();
  const errRef = useRef();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [persist, setPersist] = usePersist();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, { isLoading }] = useLoginMutation();

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg('');
  }, [username, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { accessToken } = await login({ username, password }).unwrap();
      dispatch(setCredentials({ accessToken }));
      setUsername('');
      setPassword('');
      navigate('/dash');
    } catch (err) {
      if (!err.status) {
        setErrMsg('No Server Response');
      } else if (err.status === 400) {
        setErrMsg('Missing Username or Password');
      } else if (err.status === 401) {
        setErrMsg('Unauthorized');
      } else {
        setErrMsg(err.data?.message);
      }
      errRef.current.focus();
    }
  };

  const handleUserInput = (e) => setUsername(e.target.value);
  const handlePwdInput = (e) => setPassword(e.target.value);
  const handleToggle = () => setPersist(prev => !prev);

  if (isLoading) return <PulseLoader color={"#FFF"} />;

  return (
    <div className="position-relative min-vh-100">
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

      {/* Main content with higher z-index */}
      <Container className="position-relative pt-lg-7" style={{ zIndex: 1 }}>
        <Row className="justify-content-center">
          <Col lg="5">
            {/* Error message */}
            {errMsg && (
              <div 
                ref={errRef}
                className="alert alert-danger text-center mb-3" 
                role="alert"
              >
                {errMsg}
              </div>
            )}

            <Card className="bg-secondary shadow border-0">
              <CardBody className="px-lg-5 py-lg-5">
                <div className="text-center text-muted mb-4">
                  <medium>Sign in with credentials</medium>
                </div>

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <InputGroup>
                      <InputGroup.Text>
                        <Person />
                      </InputGroup.Text>
                      <Form.Control
                        ref={userRef}
                        type="text"
                        id="username"
                        placeholder="Username"
                        value={username}
                        onChange={handleUserInput}
                        autoComplete="off"
                        required
                      />
                    </InputGroup>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <InputGroup>
                      <InputGroup.Text>
                        <Key />
                      </InputGroup.Text>
                      <Form.Control
                        type="password"
                        placeholder="Password"
                        id="password"
                        value={password}
                        onChange={handlePwdInput}
                        required
                      />
                    </InputGroup>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Check
                      type="checkbox"
                      id="persist"
                      label="Trust This Device"
                      onChange={handleToggle}
                      checked={persist}
                    />
                  </Form.Group>

                  <div className="text-center">
                    <Button
                      className="my-4 w-100"
                      variant="primary"
                      type="submit"
                      style={{ zIndex: 2, position: 'relative' }}
                    >
                      Login
                    </Button>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;