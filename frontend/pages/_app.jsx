import App, { Container } from 'next/app';
import Router from 'next/router';
import { Global, css } from '@emotion/core';
import Link from 'next/link';
import styled from '@emotion/styled';
import Spinner from '../components/Spinner';
import ContextProvider from '../context/providers/contextProvider.jsx';
import Head from 'next/head';
import { Menu, Layout, Button, Divider, Icon } from 'antd';
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
    const {
      Component,
      pageProps,
      router: { route }
    } = this.props;

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
                  widht: '100%',
                  textAlign: 'center',
                  backgroundColor: '#f0f2f5',
                  padding: 0
                }}
                color="#fff"
              >
                <Menu
                  overflowedIndicator={
                    <Icon
                      type="menu"
                      style={{
                        cursor: 'pointer'
                      }}
                    />
                  }
                  style={{
                    width: '100%',
                    position: 'fixed'
                  }}
                  selectedKeys={[route]}
                  mode="horizontal"
                >
                  <Menu.Item key="/">
                    <Link href="/">
                      <a>
                        <Icon type="home" />
                        Начало
                      </a>
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="/leaderboard">
                    <Link href="/leaderboard">
                      <a>
                        <Icon type="trophy" />
                        Ранглист
                      </a>
                    </Link>
                  </Menu.Item>
                  {this.state.user && (
                    <Menu.Item key="/my-profile">
                      <Link href="/my-profile">
                        <a>
                          <Icon type="profile" />
                          Профил
                        </a>
                      </Link>
                    </Menu.Item>
                  )}
                </Menu>
              </Header>
              <StyledContent>
                <Component {...pageProps} />
              </StyledContent>
              <Footer
                style={{
                  position: 'fixed',
                  bottom: 0,
                  width: '100%',
                  boxShadow: '0 30px 50px 12px rgba(0,0,0,.25)',
                  textAlign: 'center'
                }}
              >
                Разработено от Delirium Products! за Postbank.
              </Footer>
            </Layout>
          </Container>
        </ContextProvider>
      </>
    );
  }
}
