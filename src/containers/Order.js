import React, { useEffect, useState } from "react";
import { Form, Card, Row, Col } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { useAppContext } from "../libs/contextLib";
import LoaderButton from "../components/LoaderButton";
import { onError } from "../libs/errorLib";
import "./Order.css";
import { Auth, API } from "aws-amplify";
import { email } from "../libs/emailLib";

export default function Order() {
  const history = useHistory();

  const [products, setProducts] = useState("");
  let itemsQTD = [];
  const [cart, updateCart] = useState([]);

  const [nameClient, setNameClient] = useState("");

  const [addressStreet, setAddressStreet] = useState("");
  const [addressNumber, setAddressNumber] = useState("");
  const [addressComplement, setAddressComplement] = useState("");

  const [address, setAddress] = useState("");

  const [content, setContent] = useState("");
  const [totalPrice, setTotalPrice] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAppContext();

  useEffect(() => {
    async function onLoad() {
      if (!isAuthenticated) {
        return;
      }

      try {
        const products = await loadProducts();
        setProducts(products);
      } catch (e) {
        onError(e);
      }

      setIsLoading(false);
    }
    onLoad();
  }, [isAuthenticated]);

  function loadProducts() {
    return API.get("order", "/postitstore-products");
  }

  function renderProductsList(products) {
    return (
      <>
        {products
          .filter((p) => p.stock > 0)
          .map(({ productID, name, value, description, imageSource }) => (
            <Card key={productID} className="product">
              <Card.Img
                className="productImg"
                variant="top"
                src={imageSource}
              />
              <Card.Body>
                <Card.Title>{name}</Card.Title>
                <Card.Subtitle>R${value}</Card.Subtitle>
                <Card.Text>{description}</Card.Text>
              </Card.Body>
              <Form.Control
                value={itemsQTD[productID]}
                type="number"
                placeholder="Quantidade"
                min="0"
                onChange={(e) => {
                  let tempArray = [...cart];
                  tempArray[productID] = {
                    id: productID,
                    name,
                    qtd: e.target.value,
                    value,
                  };
                  updateCart(tempArray);
                }}
              />
            </Card>
          ))}
      </>
    );
  }

  function renderProducts() {
    return <>{!isLoading && renderProductsList(products)}</>;
  }

  function validateForm() {
    return (
      content.length > 0 &&
      nameClient.length > 0 &&
      addressStreet.length > 0 &&
      addressNumber.length > 0
    );
  }

  useEffect(() => {
    let totalPriceProducts = [];
    let eachContent = [];

    cart.forEach((e) => {
      if (e) {
        totalPriceProducts[e.id] = e.qtd * e.value;
        if (e.qtd > 0) eachContent.push(`${e.qtd}x ${e.name}`);
      }
    });

    setTotalPrice(
      totalPriceProducts
        .filter((e) => e > 0)
        .reduce((ant = 0, atual = 0) => ant + atual, 0)
        .toFixed(2)
    );
    setContent(eachContent.join("\n"));
  }, [cart]);

  useEffect(() => {
    let fullAddress = "";
    fullAddress += `Logradouro: ${addressStreet} Numero: ${addressNumber} Complemento: ${
      addressComplement || "-"
    }`;
    setAddress(fullAddress);
  }, [addressStreet, addressNumber, addressComplement]);

  async function handleSubmit(event) {
    event.preventDefault();
    setIsLoading(true);

    const { attributes } = await Auth.currentAuthenticatedUser();

    try {
      await makeOrder({
        nameClient,
        emailClient: attributes.email,
        address,
        content,
        totalPrice,
      });
      email(content, attributes.email);
      history.push("/myorders");
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  function makeOrder(order) {
    return API.post("order", "/postitstore", {
      body: order,
    });
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="nameClient">
        <Form.Label>Nome Completo (*)</Form.Label>
        <Form.Control
          placeholder="ex.: João da Silva"
          value={nameClient}
          onChange={(e) => setNameClient(e.target.value)}
        />
      </Form.Group>

      <Row className="contentPrice">
        <Form.Group as={Col} controlId="addressStreet">
          <Form.Label>Logradouro (*)</Form.Label>
          <Form.Control
            value={addressStreet}
            placeholder="Rua João da Silva Silva"
            onChange={(e) => setAddressStreet(e.target.value)}
          />
        </Form.Group>

        <Form.Group as={Col} controlId="addressNumber">
          <Form.Label>Nº (*)</Form.Label>
          <Form.Control
            value={addressNumber}
            placeholder="231"
            onChange={(e) => {
              if (!isNaN(e.target.value)) setAddressNumber(e.target.value);
            }}
          />
        </Form.Group>

        <Form.Group as={Col} controlId="addressComplement">
          <Form.Label>Complemento</Form.Label>
          <Form.Control
            value={addressComplement}
            placeholder="Bloco X"
            onChange={(e) => setAddressComplement(e.target.value)}
          />
        </Form.Group>
      </Row>

      <Form.Group className="products">{renderProducts()}</Form.Group>

      <Row className="contentPrice">
        <Form.Group as={Col} className="contentBox">
          <Form.Label>Conteúdo do Pedido</Form.Label>
          <Form.Control
            value={content}
            placeholder="NENHUM PRODUTO"
            as="textarea"
            rows="4"
            onChange={(e) => setAddressStreet(e.target.value)}
            readOnly
          />
        </Form.Group>

        <Form.Group as={Col} controlId="totalPrice">
          <Form.Label>Preço Total</Form.Label>
          <Form.Control value={totalPrice} readOnly />
        </Form.Group>
      </Row>

      <LoaderButton
        block
        type="submit"
        size="lg"
        variant="primary"
        isLoading={isLoading}
        disabled={!validateForm()}
      >
        Comprar
      </LoaderButton>
    </Form>
  );
}
