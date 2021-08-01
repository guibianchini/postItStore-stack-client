import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import { useHistory } from "react-router-dom";
import LoaderButton from "../components/LoaderButton";
import { useAppContext } from "../libs/contextLib";
import { useFormFields } from "../libs/hooksLib";
import { onError } from "../libs/errorLib";
import "./Signup.css";
import { Auth } from "aws-amplify";

export default function Signup() {
  const [fields, handleFieldChange] = useFormFields({
    email: "",
    password: "",
    confirmPassword: "",
    confirmationCode: "",
  });

  const history = useHistory();
  const [newPass, setNewPass] = useState(null);
  const { userHasAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);

  //Valida o formulário de acordo com os parametros definidos
  function validateForm() {
    return fields.email.length > 0;
  }

  function validateConfirmationForm() {
    return (
      fields.confirmationCode.length > 0 &&
      fields.password.length > 0 &&
      fields.password === fields.confirmPassword &&
      fields.confirmationCode.length > 0
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setIsLoading(true);

    try {
      const newPass = await Auth.forgotPassword(fields.email);
      setIsLoading(false);
      setNewPass(newPass);
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  async function handleConfirmationSubmit(event) {
    event.preventDefault();

    setIsLoading(true);

    //Se for possível cadastrar, já executa o login com os dados fornecidos
    try {
      await Auth.forgotPasswordSubmit(
        fields.email,
        fields.confirmationCode,
        fields.password
      );
      await Auth.signIn(fields.email, fields.password);
      userHasAuthenticated(true);
      history.push("/");
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  function renderConfirmationForm() {
    return (
      <Form onSubmit={handleConfirmationSubmit}>
        <Form.Group controlId="password" size="lg">
          <Form.Label>Nova Senha</Form.Label>
          <Form.Control
            type="password"
            value={fields.password}
            onChange={handleFieldChange}
          />
        </Form.Group>
        <Form.Group controlId="confirmPassword" size="lg">
          <Form.Label>Confirme sua nova senha</Form.Label>
          <Form.Control
            type="password"
            onChange={handleFieldChange}
            value={fields.confirmPassword}
          />
        </Form.Group>

        <Form.Group controlId="confirmationCode" size="lg">
          <Form.Label>Código de Confirmação:</Form.Label>
          <Form.Control
            type="tel"
            value={fields.confirmationCode}
            onChange={handleFieldChange}
          />
          <Form.Text muted>
            Por favor, verifique o código enviado ao seu e-mail.
          </Form.Text>
        </Form.Group>

        <LoaderButton
          block
          size="lg"
          type="submit"
          variant="success"
          isLoading={isLoading}
          disabled={!validateConfirmationForm()}
        >
          Confirmar
        </LoaderButton>
      </Form>
    );
  }

  function renderForm() {
    return (
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="email" size="lg">
          <Form.Label>Email</Form.Label>
          <Form.Control
            autoFocus
            type="email"
            value={fields.email}
            onChange={handleFieldChange}
          />
          <Form.Text muted>
            *É necessário colocar um e-mail válido para receber o seu código de
            verificação.
          </Form.Text>
        </Form.Group>
        <LoaderButton
          className="loaderButton"
          block
          size="lg"
          type="submit"
          variant="outline-primary"
          isLoading={isLoading}
          disabled={!validateForm()}
        >
          Receber Código
        </LoaderButton>
      </Form>
    );
  }

  return (
    <div className="Forgotpass">
      {newPass === null ? renderForm() : renderConfirmationForm()}
    </div>
  );
}
