import React, { useEffect, useRef, useState } from "react";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useHistory } from "react-router-dom";
import LoaderButton from "../components/LoaderButton";
import { onError } from "../libs/errorLib";
import "./Order.css";
import { API } from "aws-amplify";

export default function Order() {
  const history = useHistory();

  const [nameClient, setNameClient] = useState("");

  const [addressStreet, setAddressStreet] = useState("");
  const [addressNumber, setAddressNumber] = useState("");
  const [addressComplement, setAddressComplement] = useState("");

  const [address, setAddress] = useState("");
  
  const [product1, setProduct1] = useState("");
  const [product2, setProduct2] = useState("");
  const [product3, setProduct3] = useState("");

  const [content, setContent] = useState("");
  const [totalPrice, setTotalPrice] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  function validateForm() {
    return content.length > 0 && nameClient.length > 0 && addressStreet.length > 0 && addressNumber.length > 0;
  }


  useEffect(() => {
    let products = '';
    setTotalPrice(`${((product1 * 5.99) + (product2 * 16.99) + (product3 * 9.99)).toFixed(2)}`);
    if(product1 > 0)
      products += `${product1}x Post-it Rosa\n`;
    if(product2 > 0)
      products += `${product2}x Post-it Multicolorido\n`;  
    if(product3 > 0)
      products += `${product3}x Post-it Azul\n`;
    setContent(products);
  }, [product1, product2, product3]);

  useEffect(() => {
    let fullAddress = '';
    fullAddress += `Logradouro: ${addressStreet} Numero: ${addressNumber} Complemento: ${addressComplement || '-'}`
    setAddress(fullAddress);
  }, [addressStreet, addressNumber, addressComplement])

  async function handleSubmit(event) {
    event.preventDefault();

    setIsLoading(true);
  
    try {
      await makeOrder({ nameClient, address, content, totalPrice });
      history.push("/");
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }
  
  function makeOrder(order) {
    order.content = order.content.replace(/\n/g,'; ');
    return API.post("order", "/postitstore", {
      body: order
    });
  }

  return (
      <Form onSubmit={handleSubmit}>

        <Form.Group controlId="nameClient">
          <Form.Label>
          Nome Completo (*)
          </Form.Label>
          <Form.Control placeholder="ex.: João da Silva" value={nameClient} onChange={(e) => setNameClient(e.target.value)}/>
        </Form.Group>

        <Row className="mb-3">

          <Form.Group as={Col} controlId="addressStreet">
            <Form.Label>
            Logradouro (*)
            </Form.Label>
            <Form.Control value={addressStreet} placeholder="Rua João da Silva Silva" onChange={(e) => setAddressStreet(e.target.value)} />
          </Form.Group>

          <Form.Group as={Col} controlId="addressNumber">
            <Form.Label>
            Nº (*)
            </Form.Label>
            <Form.Control value={addressNumber} placeholder="231" onChange={(e) => {if(!isNaN(e.target.value))setAddressNumber(e.target.value)}} />
          </Form.Group>
          
          <Form.Group as={Col} controlId="addressComplement">
            <Form.Label>
            Complemento
            </Form.Label>
            <Form.Control value={addressComplement} placeholder="Bloco X" onChange={(e) => setAddressComplement(e.target.value)} />
          </Form.Group>

        </Row>



        <Form.Group id="products">

        <Card className="product" >
          <Card.Img id="productsImg" variant="top" src="https://s3.amazonaws.com/lepok.w/produtos/produtos/prod/09420.jpg" />
          <Card.Body>
            <Card.Title>Post-it Rosa</Card.Title>
            <Card.Subtitle>R$5.99</Card.Subtitle>
            <Card.Text>
              Some quick example text to build on the card title and make up the bulk of
              the card's content.
            </Card.Text>
          </Card.Body>
          <Form.Control className="qtdProduct" label="Post-it Rosa" value={product1} type="number" placeholder="Quantidade" min="0"
          onChange={(e) => {setProduct1(e.target.value);}} />
        </Card>
        
        <Card className="product" >
          <Card.Img id="productsImg" variant="top" src="https://multimedia.3m.com/mws/media/1579045P/653-post-it-tropical-50f.jpg" />
          <Card.Body>
            <Card.Title>Post-it Multicolorido</Card.Title>
            <Card.Subtitle>R$16.99</Card.Subtitle>
            <Card.Text>
              Some quick example text to build on the card title and make up the bulk of
              the card's content.
            </Card.Text>
          </Card.Body>
          <Form.Control className="qtdProduct" label="Post-it Multicolorido" value={product2} type="number" placeholder="Quantidade" min="0"
          onChange={(e) => {setProduct2(e.target.value);}} />
        </Card>

        <Card className="product" >
          <Card.Img id="productsImg" variant="top" src="https://a-static.mlcdn.com.br/1500x1500/bloco-post-it-654-azul-com-45-folhas-3m/lepok1/19981/6540777360485beb41a9520557b63f54.jpg" />
          <Card.Body>
            <Card.Title>Post-it Azul</Card.Title>
            <Card.Subtitle>R$9.99</Card.Subtitle>
            <Card.Text>
              Some quick example text to build on the card title and make up the bulk of
              the card's content.
            </Card.Text>
          </Card.Body>
          <Form.Control className="qtdProduct" label="Post-it Azul" value={product3} type="number" placeholder="Quantidade" min="0"
          onChange={(e) => {setProduct3(e.target.value);}} />
          </Card>
          
          </Form.Group>


          <Row className="mb-3">
            <Col xs={8}>
            <Form.Group className="contentBox">
              <Form.Label>
              Conteúdo do Pedido
              </Form.Label>
              <Form.Control  value={content} placeholder="NENHUM PRODUTO" as="textarea" rows="4" onChange={(e) => setAddressStreet(e.target.value)} readOnly/>
            </Form.Group>
            </Col>

            <Col xs={2}>
            <Form.Group controlId="totalPrice">
              <Form.Label>
              Preço Total
              </Form.Label>
              <Form.Control value={totalPrice} readOnly/>
            </Form.Group>
            </Col>

        </Row>
        
        <LoaderButton block type="submit" size="lg" variant="primary" isLoading={isLoading} disabled={!validateForm()} >
          Create
        </LoaderButton>

      </Form>
  );
}