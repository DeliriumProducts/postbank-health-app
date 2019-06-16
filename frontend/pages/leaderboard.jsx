import firebase from '../firebase';
import React from 'react';

export default () => {
  const [leaderboard, setLeaderboard] = React.useState();
  React.useEffect(() => {
    firebase.getLeaderboard().then(a => {
      setLeaderboard(a.docs.map(u => u.data()));
    });
  }, []);
  return (
    <div>
      {leaderboard &&
        leaderboard.map(b => {
          console.log(b);
          return (
            <div key={b.id}>
              {b.displayName} - {b.points}
            </div>
          );
        })}
    </div>
  );
};
