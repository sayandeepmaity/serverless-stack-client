import React from "react";
import { Switch, Route } from "react-router-dom";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute";
import Home from "./containers/Home";
import NotFound from "./containers/NotFound";
import Login from "./containers/Login";
import Signup from "./containers/Signup";
import NewNote from "./containers/NewNote";
import Notes from "./containers/Notes";
import MarioGame from "./containers/MarioGame";

export default function Routes() {
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <UnauthenticatedRoute exact path="/Login">
        <Login />
      </UnauthenticatedRoute>
      <UnauthenticatedRoute exact path="/Signup">
        <Signup />
      </UnauthenticatedRoute>
      <AuthenticatedRoute exact path="/Notes/New">
        <NewNote />
      </AuthenticatedRoute>
      <AuthenticatedRoute exact path="/Notes/:id">
        <Notes />
      </AuthenticatedRoute>
      <AuthenticatedRoute exact path="/MarioGame">
        <MarioGame />
      </AuthenticatedRoute>
      <NotFound />
    </Switch>
  );
}