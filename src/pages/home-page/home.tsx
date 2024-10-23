import { Container, Row, Col, Button, Offcanvas } from 'react-bootstrap';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import './home.scss';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function Home() {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/');
        }
    }, [navigate]);

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
        <Container fluid>
        <Row className="vh-100 d-flex justify-content-center align-items-center">
            <Col md={6} className="d-flex flex-column align-items-center">
                <Button className="btn-home w-100 mb-3" onClick={() => navigate('/services')}>
                Serviços
                </Button>
                <Button className="btn-home w-100 mb-3" onClick={() => navigate('/pets')}>
                Pets
                </Button>
                <Button className="btn-home w-100 mb-3" onClick={() => navigate('/schedullings')}>
                Agendamentos
                </Button>
            </Col>
        </Row>
        </Container>
        </>
    );
}