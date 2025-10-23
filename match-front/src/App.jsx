import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import { Intro } from './pages/Intro';
import { Chat } from './pages/Chat';
import { Loading } from './pages/Loading';
import { Result } from './pages/Result';
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Intro />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/loading" element={<Loading />} />
          <Route path="/result" element={<Result />} />
        </Routes>


      {/* <ul style={{display:"grid", gap:"8px", marginTop:"16px"}}>
        <li><Link to="/">/ （説明ページ）</Link></li>
        <li><Link to="/chat">/chat （チャット）</Link></li>
        <li><Link to="/loading">/loading （ローディング）</Link></li>
        <li><Link to="/result">/result （結果表示）</Link></li>
      </ul> */}
      </BrowserRouter>
    </>
  )
}


