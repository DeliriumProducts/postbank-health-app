import styled from '@emotion/styled';
import withAuth from '../hocs/withAuth.jsx';
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

const MyProfile = () => {
  const [user, setUser] = React.useState();
  const [weight, setWeight] = React.useState(0);
  const [points, setPoints] = React.useState(0);
  const [height, setHeight] = React.useState(0);

  React.useEffect(() => {
    if (firebase.hasGapiLoadaded && user) {
      gapi.client.fitness.users.dataset
        .aggregate({
          userId: 'me',
          aggregateBy: [
            {
              dataTypeName: 'com.google.height',
              dataSourceId:
                'derived:com.google.height:com.google.android.gms:merge_height'
            },
            {
              dataTypeName: 'com.google.weight.summary',
              dataSourceId:
                'derived:com.google.weight:com.google.android.gms:merge_weight'
            }
          ],
          bucketByTime: { durationMillis: 86400000 },
          startTimeMillis: Date.now() - 86400000,
          endTimeMillis: Date.now()
        })
        .then(d => {
          const bucket = d.result.bucket;
          const weightArr = bucket[0].dataset[1].point[0].value;
          const heightArr = bucket[0].dataset[0].point[0].value;

          setWeight(weightArr[weightArr.length - 1].fpVal);
          setHeight(heightArr[heightArr.length - 1].fpVal);
        });
    }
  }, [user]);

  React.useEffect(() => {
    if (user) {
      firebase.getPoints().then(a => {
        setPoints(a.data().points);
      });
    }
  }, [user]);

  React.useEffect(() => {
    const unsubscribe = firebase.onAuthStateChanged(user => {
      if (user) {
        setUser(user);
        console.log(user);
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
            <Card.Meta
              title={
                user && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <h1 style={{ margin: 0 }}>{user.displayName}</h1> :
                    <h2
                      style={{
                        margin: 0,
                        marginRight: 5,
                        marginLeft: 5
                      }}
                    >
                      {points}
                    </h2>{' '}
                    точки
                  </div>
                )
              }
              description={
                <>
                  Тегло: {weight}kg.
                  <br />
                  Височина: {height && Number(height).toFixed(2)}m.
                </>
              }
            ></Card.Meta>
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

export default withAuth(MyProfile);
