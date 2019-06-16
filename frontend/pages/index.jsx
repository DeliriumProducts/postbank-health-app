import styled from '@emotion/styled';
import firebase from '../firebase';
import React from 'react';

const ProfileContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  & > h1 {
    margin: 1rem;
  }
`;

export default () => {
  const [steps, setSteps] = React.useState(null);
  const [user, setUser] = React.useState();

  React.useEffect(() => {
    const result = firebase.getCurrentUser();
    setUser(result);
    console.log(result);
  }, []);

  React.useEffect(() => {
    if (firebase.hasGapiLoadaded) {
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
  });

  return (
    <ProfileContainer>
      {user && (
        <img
          style={{
            width: 300,
            height: 300,
            borderRadius: '50%',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,.25)'
          }}
          src={user.photoURL}
          alt={user.displayName}
        />
      )}
      <h1>{user && user.displayName}</h1>
      <h1>Здравейте! За последните 24 часа сте извървяли {steps} крачки</h1>
    </ProfileContainer>
  );
};
