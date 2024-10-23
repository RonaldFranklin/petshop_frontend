import { useState, useEffect } from 'react';
import { Button, Card, Container, Row, Col, Modal, Form, Offcanvas } from 'react-bootstrap';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface Owner {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
  }
  
  interface Pet {
    id: number;
    name: string;
    race: string;
    size: string;
    ownerId: number;
    Owner: Owner;
  }
  
  interface Service {
    id: number;
    serviceType: string;
    price: number;
  }
  
  interface Appointment {
    id: number;
    date: string;
    time: string;
    petId: number;
    serviceId: number;
    status: string;
    Pet: Pet;
    Service: Service;
  }

export default function SchedullingsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [serviceId, setServiceId] = useState(0);
  const [petId, setPetId] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [newAppointment, setNewAppointment] = useState({
    date: '',
    time: '',
    petId: 0,
    serviceId: 0,
    status: ''
  });

  const navigate = useNavigate();

  const fetchAppointments = async () => {
    try {
      const url = import.meta.env.VITE_API_URL + 'schedulings';
      const token = localStorage.getItem('token');

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(response.data.data);

      if (Array.isArray(response.data.data)) {
        setAppointments(response.data.data);
      } else {
        console.error('Erro ao buscar agendamentos');
      }
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error);
    }
  };

  const fetchPets = async () => {
    try {
      const url = import.meta.env.VITE_API_URL + 'pets';
      const token = localStorage.getItem('token');

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (Array.isArray(response.data.data)) {
        setPets(response.data.data);
      } else {
        console.error('Erro ao buscar pets');
      }
    } catch (error) {
      console.error('Erro ao buscar pets:', error);
    }
  };

  const fetchServices = async () => {
    try {
      const url = import.meta.env.VITE_API_URL + 'services';
      const token = localStorage.getItem('token');

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (Array.isArray(response.data.data)) {
        setServices(response.data.data);
      } else {
        console.error('Erro ao buscar serviços');
      }
    } catch (error) {
      console.error('Erro ao buscar serviços:', error);
    }
  };

  useEffect(() => {
    fetchAppointments();
    fetchPets();
    fetchServices();
  }, []);

  const handleShowModal = (appointment: Appointment | null = null) => {
    if (appointment) {
      setEditingAppointment(appointment);
      setNewAppointment({
        date: appointment.date,
        time: appointment.time,
        petId: appointment.petId,
        serviceId: appointment.serviceId,
        status: appointment.status,
      });
    } else {
      setEditingAppointment(null);
      setNewAppointment({
        date: '',
        time: '',
        petId: 0,
        serviceId: 0,
        status: ''
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSaveAppointment = async () => {
    const url = import.meta.env.VITE_API_URL + 'schedulings';
    const token = localStorage.getItem('token');
    
    newAppointment.serviceId = newAppointment.serviceId == 0 ? services[0].id : serviceId;
    newAppointment.petId = newAppointment.petId == 0 ? pets[0].id : petId;
    newAppointment.time = newAppointment.time+':00';

    newAppointment.time = newAppointment.time.substring(0,8);

    console.log(newAppointment);

    if (editingAppointment) {
        newAppointment.serviceId = newAppointment.serviceId == 0 ? services[0].id : serviceId;
        newAppointment.petId = newAppointment.petId == 0 ? pets[0].id : petId;
        newAppointment.time = newAppointment.time+':00';
    
        newAppointment.time = newAppointment.time.substring(0,8);  

      await axios.put(`${url}/${editingAppointment.id}`, newAppointment, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } else {
      await axios.post(url, newAppointment, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    fetchAppointments();
    handleCloseModal();
  };

  const handleDeleteAppointment = async () => {
    if (editingAppointment) {
      const url = import.meta.env.VITE_API_URL + `schedulings/${editingAppointment.id}`;
      const token = localStorage.getItem('token');

      try {
        await axios.delete(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        fetchAppointments(); 
        handleCloseModal();
      } catch (error) {
        console.error('Erro ao excluir agendamento:', error);
      }
    }
  };

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

    <Container>
      <h1 className="my-4">Agendamentos</h1>

      <Button variant="primary" onClick={() => handleShowModal()}>
        Adicionar Agendamento
      </Button>

      <Row className="mt-4">
        {Array.isArray(appointments) && appointments.map((appointment) => (
          <Col key={appointment.id} md={4} className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title>Agendamento</Card.Title>
                <Card.Text>
                  <strong>Data:</strong> {appointment.date} <br />
                  <strong>Hora:</strong> {appointment.time} <br />
                  <strong>Pet:</strong> {appointment.Pet.name} <br />
                  <strong>Serviço ID:</strong> {appointment.Service.serviceType} <br />
                  <strong>Status:</strong> {appointment.status} <br />
                  <strong>Dono:</strong> {appointment.Pet.Owner.name} <br />
                  <strong>telefone:</strong> {appointment.Pet.Owner.phone} <br />
                  <strong>Email:</strong> {appointment.Pet.Owner.email} <br />
                  <strong>Endereço:</strong> {appointment.Pet.Owner.address} <br />
                </Card.Text>
                <Button variant="warning" onClick={() => handleShowModal(appointment)}>
                  Editar
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editingAppointment ? 'Editar Agendamento' : 'Adicionar Agendamento'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formDate">
              <Form.Label>Data</Form.Label>
              <Form.Control
                type="date"
                value={newAppointment.date}
                onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
              />
            </Form.Group>

            <Form.Group controlId="formTime">
              <Form.Label>Hora</Form.Label>
              <Form.Control
                type="time"
                value={newAppointment.time}
                onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })}
              />
            </Form.Group>

            <Form.Group controlId="formPet">
              <Form.Label>Pet</Form.Label>
              <Form.Control
                as="select"
                value={newAppointment.petId}
                onChange={(e) => setPetId(Number(e.target.value))}
              >
                {pets.map((pet) => (
                  <option key={pet.id} value={pet.id}>
                    {pet.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="formService">
              <Form.Label>Serviço</Form.Label>
              <Form.Control
                as="select"
                value={newAppointment.serviceId}
                onChange={(e) => setServiceId(Number(e.target.value))}
                >
                {services.map((service) => (
                    <option key={service.id} value={service.id}>
                    {service.serviceType}
                    </option>
                ))}
                </Form.Control>
            </Form.Group>

            <Form.Group controlId="formStatus">
              <Form.Label>Status</Form.Label>
              <Form.Control
                type="text"
                value={newAppointment.status}
                onChange={(e) => setNewAppointment({ ...newAppointment, status: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          {editingAppointment && (
            <Button variant="danger" onClick={handleDeleteAppointment}>
              Excluir Agendamento
            </Button>
          )}
          <Button variant="secondary" onClick={handleCloseModal}>
            Fechar
          </Button>
          <Button variant="primary" onClick={handleSaveAppointment}>
            Salvar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
    </>
  );
}
