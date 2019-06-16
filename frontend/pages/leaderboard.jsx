import { List, Icon } from 'antd';
import styled from '@emotion/styled';
import firebase from '../firebase';
import React from 'react';

const Container = styled.div`
  display: flex;
  align-items: cener;
  justify-content: center;
  flex-direction: column;
  flex-wrap: wrap;
`;

const AwardContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  & > * {
    margin: 1rem;
  }

  flex-wrap: wrap;
`;

const Card = styled.div`
  border-radius: 10px;
  background-color: white;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  display: flex;
  justify-content: space-between;
  padding: 20px;
  align-items: center;
  margin-bottom: 10px;
`;

const trophies = {
  1: <Icon type="trophy" style={{ color: '#ffd700', fontSize: 25 }} />,
  2: <Icon type="trophy" style={{ color: '#c0c0c0', fontSize: 25 }} />,
  3: <Icon type="trophy" style={{ color: '#cd7f32', fontSize: 25 }} />
};

export default () => {
  const [leaderboard, setLeaderboard] = React.useState();
  React.useEffect(() => {
    firebase.getLeaderboard().then(a => {
      setLeaderboard(a.docs.map(u => u.data()));
    });
  }, []);
  return (
    <Container>
      <AwardContainer>
        <Card>
          {trophies[1]}
          <h1 style={{ margin: 0, marginLeft: 20 }}>
            <strong>1000 </strong>лв. ваучер
          </h1>
        </Card>
        <Card>
          {trophies[2]}
          <h1 style={{ margin: 0, marginLeft: 20 }}>
            <strong>500</strong> лв. ваучер
          </h1>
        </Card>
        <Card>
          {trophies[3]}
          <h1 style={{ margin: 0, marginLeft: 20 }}>
            <strong>250</strong> лв. ваучер
          </h1>
        </Card>
      </AwardContainer>
      <List
        itemLayout="horizontal"
        dataSource={leaderboard}
        renderItem={(user, pos) => (
          <Card>
            <img
              style={{
                width: '10%',
                borderRadius: '50%',
                objectFit: 'cover',
                boxShadow: '0 25px 50px -12px rgba(0,0,0,.25)'
              }}
              src={user.avatar}
              alt={user.displayName}
            />
            <strong
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <span
                style={{
                  fontSize: 15,
                  marginLeft: 20,
                  fontWeight: 'bold',
                  marginRight: 20
                }}
              >
                {pos + 1}{' '}
              </span>
              {pos <= 2 && trophies[pos + 1]}
              <span style={{ marginLeft: 20 }}>{user.displayName}</span>
            </strong>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <strong style={{ fontSize: 15, marginRight: 20 }}>
                {user.points}
              </strong>{' '}
              <span> Points</span>
            </div>
          </Card>
        )}
      />
    </Container>
  );
};
