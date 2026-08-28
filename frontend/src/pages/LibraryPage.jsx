import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Form, InputGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faSearch } from '@fortawesome/free-solid-svg-icons';
import api from '../services/api';

const LibraryPage = () => {
    const [books, setBooks] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            const response = await api.get('/library');
            if (response.data.success) {
                setBooks(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching books:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredBooks = books.filter(book => 
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.isbn.includes(searchTerm)
    );

    if (loading) {
        return <div className="text-center py-5">Loading...</div>;
    }

    return (
        <Container fluid className="library-page" style={{ padding: '20px' }}>
            <h2 className="page-title"><FontAwesomeIcon icon={faBook} className="me-2" /> Library</h2>
            <p className="text-muted">Browse the library catalog and check book availability.</p>

            <Row className="mb-4">
                <Col md={6} lg={4}>
                    <InputGroup>
                        <InputGroup.Text><FontAwesomeIcon icon={faSearch} /></InputGroup.Text>
                        <Form.Control 
                            type="text" 
                            placeholder="Search by title, author, or ISBN..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </InputGroup>
                </Col>
            </Row>

            <Card className="shadow-sm border-0">
                <Card.Body>
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Title</th>
                                <th>Author</th>
                                <th>ISBN</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredBooks.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center text-muted">No books found.</td>
                                </tr>
                            ) : (
                                filteredBooks.map((book, index) => (
                                    <tr key={book.id}>
                                        <td>{index + 1}</td>
                                        <td>{book.title}</td>
                                        <td>{book.author}</td>
                                        <td>{book.isbn}</td>
                                        <td>
                                            <Badge bg={book.status === 'available' ? 'success' : 'warning'}>
                                                {book.status === 'available' ? 'Available' : 'Issued'}
                                            </Badge>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default LibraryPage;