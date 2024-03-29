import styled from '@emotion/styled';
import { Button } from 'antd';
import React from 'react';
import { FaRunning, FaSwimmer, FaWalking } from 'react-icons/fa';
import { GiCycling } from 'react-icons/gi';
import Spinner from '../components/Spinner';
import firebase from '../firebase';

const ProfileContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  text-align: center;

  & > h1 {
    margin: 1rem;
  }

  border-radius: 10px;
  background-color: white;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  padding: 15px;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: bold;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Activity = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export default () => {
  const [calFromSteps, setCalFromSteps] = React.useState(0);
  const [calFromSwimming, setCalFromSwimming] = React.useState(0);
  const [calFromBiking, setCalFromBiking] = React.useState(0);
  const [calFromRunning, setCalFromRunning] = React.useState(0);

  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const unsubscribe = firebase.onAuthStateChanged(user => {
      if (user) {
        setUser(user);
        setLoading(false);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  React.useEffect(() => {
    if (typeof window !== 'undefined' && firebase.hasGapiLoadaded && user) {
      gapi.client.fitness.users.dataset
        .aggregate({
          userId: 'me',
          aggregateBy: [
            {
              dataTypeName: 'com.google.calories.expended',
              dataSourceId:
                'derived:com.google.calories.expended:com.google.android.gms:from_activities'
            }
          ],
          bucketByActivitySegment: {
            minDurationMilis: 10
          },
          startTimeMillis: Date.now() - 86400000,
          endTimeMillis: Date.now()
        })
        .then(async r => {
          const activities = r.result.bucket.filter(a =>
            [7, 8, 82, 1].includes(a.activity)
          );

          const totalPoints = Math.round(
            activities.reduce((a, activity) => {
              let pointsPerActivity = 0;
              const cal = activity.dataset[0].point[0].value[0].fpVal;
              let points = 0;
              console.log(cal);
              switch (activity.activity) {
                case 7:
                  points = cal * 0.2;
                  pointsPerActivity = a + points;
                  setCalFromSteps(p => Math.round(p + cal));
                  break;
                case 8:
                  points = cal * 0.65;
                  pointsPerActivity = a + points;
                  setCalFromRunning(p => Math.round(p + cal));
                  break;
                case 82:
                  points = cal * 0.8;
                  pointsPerActivity = a + points;
                  setCalFromSwimming(p => Math.round(p + cal));
                  break;
                case 1:
                  points = cal * 0.6;
                  pointsPerActivity = a + points;
                  setCalFromBiking(p => Math.round(p + cal));
                  break;
                default:
                  break;
              }

              return pointsPerActivity;
            }, 0)
          );

          await firebase.setPoints(totalPoints);
        });
    }
  }, [user]);

  if (loading) {
    return (
      <ProfileContainer>
        <Spinner />
      </ProfileContainer>
    );
  } else if (user) {
    return (
      <ProfileContainer>
        <h1 style={{ fontWeight: '600' }}>Печели с движение!</h1>
        <img
          style={{
            width: '35%',
            borderRadius: '50%',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,.25)'
          }}
          src={user.photoURL}
          alt={user.displayName}
        />
        <Title>{user && user.displayName}</Title>
        <h1>
          За <strong>24</strong> часа сте изгорили
          <Container>
            <Activity>
              <FaWalking />{' '}
              <span>
                <strong>{calFromSteps} cal</strong> от ходене
              </span>
            </Activity>
            <Activity>
              <FaRunning />{' '}
              <span>
                <strong>{calFromRunning} cal</strong> от бягане
              </span>
            </Activity>
            <Activity>
              <FaSwimmer />{' '}
              <span>
                <strong>{calFromSwimming} cal</strong> от плуванее
              </span>
            </Activity>
            <Activity>
              <GiCycling />{' '}
              <span>
                <strong>{calFromBiking} cal</strong> от каране на колело
              </span>
            </Activity>
          </Container>
        </h1>
      </ProfileContainer>
    );
  } else {
    return (
      <ProfileContainer>
        <h1 style={{ fontWeight: '600' }}>Печели с движение!</h1>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column'
          }}
        >
          <img
            style={{ width: '35%', marginBottom: '1rem' }}
            src="/static/postbankLogo.png"
            alt=""
          />
          <Button
            type="primary"
            onClick={() => {
              firebase.login();
            }}
          >
            Моля влезте с вашия Google профил!
          </Button>
        </div>
      </ProfileContainer>
    );
  }
};
