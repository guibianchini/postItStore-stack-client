import React, { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import { useHistory, Link } from "react-router-dom";
import LoaderButton from "../components/LoaderButton";
import { useAppContext } from "../libs/contextLib";
import { useFormFields } from "../libs/hooksLib";
import { onError } from "../libs/errorLib";
import "./Profile.css";
import { Auth } from "aws-amplify";

export default function Update() {
  const [currentUser, updateCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAppContext();

  useEffect(() => {
    async function onLoad() {
      if (!isAuthenticated) {
        return;
      }
      try {
        const user = await Auth.currentAuthenticatedUser();
        updateCurrentUser(user);

      } catch (e) {
        if (e !== "No current user") {
          onError(e);
        }
      }

      setIsLoading(false);
    }
    onLoad();
  }, []);

  function renderForm() {
    return (
      <Form onSubmit="">
        <Form.Group controlId="name" size="lg">
          <Form.Label>Nome Completo</Form.Label>
          <Form.Control
            autoFocus
            type="name"
            value={currentUser.attributes.name}
            readOnly
          />
        </Form.Group>

        <Form.Group controlId="email" size="lg">
          <Form.Label>Email</Form.Label>
          <Form.Control
            autoFocus
            type="email"
            value={currentUser.attributes.email}
            readOnly
          />

        </Form.Group>
        <Link className="linkButton" to="/settings">
          <Button block size="lg" variant="primary">
            Alterar Cadastro
          </Button>
        </Link>
        <Link className="linkButton" to="/">
          <Button block size="lg" variant="outline-danger">
            Cancelar
          </Button>
        </Link>
      </Form>
    );
  }

  return <div className="Profile"><h2 className="pb-3 mb-3 border-bottom">Meus Dados</h2>{!isLoading && renderForm()}</div>;
}
