const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const Product = require('./model/Product');
const User = require('./model/User');
const Order = require('./model/Order');

dotenv.config();
connectDB();

const users = [
  {
    name: 'Admin User',
    email: 'admin@shopnest.com',
    password: bcrypt.hashSync('admin123', 10),
    role: 'admin',
    verified: true,
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: bcrypt.hashSync('user1234', 10),
    role: 'user',
    verified: true,
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: bcrypt.hashSync('user1234', 10),
    role: 'user',
    verified: false,
  },
];

const products = [
  {
    name: 'Wireless Headphones',
    description: 'Comfortable noise-cancelling headphones with long battery life.',
    price: 89.99,
    category: 'Electronics',
    stock: 45,
    imageUrl: 'https://i.imgur.com/8wG4bYd.jpg',
    rating: 4.5,
    numReviews: 24,
  },
  {
    name: 'Running Sneakers',
    description: 'Lightweight running shoes for everyday training and comfort.',
    price: 69.99,
    category: 'Footwear',
    stock: 32,
    imageUrl: 'https://i.imgur.com/y5CR4eH.jpg',
    rating: 4.7,
    numReviews: 18,
  },
  {
    name: 'Classic Leather Wallet',
    description: 'Slim wallet with multiple card slots and premium leather finish.',
    price: 29.99,
    category: 'Accessories',
    stock: 80,
    imageUrl: 'https://i.imgur.com/TK3W3Mq.jpg',
    rating: 4.2,
    numReviews: 12,
  },
  {
    name: 'Smart Watch',
    description: 'Fitness tracking watch with notifications and heart rate monitor.',
    price: 129.99,
    category: 'Electronics',
    stock: 22,
    imageUrl: 'https://i.imgur.com/eVJg1CB.jpg',
    rating: 4.4,
    numReviews: 30,
  },
  {
    name: 'Organic Coffee Beans',
    description: 'Fresh roasted organic coffee beans with rich flavor and aroma.',
    price: 17.49,
    category: 'Grocery',
    stock: 110,
    imageUrl: 'https://i.imgur.com/8Z8xkT9.jpg',
    rating: 4.8,
    numReviews: 62,
  },
  {
    name: 'Desk Lamp',
    description: 'Adjustable LED desk lamp with 3 brightness levels and USB charging.',
    price: 34.5,
    category: 'Home',
    stock: 52,
    imageUrl: 'https://i.imgur.com/AXb6tQJ.jpg',
    rating: 4.6,
    numReviews: 15,
  },
];

const importData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    const createdUsers = await User.insertMany(users);
    const createdProducts = await Product.insertMany(products);

    const sampleOrder = {
      user: createdUsers[1]._id,
      products: [
        {
          productId: createdProducts[0]._id,
          qty: 1,
          price: createdProducts[0].price,
        },
        {
          productId: createdProducts[2]._id,
          qty: 2,
          price: createdProducts[2].price,
        },
      ],
      totalPrice: createdProducts[0].price + createdProducts[2].price * 2,
      address: {
        fullName: 'John Doe',
        street: '123 Maple Street',
        city: 'Springfield',
        postalCode: '12345',
        country: 'USA',
      },
      paymentId: 'PAYMENT12345',
      status: 'Pending',
    };

    await Order.create(sampleOrder);

    console.log('Dummy data seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

importData();
