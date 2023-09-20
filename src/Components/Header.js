import {Col, Container, Row} from "react-bootstrap";
function Header() {
  return (
        <header className={'header-container'}>
            <Container>
                <Row className={'header-title'}>
                    <Col>
                        <h2>Task Manager Dashboard</h2>
                    </Col>
                </Row>
            </Container>
        </header>
  );
}
export default Header;
