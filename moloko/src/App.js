import './App.css';
import {BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import AuthRedirect from './pages/Auth/AuthRedirect';
import Login from './pages/Auth/Login';
import SpotifyLogin from "./pages/Auth/SpotifyLogin";
import AuthProvider from './providers/auth';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Switch>
          <Route exact path={'/'} component={Login} />
          <Route path={'/login'} component={SpotifyLogin} />
          <Route path={'/auth'} component={AuthRedirect} />
          <Route path={'/dashboard'} component={Dashboard} />
        </Switch>
      </Router>
    </AuthProvider>
  );
}

export default App;
