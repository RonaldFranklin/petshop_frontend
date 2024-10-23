import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function NotFoundPage() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/home');
  };

  return (
    <Container fluid className="vh-100 d-flex flex-column justify-content-center align-items-center">
      <Row>
        <Col className="text-center">
          <h1 className="display-1">404</h1>
          <h2>Página não encontrada</h2>
          <p>Desculpe, a página que você está procurando não existe.</p>
          <Button variant="primary" onClick={handleGoHome}>
            Voltar para Home
          </Button>
        </Col>
      </Row>
    </Container>
  );
}