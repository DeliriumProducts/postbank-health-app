import React from 'react';
import axios from 'axios';
import Link from 'next/link';
import Button from '../components/Button';
import styled from '@emotion/styled';
import { message } from 'antd';

import { withRouter } from 'next/router';
import firebase from '../firebase/';
import { Context } from '../context/context';
import { Input } from 'antd';

const Container = styled.div`
  min-height: 100vh;
`;

function Hello({ router }) {
  const { state, dispatch } = React.useContext(Context);
  const [ac, setAc] = React.useState(null);

  const handleLogin = async () => {
    const result = await firebase.loginWithPopup('google');
    setAc(result.credential.accessToken);
    console.log(result);
  };

  return (
    <Container>
      <h1>
        The value of message is <strong>{router.query.message}</strong>
      </h1>
      <h1>
        The value of foo (from the context) is <strong>{state.foo}</strong>
      </h1>
      <Input
        value={state.foo}
        style={{ width: '50%' }}
        onChange={e => {
          dispatch({ type: 'setFoo', payload: e.target.value });
        }}
      ></Input>
      <br />
      <br />
      <Button onClick={handleLogin}>Login with google</Button>
      <Button
        onClick={async () => {
          if (gapi) {
            const res = await gapi.client.fitness.users.dataSources.list({
              userId: 'me'
            });
          } else {
            message.error('Google API not yet ready!');
          }
          // const b = firebase.getCurrentUser().getIdToken();
        }}
      >
        get data
      </Button>
      <br />
      <br />
      <Link href="/protected">
        <Button>Go To Protected route</Button>
      </Link>
    </Container>
  );
}

export default withRouter(Hello);
