const express = require('express');
const app = express();
const port = 3000;


app.use(express.json());

let orders = [
    { 
        orderNumber: 1001, 
        clientName: 'Олександр Ковальчук', 
        datePlaced: '2025-10-25', 
        totalAmount: 1250.50 
    },
    { 
        orderNumber: 1002, 
        clientName: 'Марія Петренко', 
        datePlaced: '2025-10-28', 
        totalAmount: 540.00 
    },
    { 
        orderNumber: 1003, 
        clientName: 'Віталій Іванов', 
        datePlaced: '2025-11-01', 
        totalAmount: 3100.25 
    }
];
let nextOrderNumber = 1004; 


const findOrderByNumber = (num) => orders.find(o => o.orderNumber === num);


app.post('/api/orders', (req, res) => {
    const { clientName, datePlaced, totalAmount } = req.body;

    if (!clientName || !datePlaced || totalAmount === undefined) {
        return res.status(400).json({ 
            message: 'Потрібні поля: clientName, datePlaced, totalAmount' 
        });
    }

    const newOrder = {
        orderNumber: nextOrderNumber++,
        clientName,
        datePlaced,
        totalAmount: parseFloat(totalAmount) 
    };

    orders.push(newOrder);

    res.status(201).json(newOrder);
});



app.get('/api/orders', (req, res) => {
    res.status(200).json(orders);
});


app.get('/api/orders/:id', (req, res) => {
    const orderNumber = parseInt(req.params.id);
    const order = findOrderByNumber(orderNumber);

    if (!order) {

        return res.status(404).json({ message: `Замовлення №${orderNumber} не знайдено` });
    }
    
    res.status(200).json(order);
});


app.put('/api/orders/:id', (req, res) => {
    const orderNumber = parseInt(req.params.id);
    const { clientName, datePlaced, totalAmount } = req.body;
    
    const orderIndex = orders.findIndex(o => o.orderNumber === orderNumber);

    if (orderIndex === -1) {
        return res.status(404).json({ message: `Замовлення №${orderNumber} не знайдено` });
    }

    orders[orderIndex] = {
        ...orders[orderIndex], 
        clientName: clientName || orders[orderIndex].clientName,
        datePlaced: datePlaced || orders[orderIndex].datePlaced,
        totalAmount: totalAmount ? parseFloat(totalAmount) : orders[orderIndex].totalAmount
    };

    res.status(200).json(orders[orderIndex]);
});



app.delete('/api/orders/:id', (req, res) => {
    const orderNumber = parseInt(req.params.id);
    
    const initialLength = orders.length;

    orders = orders.filter(o => o.orderNumber !== orderNumber);
    
    if (orders.length === initialLength) {
        return res.status(404).json({ message: `Замовлення №${orderNumber} не знайдено` });
    }


    res.status(204).send(); 
});


app.listen(port, () => {
    console.log(`Сервер запущено на http://localhost:${port}`);
    console.log('API для замовлень доступно за маршрутом: /api/orders');
});