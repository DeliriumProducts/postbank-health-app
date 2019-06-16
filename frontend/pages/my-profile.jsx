import styled from '@emotion/styled';
import Router from 'next/router';
import firebase from '../firebase';
import React from 'react';
import { Card, Button } from 'antd';

const ProfileContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  & > button {
    margin: 1rem;
  }
`;

export default () => {
  const [user, setUser] = React.useState();

  React.useEffect(() => {
    const unsubscribe = firebase.onAuthStateChanged(user => {
      if (user) {
        setUser(user);
      } else {
        Router.push('/');
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <ProfileContainer>
      {user && (
        <>
          <Card
            cover={<img src={user && user.photoURL} />}
            style={{
              width: '50%'
            }}
          >
            <Card.Meta title={user && user.displayName}></Card.Meta>
          </Card>
          <Button
            type="primary"
            onClick={() => {
              firebase.logout();
            }}
          >
            Излезте от вашия профил.
          </Button>
        </>
      )}
    </ProfileContainer>
  );
};
