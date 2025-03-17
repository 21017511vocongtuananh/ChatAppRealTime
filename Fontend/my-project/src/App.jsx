import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { routers } from './routers/routers';
import { Suspense } from 'react';
import { WebSocketProvider } from './components/Message/WebSocketContext';

function App() {
  return (
    <WebSocketProvider>
      <BrowserRouter>
        <Suspense fallback={<div>Loading ....</div>}>
          <Routes>
            {routers.map((item, index) => {
              const Component = item.component;
              return (
                <Route path={item.path} element={<Component />} key={index} />
              );
            })}
          </Routes>
        </Suspense>
      </BrowserRouter>
    </WebSocketProvider>
  );
}

export default App;
