import React, { useState } from 'react';
import { Container, Row, Col, Card, Table, Badge, Form, InputGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faSearch } from '@fortawesome/free-solid-svg-icons';

const LibraryPage = () => {
    const [books] = useState([
        { id: 1, title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', isbn: '978-0262033848', status: 'available' },
        { id: 2, title: 'The Art of Computer Programming', author: 'Donald E. Knuth', isbn: '978-0321751041', status: 'issued' },
        { id: 3, title: 'Clean Code', author: 'Robert C. Martin', isbn: '978-0132350884', status: 'available' },
        { id: 4, title: 'Design Patterns', author: 'Erich Gamma', isbn: '978-0201633610', status: 'available' },
        { id: 5, title: 'Computer Networks', author: 'Andrew S. Tanenbaum', isbn: '978-0132126953', status: 'issued' },
        { id: 6, title: 'Operating System Concepts', author: 'Abraham Silberschatz', isbn: '978-1118063330', status: 'available' },
    ]);

    const [searchTerm, setSearchTerm] = useState('');

    const filteredBooks = books.filter(book => 
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.isbn.includes(searchTerm)
    );

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