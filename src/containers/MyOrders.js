import React, { useState, useEffect } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import { useAppContext } from "../libs/contextLib";
import { onError } from "../libs/errorLib";
import "./Home.css";
import { API } from "aws-amplify";

export default function Home() {
  const [order, setOrder] = useState([]);
  const { isAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);

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

  function renderOrderList(order) {
    return (
      <>
        {order.map(({ nameClient, orderID, totalPrice, address, content, boughtAt }) => (
            <ListGroup.Item action key={orderID}>
            <span className="font-weight-bold">
                Destinatário: {nameClient}
              </span>
              <br />
            <span className="font-weight-bold">
                Pedido: {content.replaceAll(";"," ")}
              </span>
              <br />
              <br />
            <span className="font">
                Preço total: <em>R${totalPrice.trim().split("\n")[0]}</em>
              </span>
              <br />
            <span className="font">
                Endereço:{address.split(":")[1].replace("Numero"," ")}
              </span>
              <br />
              <br />
              <span className="text-muted">
                Realizada em: {new Date(boughtAt).toLocaleString()}
              </span>
            </ListGroup.Item>
        ))}
      </>
    );
  }


  function renderOrder() {
    return (
      <div className="Order">
        <h2 className="pb-3 mt-4 mb-3 border-bottom">Meus Pedidos</h2>
        <ListGroup>{!isLoading && renderOrderList(order)}</ListGroup>
      </div>
    );
  }

  return (
    <div className="Home">
      {renderOrder()}
    </div>
  );
}