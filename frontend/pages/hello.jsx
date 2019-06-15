import React from 'react';
import axios from 'axios';
import Link from 'next/link';
import Button from '../components/Button';
import styled from '@emotion/styled';

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
          console.log(ac);
          const r = await axios.get(
            'https://www.googleapis.com/fitness/v1/users/me/dataSources',
            // {
            //   aggregateBy: [
            //     {
            //       dataTypeName: 'com.google.step_count.delta',
            //       dataSourceId:
            //         'derived:com.google.calories.expended:com.google.android.gms:from_bmr'
            //     }
            //   ],
            //   bucketByTime: { durationMillis: 86400000 },
            //   startTimeMillis: Date.now() - 86400000,
            //   endTimeMillis: Date.now()
            // },
            {
              headers: {
                Authorization: `Bearer ${ac}`
              },
              withCredentials: true
            }
          );

          console.log(r);
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
