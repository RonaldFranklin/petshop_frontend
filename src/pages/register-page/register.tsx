import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './register.scss';
import dogImage from '../../images/dog.png';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/home');
        }
    }, [navigate]);

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    
        if (!name || !email || !password || !phone || !address) {
          toast.error('Por favor, preencha todos os campos!');
          return;
        }
    
        try {
          const url: string = import.meta.env.VITE_API_URL + 'users';
          const response = await axios.post(url, {
            "Name": name,
            "Email": email,
            "Password": password,
            "Phone": phone,
            "Address": address
          });
    
          const { data } = response;
          
          if (data.success) {
            toast.success('Cadastro bem-sucedido! Redirecionando para o login...');
            setTimeout(() => {
              navigate('/');
            }, 1000);
          } else {
            toast.error('Ocorreu um erro ao tentar se cadastrar.');
          }
        } catch (error) {
          toast.error('Ocorreu um erro ao tentar se cadastrar.');
          console.error(error);
        }
    };

    return(
        <Container fluid className="vh-100">
        <Row className="h-100">
            <Col md={6} className="left-side d-none d-md-flex justify-content-center align-items-center">
                <div className="image-container text-center">
                    <img
                    src={dogImage}
                    alt="Imagem"
                    className="img-fluid w-50"
                    />
                </div>
            </Col>

            <Col md={6} className="right-side d-flex flex-column justify-content-center align-items-center">
            <h1>Cadastro</h1>

            
            <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />

            <Form className="w-75" onSubmit={handleRegister}>
                <Form.Group controlId="formBasicName" className="mb-3">
                <Form.Label>Nome</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Digite seu nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                </Form.Group>

                <Form.Group controlId="formBasicEmail" className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                    type="email"
                    placeholder="Digite seu email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                </Form.Group>

                <Form.Group controlId="formBasicPassword" className="mb-3">
                <Form.Label>Senha</Form.Label>
                <Form.Control
                    type="password"
                    placeholder="Digite sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                </Form.Group>

                <Form.Group controlId="formBasicPhone" className="mb-3">
                <Form.Label>Telefone</Form.Label>
                <Form.Control
                    type="tel"
                    placeholder="Digite seu telefone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                />
                </Form.Group>

                <Form.Group controlId="formBasicAddress" className="mb-3">
                <Form.Label>Endereço</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Digite seu endereço"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100 mb-3">
                Cadastrar
                </Button>

                <a href="/" className="register-link">
                Já tem uma conta? Faça login
                </a>
            </Form>
            </Col>
        </Row>

        
        </Container>
    );
}