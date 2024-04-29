const {  Order, Users, Photos } = require('../models');
const User = require('../models/Users');
const { signToken, AuthenticationError, Auth } = require('../utils/auth');
const stripe = require('stripe')('sk_test_4eC39HqLyjWDarjtT1zdp7dc');

const resolvers = {
  Query: {
    photos: async () => {
      return await Photos.find();
    },
    photo: async (parent, { id }) => {
      return await Photos.findById(id).populate('photos');
    },
    user: async (parent, args, context) => {
      if (context.user) {
        const user = await User.findById(context.user._id).populate({
          path: 'orders.photos'
        });

        user.orders.sort((a, b) => b.purchaseDate - a.purchaseDate);

        return user;
      }

      throw new AuthenticationError('Not logged in');
    },
    order: async (parent, { _id }, context) => {
      if (context.user) {
        const user = await Users.findById(context.user._id).populate({
          path: 'orders.photos'
        });

        return user.orders.id(_id);
      }

      throw new AuthenticationError('Not logged in');
    },
    checkout: async (parent, args, context) => {
      const url = new URL(context.headers.referer).origin;
      await Order.create({ products: args.products.map(({ _id }) => _id) });
      
      const line_items = [];

      for (const photo of args.photos) {
        line_items.push({
          price_data: {
            currency: 'usd',
            product_data: {
              name: photo.name,
              description: photo.description,
              images: [`${url}/images/${photo.image}`]
            },
            unit_amount: photo.price * 100,
          },
          quantity: photo.purchaseQuantity,
        });
      }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items,
        mode: 'payment',
        success_url: `${url}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${url}/`,
      });

      return { session: session.id };
    },
  },
  Mutation: {
    addUser: async (parent, args) => {
      const user = await Users.create(args);
      const token = signToken(user);

      return { token, user };
    },
    addOrder: async (parent, { products }, context) => {
      if (context.user) {
        const order = new Order({ products });

        await User.findByIdAndUpdate(context.user._id, { $push: { orders: order } });

        return order;
      }
      throw new AuthenticationError('Not logged in');
    },
    upvotePhoto: async (_, { id }) => {
      const photo = await Photo.findById(id);
      if (!photo) {
        throw new Error('Photo not found');
      }
      photo.upvotes += 1;
      await photo.save();
      return photo;
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('Incorrect email');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect password');
      }

      const token = signToken(user);

      return { token, user };
    }
  }
};

module.exports = resolvers;