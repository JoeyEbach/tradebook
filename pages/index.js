import {
  Button, Col, Container, Row,
} from 'react-bootstrap';
import { signOut } from '../utils/auth';
import { useAuth } from '../utils/context/authContext';

function Home() {
  const { user } = useAuth();

  document.querySelector('body').setAttribute('data-theme', 'home');// localStorage.setItem('selectedTheme', 'dark')

  return (
    <div
      className="home"
    >
      <Container className="welcome">
        <Col>
          <Row className="homeRow">
            <h1 className="wel">Welcome to</h1>
          </Row>
          <Row className="homeRow">
            <h2 className="tbName">tradebook</h2>
          </Row>
          <Row className="homeRow">
            <p>Hello {user.displayName}!</p>
          </Row>
        </Col>
      </Container>
      <Button variant="danger" type="button" size="lg" className="welcomeBtn copy-btn" onClick={signOut}>
        Sign Out
      </Button>
    </div>
  );
}

export default Home;
