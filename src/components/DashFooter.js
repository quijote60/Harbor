import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHouse } from "@fortawesome/free-solid-svg-icons"
import { useNavigate, useLocation } from 'react-router-dom'
import useAuth from "../hooks/useAuth"
import { Container, Row , Col} from "react-bootstrap"

const DashFooter = () => {

    const { username, status } = useAuth()

    const navigate = useNavigate()
    const { pathname } = useLocation()

    const onGoHomeClicked = () => navigate('/dash')

    let goHomeButton = null
    if (pathname !== '/dash') {
        goHomeButton = (
            <button
                className="dash-footer__button icon-button"
                title="Home"
                onClick={onGoHomeClicked}
            >
                <FontAwesomeIcon icon={faHouse} />
            </button>
        )   
    }

    const content = (
        <footer className="dash-footer">
            <Container fluid>
                <Row className="text-white p-3 custom-navfooter">
                <Col xs={12} className="d-flex flex-column flex-sm-row align-items-center justify-content-between">
                <div className="mb-2 mb-sm-0">
                    {goHomeButton}
                </div>
            
                <div className="d-flex flex-column flex-sm-row align-items-center">
                <p className="mb-2 mb-sm-0 me-sm-3">Current User: {username}</p>
                <p className="mb-0">Status: {status}</p>
                </div>
            
            </Col>
            </Row >
            </Container>
        </footer>
    )
    return content
}
export default DashFooter