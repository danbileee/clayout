import { useEffect, useState } from "react";

function App() {
  const [hello, setHello] = useState("");

  useEffect(() => {
    (async () => {
      const response = await fetch(`${import.meta.env.VITE_API_HOST}/hello`);
      const parsed = await response.json();

      setHello(String(parsed));
    })();
  }, []);

  return (
    <div>
      <h1>{hello}</h1>
    </div>
  );
}

export default App;
