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
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    confirmationCode: "",
  });
  const history = useHistory();
  const [newUser, setNewUser] = useState(null);
  const { userHasAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);

  //Valida o formulário de acordo com os parametros definidos
  function validateForm() {
    return (
      fields.name.length > 0 &&
      fields.email.length > 0 &&
      fields.password.length > 0 &&
      fields.password === fields.confirmPassword
    );
  }

  function validateConfirmationForm() {
    return fields.confirmationCode.length > 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setIsLoading(true);

    try {
      const newUser = await Auth.signUp({
        username: fields.email,
        password: fields.password,
        attributes: {
          name: fields.name,
        },
      });
      setIsLoading(false);
      setNewUser(newUser);
    } catch (e) {
      onError(e);

      //Tratamento de exceção para o caso do usuário ter sido cadastro mas não ter recebido o código de verificação
      if (e.name === "UsernameExistsException") {
        setNewUser({
          username: fields.email,
          password: fields.password,
          attributes: {
            name: fields.name,
          },
        });
        Auth.resendSignUp(fields.email);
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
    }
  }

  async function handleConfirmationSubmit(event) {
    event.preventDefault();

    setIsLoading(true);

    //Se for possível cadastrar, já executa o login com os dados fornecidos
    try {
      await Auth.confirmSignUp(fields.email, fields.confirmationCode);
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
        <Form.Group controlId="confirmationCode" size="lg">
          <Form.Label>Código de Confirmação:</Form.Label>
          <Form.Control
            autoFocus
            type="tel"
            onChange={handleFieldChange}
            value={fields.confirmationCode}
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
          Verificar
        </LoaderButton>
      </Form>
    );
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
          <Form.Control
            type="email"
            value={fields.email}
            onChange={handleFieldChange}
          />
          <Form.Text muted>
            *É necessário colocar um e-mail válido para receber o seu código de
            verificação.
          </Form.Text>
        </Form.Group>
        <Form.Group controlId="password" size="lg">
          <Form.Label>Senha</Form.Label>
          <Form.Control
            type="password"
            value={fields.password}
            onChange={handleFieldChange}
          />
        </Form.Group>
        <Form.Group controlId="confirmPassword" size="lg">
          <Form.Label>Confirme sua senha</Form.Label>
          <Form.Control
            type="password"
            onChange={handleFieldChange}
            value={fields.confirmPassword}
          />
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
          Cadastrar
        </LoaderButton>
      </Form>
    );
  }

  return (
    <div className="Signup">
      {newUser === null ? renderForm() : renderConfirmationForm()}
    </div>
  );
}
