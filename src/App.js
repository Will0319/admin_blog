import React, { Component } from 'react';
import createHistory from 'history/createHashHistory';
import Loadable from 'react-loadable';
import { Route, Router, Switch ,Redirect} from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import HomeLayout from '../src/layout/home';
// import {Button} from 'antd';
// 引入加载页样式
import './assets/style/loading.less';


const history = createHistory();


// 订阅state改变
store.subscribe(() => {
  console.log(store.getState());
});
// 初始化加载页面 用于异步加载时显示
const Loadings = () => (
  <div className="loading_wrapper">
    <div className="loading_item" />
  </div>
);
// 配置异步加载
const Login = Loadable({
  loader: () => import('./pages/Login'),
  loading: Loadings,
});

const Home = Loadable({
  loader: () => import('./pages/Home'),
  loading: Loadings,
});

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router history={history}>
          <div style={{width:'100%',height:'100%'}}>
              <Switch>
                <Route exact path="/" render={() => <Redirect to="/login" />} />
                <Route exact path="/login" component={Login} />
                <HomeLayout>
                  <Route exact path="/home" component={Home} />
                </HomeLayout>
              </Switch>
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
