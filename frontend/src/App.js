import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
// import Account from './pages/Account';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          {/* <Route path="/account" element={<Account />} /> */}
          {/* Другие маршруты будут добавляться здесь */}
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;