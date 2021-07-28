import React, { useState, useEffect } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import { useAppContext } from "../libs/contextLib";
import { onError } from "../libs/errorLib";
import "./Home.css";
import { API } from "aws-amplify";
import { BsPencilSquare } from "react-icons/bs";
import { LinkContainer } from "react-router-bootstrap";

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
        <LinkContainer to="/order/new">
          <ListGroup.Item action className="py-3 text-nowrap text-truncate">
            <BsPencilSquare size={17} />
            <span className="ml-2 font-weight-bold">Faça um novo pedido</span>
          </ListGroup.Item>
        </LinkContainer>
        {order.map(({ orderID, totalPrice, address, content, boughtAt }) => (
          <LinkContainer key={orderID} to={`/order/${orderID}`}>
            <ListGroup.Item action>
            <span className="font-weight-bold">
                {content.trim().split("\n")[0]}
              </span>
              <br />
            <span className="font">
                Preço total: R${totalPrice.trim().split("\n")[0]}
              </span>
              <br />
            <span className="font">
                {address.trim().split("\n")[0]}
              </span>
              <br />
              <br />
              <span className="text-muted">
                Realizada em: {new Date(boughtAt).toLocaleString()}
              </span>
            </ListGroup.Item>
          </LinkContainer>
        ))}
      </>
    );
  }

  function renderLander() {
    return (
      <div className="lander">
        <h1>Post-It: A Coisa</h1>
        <p className="text-muted">Lembre-se do que mais te assusta!</p>
        <form>
        <input type="text" />
        <input type="file" />
      </form>
      </div>
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
      {isAuthenticated ? renderOrder() : renderLander()}
    </div>
  );
}