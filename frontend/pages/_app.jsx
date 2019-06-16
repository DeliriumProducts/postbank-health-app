import App, { Container } from 'next/app';
import Router from 'next/router';
import { Global, css } from '@emotion/core';
import Link from 'next/link';
import styled from '@emotion/styled';
import Spinner from '../components/Spinner';
import ContextProvider from '../context/providers/contextProvider.jsx';
import Head from 'next/head';
import { Menu, Layout, Button, Divider } from 'antd';
import React from 'react';
import NProgress from 'nprogress';
import '../assets/nprogress.less';
import firebase from '../firebase';

const { Header, Content, Footer } = Layout;

const HeaderContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
`;

const StyledContent = styled(Content)`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
`;

Router.events.on('routeChangeStart', () => {
  NProgress.start();
});
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

export default class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }

  state = {
    user: null,
    loading: true
  };

  componentDidMount() {
    this.unsubscribe = firebase.onAuthStateChanged(user => {
      if (user) {
        this.setState({
          loading: false,
          user
        });
      } else {
        this.setState({
          user: null,
          loading: false
        });
      }
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  handleLogin = async () => {
    firebase.login();
  };

  handleLogout = async () => {
    await firebase.logout();
  };

  render() {
    const { Component, pageProps } = this.props;

    return (
      <>
        <Head>
          <title>Postbank Health App!</title>
        </Head>
        <ContextProvider>
          <Global
            styles={css`
              body {
                min-height: 100%;
                background-color: #f0f2f5;
              }

              * {
                box-sizing: border-box;
                margin: 0;
                padding: 0;
              }

              html {
                height: 100%;
              }

              #__next {
                min-height: 100vh;
              }
            `}
          />
          <Container>
            <Layout>
              <Header
                style={{
                  height: 'auto',
                  textAlign: 'center',
                  backgroundColor: '#f0f2f5'
                }}
                color="#fff"
              >
                <Menu selectedKeys={['home']} mode="horizontal">
                  <Menu.Item key="home">Home</Menu.Item>
                  <Menu.Item key="leaderboard">Leaderboard</Menu.Item>
                </Menu>
              </Header>
              <StyledContent>
                <Component {...pageProps} />
              </StyledContent>
              <Footer>Delirium Products! ©2019</Footer>
            </Layout>
          </Container>
        </ContextProvider>
      </>
    );
  }
}
