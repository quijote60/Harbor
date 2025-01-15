import { Link } from 'react-router-dom'
import {Container,Row,Col, Button} from 'react-bootstrap';
import React from 'react'

function Public() {
  
    const content = (
        <>
        <section className="section section-xxl section-shaped pb-250">
        <div className="shape shape-style-1 shape-default">
                
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
                
              </div>
              <Container >
                <div className="text">
                  <Row>
                    <Col lg="10">
                      <h1 className="display-3 text-white">
                      Welcome to the Harbor Bible Offering System!{" "}
                        
                      </h1>
                      <p className="lead text-white">
                        The system keeps track of members weekly offerings. 
                        The data is used for yearly reports.
                      </p>
                      <div className="btn-wrapper">
                        <Button
                          className="btn-icon mb-3 mb-sm-0"
                          color="info"
                          href="/login"
                        >
                          <span className="btn-inner--icon mr-1">
                            <i className="fa fa-code" />
                          </span>
                          <span className="btn-inner--text">Login</span>
                        </Button>
                        
                      </div>
                    </Col>
                  </Row>
                </div>
              </Container>
              <div className="separator separator-bottom separator-skew">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  preserveAspectRatio="none"
                  version="1.1"
                  viewBox="0 0 2560 100"
                  x="0"
                  y="0"
                >
                  <polygon
                    className="fill-white"
                    points="2560 0 2560 100 0 100"
                  />
                </svg>
              </div>
              </section>
              
        
       
    </>
    )
    return content
  
}

export default Public
