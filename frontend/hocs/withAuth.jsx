import React from 'react';
import Router from 'next/router';
import Spinner from '../components/Spinner';
import firebase from '../firebase';

const withAuth = Component => props => {
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    firebase.auth.onAuthStateChanged(authUser => {
      console.log(authUser);
      if (authUser) {
        setLoading(false);
      } else {
        Router.push('/');
      }
    });
  }, []);

  if (loading) {
    return <Spinner />;
  } else {
    return <Component {...props} />;
  }
};
export default withAuth;
