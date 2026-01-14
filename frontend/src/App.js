import { useEffect, useState } from "react";

function App() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/orders")
      .then(res => res.json())
      .then(setOrders);
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
