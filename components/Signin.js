import React from 'react';
import {
  Button, Col, Container, Row,
} from 'react-bootstrap';
import { signIn } from '../utils/auth';

function Signin() {
  return (
    <div>
      <Container className="welcome">
        <Col>
          <Row className="homeRow">
            <h1 className="wel">Welcome to</h1>
          </Row>
          <Row className="homeRow">
            <h2 className="tbName">tradebook</h2>
          </Row>
          <Row className="homeRow">
            <p>Click the button below to login</p>
            <Button type="button" size="lg" className="signBtn" onClick={signIn}>
              Sign In
            </Button>
          </Row>
        </Col>
      </Container>
    </div>
  );
}

export default Signin;
