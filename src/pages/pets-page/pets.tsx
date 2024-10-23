import { useState, useEffect } from 'react';
import { Button, Card, Container, Row, Col, Modal, Form, Offcanvas } from 'react-bootstrap';
import axios from 'axios';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useNavigate } from 'react-router-dom';

interface Pet {
    id: number;
    name: string;
    ownerId: number;
    race: string;
    size: string;
}
  
const initialPetState = {
    name: '',
    race: '',
    size: '',
    ownerId: 0,
};

export default function PetsPage(){
    const [pets, setPets] = useState<Pet[]>([]); 
    const [petOwnerId, setPetOwnerId] = useState(0); 
    const [showModal, setShowModal] = useState(false);
    const [editingPet, setEditingPet] = useState<Pet | null>(null);
    const [newPet, setNewPet] = useState({
        ...initialPetState,
    });
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/');
        }
    }, [navigate]);

    const fetchPets = async () => {
        try {
            const url: string = import.meta.env.VITE_API_URL + 'pets';
            const usersUrl: string = import.meta.env.VITE_API_URL + 'users';
            const token = localStorage.getItem('token');

            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const { data } = response.data;
           
            if (data && Array.isArray(data)) {
                setPets(data);
            } else {
                console.error('Erro ao buscar serviços:', response.data);
            }

            const responseUsers = await axios.get(usersUrl, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (responseUsers.data.data && Array.isArray(responseUsers.data.data)) {
                setPetOwnerId(responseUsers.data.data[0].id);
            } else {
                console.error('Erro ao buscar serviços:', responseUsers.data);
            }
        } catch (error) {
            console.error('Erro ao buscar pets:', error);
        }
    };

    useEffect(() => {
        fetchPets();
    }, []);

    const handleShowModal = (pet: Pet | null = null) => {
        if (pet) {
            setEditingPet(pet);
            setNewPet({
                name: pet.name,
                race: pet.race,
                size: pet.size,
                ownerId: petOwnerId
            });
        } else {
            setEditingPet(null);
            setNewPet({ ...initialPetState });
        }
        setShowModal(true);
    };

  
    const handleCloseModal = () => {
        setShowModal(false);
    };

    
    const handleSavePet = async () => {
        const url = import.meta.env.VITE_API_URL + 'pets';
        const token = localStorage.getItem('token');

        newPet.ownerId = petOwnerId;

        if (editingPet) {
            await axios.put(`${url}/${editingPet.id}`, newPet, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        } else {
            await axios.post(url, newPet, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        }

        fetchPets();
        handleCloseModal();
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    const handleDeletePet = async () => {
        if (editingPet) {
          const url = import.meta.env.VITE_API_URL + `pets/${editingPet.id}`;
          const token = localStorage.getItem('token');
    
          try {
            await axios.delete(url, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            fetchPets();
            handleCloseModal();
          } catch (error) {
            console.error('Erro ao excluir pet:', error);
          }
        }
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


        <Container>
        <h1 className="my-4">Pets</h1>

        <Button variant="primary" onClick={() => handleShowModal()}>
            Adicionar Pet
        </Button>

        <Row className="mt-4">
            {pets.map((pet, index) => (
                <Col key={index} md={4} className="mb-4">
                    <Card>
                    <Card.Body>
                        <Card.Title>{pet.name}</Card.Title>
                        <Card.Text>
                        <strong>Raça:</strong> {pet.race} <br />
                        <strong>Porte:</strong> {pet.size} <br />
                        </Card.Text>
                        <Button variant="warning" onClick={() => handleShowModal(pet)}>
                            Editar
                        </Button>
                    </Card.Body>
                    </Card>
                </Col>
            ))}
        </Row>

        <Modal show={showModal} onHide={handleCloseModal}>
            <Modal.Header closeButton>
            <Modal.Title>{editingPet ? 'Editar Pet' : 'Adicionar Pet'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Form>
                <Form.Group controlId="formName">
                <Form.Label>Nome</Form.Label>
                <Form.Control
                    type="text"
                    value={newPet.name}
                    onChange={(e) => setNewPet({ ...newPet, name: e.target.value })}
                />
                </Form.Group>

                <Form.Group controlId="formRace">
                <Form.Label>Raça</Form.Label>
                <Form.Control
                    type="text"
                    value={newPet.race}
                    onChange={(e) => setNewPet({ ...newPet, race: e.target.value })}
                />
                </Form.Group>

                <Form.Group controlId="formSize">
                <Form.Label>Porte</Form.Label>
                <Form.Control
                    type="text"
                    value={newPet.size}
                    onChange={(e) => setNewPet({ ...newPet, size: e.target.value })}
                />
                </Form.Group>
            </Form>
            </Modal.Body>
            <Modal.Footer>
                {editingPet && (
                    <Button variant="danger" onClick={handleDeletePet}>
                        Excluir Pet
                    </Button>
                )}
                <Button variant="secondary" onClick={handleCloseModal}>
                    Fechar
                </Button>
                <Button variant="primary" onClick={handleSavePet}>
                    Salvar
                </Button>
            </Modal.Footer>
        </Modal>
        </Container>
        </>
    );
}