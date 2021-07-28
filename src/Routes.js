import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./containers/Home";
import NotFound from "./containers/NotFound";
import Login from "./containers/Login";
import Signup from "./containers/Signup";
import Order from "./containers/Order";
import MyOrder from "./containers/MyOrder";

export default function Routes() {
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route exact path="/login">
        <Login />
      </Route>
      <Route exact path="/signup">
        <Signup />
      </Route>
      <Route exact path="/order/new">
        <Order />
      </Route>
      <Route exact path="/order/:id">
        <MyOrder />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}