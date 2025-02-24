import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { routers } from './routers/routers';
import { Suspense } from 'react';

function App() {
  return (
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
  );
}

export default App;
