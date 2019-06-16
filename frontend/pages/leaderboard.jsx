import firebase from '../firebase';
import React from 'react';

export default () => {
  const [leaderboard, setLeaderboard] = React.useState();
  React.useEffect(() => {
    firebase.getLeaderboard().then(a => {
      console.log(a);
      setLeaderboard(a);
    });
  }, []);
  return <div>hello!</div>;
};
