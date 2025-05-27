import React from 'react';
import { useState } from 'react';

const App = () => {
	const [number, setNumber] = useState(0);

	return <button onClick={() => setNumber(1)}>{number}</button>;
};

export default App;
