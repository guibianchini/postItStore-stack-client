import React, { useState, useEffect } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import { useAppContext } from "../libs/contextLib";
import { onError } from "../libs/errorLib";
import "./Home.css";
import { API } from "aws-amplify";
import { Card } from "react-bootstrap";

export default function Home() {
  const [order, setOrder] = useState([]);
  const { isAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);

  //useEffect para carregar pedidos feitos que estão armazenados no database
  useEffect(() => {
    async function onLoad() {
      if (!isAuthenticated) {
        return;
      }

      try {
        const order = await loadOrder();
        setOrder(order);
      } catch (e) {
        onError(e);
      }

      setIsLoading(false);
    }

    onLoad();
  }, [isAuthenticated]);

  function loadOrder() {
    return API.get("order", "/postitstore");
  }

  //Prepara renderização para o usuário de cada pedido do banco
  function renderOrderList(order) {
    return (
      <>
        {order.map(
          ({ nameClient, orderID, totalPrice, address, content, boughtAt }) => (
            <Card key={orderID} className="order">
              <Card.Body>
                <Card.Title className="font-weight-bold">
                  Pedido
                </Card.Title>
                <Card.Subtitle>Destinatário: {nameClient}</Card.Subtitle>
                <Card.Text className="font">
                  Preço total: <em>R${totalPrice.trim().split("\n")[0]}</em>
                </Card.Text>
                <Card.Text className="font">
                  Endereço:{address.split(":")[1].replace("Numero", " ")}
                </Card.Text>
                <Card.Text className="text-muted">
                  Conteúdo: {content.replace('\n','; ')}
                </Card.Text>
                <Card.Text className="text-muted ">
                  Realizada em: {new Date(boughtAt).toLocaleString()}
                </Card.Text>
              </Card.Body>
            </Card>
          )
        )}
      </>
    );
  }
  
  //Renderiza para o usuário enquanto página está carregando
  function renderOrder() {
    return (
      <div className="Order">
        <h2 className="pb-3 mt-4 mb-3 border-bottom">Meus Pedidos</h2>
        <ListGroup>{!isLoading && renderOrderList(order)}</ListGroup>
      </div>
    );
  }

  return <div className="Home">{renderOrder()}</div>;
}
