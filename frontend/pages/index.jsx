import styled from '@emotion/styled';
import firebase from '../firebase';
import React from 'react';

export default () => {
  const [steps, setSteps] = React.useState(null);
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
  return <div>Hello! {steps}</div>;
};
