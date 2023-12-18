import Link from 'next/link';
import React from 'react';
import { Container, Navbar } from 'react-bootstrap';

export default function Footer() {
  return (
    <Container className="footer">
      <Navbar className="navbar foot" expand="lg" variant="dark">
        <Container>
          <Link passHref href="/">
            <Navbar.Brand className="brand">tradebook</Navbar.Brand>
          </Link>
          <p>Copyright © 2023 TradeBook, LLC </p>
        </Container>
      </Navbar>
    </Container>
  );
}
