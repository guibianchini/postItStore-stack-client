import React, { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import LoaderButton from "../components/LoaderButton";
import { useAppContext } from "../libs/contextLib";
import { useFormFields } from "../libs/hooksLib";
import { onError } from "../libs/errorLib";
import "./Settings.css";
import { Auth } from "aws-amplify";

export default function Update() {
  const [fields, handleFieldChange] = useFormFields({
    name: "",
    email: "",
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAppContext();

  useEffect(() => {
    async function onLoad() {
      if (!isAuthenticated) {
        return;
      }

      try {
        const user = await Auth.currentAuthenticatedUser();
        fields.name = user.attributes.name;
        fields.email = user.attributes.email;
      } catch (e) {
        if (e !== "No current user") {
          onError(e);
        }
      }

      setIsLoading(false);
    }
    onLoad();
  }, [fields, isAuthenticated]);

  //Valida o formulário de acordo com os parametros definidos
  function validateForm() {
    return (
      (fields.name.length > 0 && fields.email.length > 0) ||
      (fields.name.length > 0 &&
        fields.oldPassword.length > 0 &&
        fields.newPassword === fields.confirmNewPassword &&
        fields.email.length > 0)
    );
  }

  async function updateUser() {
    const user = await Auth.currentAuthenticatedUser();

    if (fields.name !== user.attributes.name) {
      await Auth.updateUserAttributes(user, {
        name: `${fields.name}`,
      });
    }
    if (
      fields.newPassword === fields.confirmNewPassword &&
      fields.oldPassword.length > 0
    ) {
      Auth.currentAuthenticatedUser().then((user) => {
        return Auth.changePassword(
          user,
          fields.oldPassword,
          fields.newPassword
        );
      });
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setIsLoading(true);

    try {
      updateUser();
      window.location.reload();
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  function renderForm() {
    return (
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="name" size="lg">
          <Form.Label>Nome Completo</Form.Label>
          <Form.Control
            autoFocus
            type="name"
            value={fields.name}
            onChange={handleFieldChange}
          />
        </Form.Group>

        <Form.Group controlId="email" size="lg">
          <Form.Label>Email</Form.Label>
          <Form.Control autoFocus type="email" value={fields.email} readOnly />
        </Form.Group>

        <Form.Group controlId="oldPassword" size="lg">
          <Form.Label>Antiga Senha</Form.Label>
          <Form.Control
            type="password"
            value={fields.oldPassword}
            onChange={handleFieldChange}
          />
        </Form.Group>
        <Form.Group controlId="newPassword" size="lg">
          <Form.Label>Nova Senha</Form.Label>
          <Form.Control
            type="password"
            value={fields.newPassword}
            onChange={handleFieldChange}
          />
        </Form.Group>
        <Form.Group controlId="confirmNewPassword" size="lg">
          <Form.Label>Confirme sua nova senha</Form.Label>
          <Form.Control
            type="password"
            onChange={handleFieldChange}
            value={fields.confirmNewPassword}
          />
        </Form.Group>
        <LoaderButton
          block
          size="lg"
          type="submit"
          variant="primary"
          isLoading={isLoading}
          disabled={!validateForm()}
        >
          Alterar
        </LoaderButton>

        <Link className="linkButton" to="/profile">
          <Button block size="lg" variant="outline-danger">
            Cancelar
          </Button>
        </Link>
      </Form>
    );
  }

  return (
    <div className="settings">
      <h2 className="pb-3 mb-3 border-bottom">Alterar Dados</h2>
      {!isLoading && renderForm()}
    </div>
  );
}
