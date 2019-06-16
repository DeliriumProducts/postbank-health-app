import styled from '@emotion/styled';
import firebase from '../firebase';
import React from 'react';
import { Button } from 'antd';

const ProfileContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  text-align: center;
  & > h1 {
    margin: 1rem;
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: bold;
`;

export default () => {
  const [steps, setSteps] = React.useState(null);
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    const unsubscribe = firebase.onAuthStateChanged(user => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  React.useEffect(() => {
    if (firebase.hasGapiLoadaded && user) {
      window.gapi.client.fitness.users.dataset
        .aggregate({
          userId: 'me',
          aggregateBy: [
            {
              dataTypeName: 'com.google.step_count.delta',
              dataSourceId:
                'derived:com.google.step_count.delta:com.google.android.gms:estimated_steps'
            }
          ],
          bucketByTime: { durationMillis: 86400000 },
          startTimeMillis: Date.now() - 86400000,
          endTimeMillis: Date.now()
        })
        .then(d => {
          setSteps(d.result.bucket[0].dataset[0].point[0].value[0].intVal);
        });
    }
  }, [user]);

  return (
    <ProfileContainer>
      {user ? (
        <>
          <img
            style={{
              width: '50%',
              height: '50%',
              borderRadius: '50%',
              objectFit: 'cover',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,.25)'
            }}
            src={user.photoURL}
            alt={user.displayName}
          />
          <Title>{user && user.displayName}</Title>
          <h1>Здравейте! За последните 24 часа сте извървяли {steps} крачки</h1>
        </>
      ) : (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column'
          }}
        >
          <img
            style={{ width: '75%', marginBottom: '1rem' }}
            src="/static/postbank.png"
            alt=""
          />
          <Button onClick={firebase.login}>
            Моля влезте със вашия Google account!
          </Button>
        </div>
      )}
    </ProfileContainer>
  );
};
