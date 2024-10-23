import { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Offcanvas, Card } from 'react-bootstrap';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface Service {
  serviceType: string;
  price: number;
}

export default function ServicesPage(){
  const [services, setServices] = useState<Service[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
      const token = localStorage.getItem('token');
      if (!token) {
          navigate('/');
      }
  }, [navigate]);

  const fetchServices = async () => {
    try {
      const url: string = import.meta.env.VITE_API_URL + 'services';

      const token = localStorage.getItem('token');

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });
      
      const { data } = response.data;

      if (data && Array.isArray(data)) {
        setServices(data);
      } else {
        console.error('Erro ao buscar serviços:', response.data);
      }
    } catch (error) {
      console.error('Erro ao fazer requisição à API:', error);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleLogout = () => {
      localStorage.removeItem('token');
      navigate('/');
  };

  return (
    <>
    {['false'].map((expand) => (
        <Navbar key={expand} expand={expand} className="navbar-color vw-100">
            <Container fluid>
                <Navbar.Brand href="/home">PetShop</Navbar.Brand>
                <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
                <Navbar.Offcanvas
                id={`offcanvasNavbar-expand-${expand}`}
                aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
                placement="end"
                >
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
                    PetShop
                    </Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Nav className="justify-content-end flex-grow-1 pe-3">
                        <Nav.Link href="/services">Serviços</Nav.Link>
                        <Nav.Link href="/pets">Pets</Nav.Link>
                        <Nav.Link href="/schedullings">Agendamentos</Nav.Link>
                        <Button variant="primary"  className="mt-5" onClick={handleLogout}>
                        Sair
                        </Button>
                    </Nav>
                </Offcanvas.Body>
                </Navbar.Offcanvas>
            </Container>
        </Navbar>
    ))}

    <Container className="py-5">
      <Row className="mb-4">
        <Col>
          <h2 className="text-center">Serviços Disponíveis</h2>
        </Col>
      </Row>

      <Row>
        {services.map((service, index) => (
          <Col md={4} sm={6} key={index} className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title>{service.serviceType}</Card.Title>
                <Card.Text>
                  <strong>Preço:</strong> R$ {service.price.toFixed(2)}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
    </>
  );
};