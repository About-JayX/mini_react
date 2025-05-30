import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
// ReactDOM.render(<div>重写测试</div>, document.getElementById('root'));

// createRoot(document.getElementById('root')!).render(<div>重写react_</div>);

const RD: { createRoot: any } = ReactDOM as unknown as { createRoot: any };

RD.createRoot(document.getElementById('root')).render(<App></App>);
