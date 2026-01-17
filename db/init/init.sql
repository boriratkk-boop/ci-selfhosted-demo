USE demo_ci;

-- TABLE
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product VARCHAR(100),
  qty INT
);

-- SEED DATA
INSERT INTO orders (product, qty) VALUES
('Keyboard2', 1),
('Mouse', 2);

-- STORED PROCEDURE
DROP PROCEDURE IF EXISTS get_orders;

DELIMITER //
CREATE PROCEDURE get_orders()
BEGIN
  SELECT * FROM orders;
END //
DELIMITER ;
