import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { API } from "aws-amplify";
import { onError } from "../libs/errorLib";
import Form from "react-bootstrap/Form";
import LoaderButton from "../components/LoaderButton";
import config from "../config";
import "./MyOrder.css";

export default function MyOrder() {
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const { id } = useParams();
  const history = useHistory();
  const [order, setOrder] = useState(null);
  const [content, setContent] = useState("");
  const [totalPrice, setTotalPrice] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    function loadOrder() {
      return API.get("order", `/postitstore/${id}`);
    }

    async function onLoad() {
      try {
        const order = await loadOrder();
        const { totalPrice, address, content } = order;
        setContent(content);
        setTotalPrice(totalPrice);
        setAddress(address);
        setOrder(order);
      } catch (e) {
        onError(e);
      }
    }
    onLoad();
  }, [id]);

  function validateForm() {
    return content.length > 0;
  }
  
  function formatFilename(str) {
    return str.replace(/^\w+-/, "");
  }
  
  async function handleSubmit(event) {
    let attachment;
  
    event.preventDefault();
  
    setIsLoading(true);
  }
  
  async function handleDelete(event) {
    event.preventDefault();
  
    const confirmed = window.confirm(
      "Are you sure you want to delete this note?"
    );
  
    if (!confirmed) {
      return;
    }
  
    setIsDeleting(true);
  }
  
  return (
    <div className="MyOrder">
      {order && (
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="content">
            <Form.Control
              as="textarea"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="file">
            <Form.Label>Attachment</Form.Label>
            {order.attachment && (
              <p>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={order.attachmentURL}
                >
                  {formatFilename(order.attachment)}
                </a>
              </p>
            )}
          </Form.Group>
          <LoaderButton
            block
            size="lg"
            type="submit"
            isLoading={isLoading}
            disabled={!validateForm()}
          >
            Save
          </LoaderButton>
          <LoaderButton
            block
            size="lg"
            variant="danger"
            onClick={handleDelete}
            isLoading={isDeleting}
          >
            Delete
          </LoaderButton>
        </Form>
      )}
    </div>
  );
}