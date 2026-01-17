import { useEffect, useState } from "react";

function App() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch("http://backend:3001/orders")
      .then(res => res.json())
      .then(setOrders)
      .catch(console.error);
  }, []);

  return (
    <div>
      <h2>Orders</h2>
      <ul>
        {orders.map(o => (
          <li key={o.id}>
            {o.product} - {o.qty}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
