// server/src/controllers/menu.controller.js
import { MenuItem } from '../models/MenuItem.model.js';
import { Restaurant } from '../models/Restaurant.model.js';

export const menuController = {
  async addMenuItem(req, res) {
    try {
      const {
        name,
        description,
        price,
        category,
        preparationTime,
        attributes
      } = req.body;

      const restaurant = await Restaurant.findOne({ owners: req.user.id });
      if (!restaurant) {
        return res.status(404).json({ message: 'Restaurant not found' });
      }

      const menuItem = new MenuItem({
        name,
        description,
        price,
        category,
        preparationTime,
        attributes,
        restaurantId: restaurant._id
      });

      await menuItem.save();
      
      // Add menu item to restaurant's menu array
      restaurant.menu.push(menuItem._id);
      await restaurant.save();

      res.status(201).json(menuItem);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async updateMenuItem(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;

      const menuItem = await MenuItem.findById(id);
      if (!menuItem) {
        return res.status(404).json({ message: 'Menu item not found' });
      }

      // Verify restaurant ownership
      const restaurant = await Restaurant.findOne({ owners: req.user.id });
      if (!restaurant || !restaurant.menu.includes(menuItem._id)) {
        return res.status(403).json({ message: 'Not authorized' });
      }

      Object.keys(updates).forEach(key => {
        menuItem[key] = updates[key];
      });

      await menuItem.save();
      res.json(menuItem);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async getMenuItems(req, res) {
    try {
      const { restaurantId } = req.params;
      const { category, isVegetarian } = req.query;

      let query = { restaurantId };
      if (category) query.category = category;
      if (isVegetarian) query['attributes.isVegetarian'] = true;

      const menuItems = await MenuItem.find(query);
      res.json(menuItems);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async updateStock(req, res) {
    try {
      const { id } = req.params;
      const { inStock } = req.body;

      const menuItem = await MenuItem.findById(id);
      if (!menuItem) {
        return res.status(404).json({ message: 'Menu item not found' });
      }

      // Verify restaurant ownership
      const restaurant = await Restaurant.findOne({ owners: req.user.id });
      if (!restaurant || !restaurant.menu.includes(menuItem._id)) {
        return res.status(403).json({ message: 'Not authorized' });
      }

      menuItem.inStock = inStock;
      await menuItem.save();

      res.json(menuItem);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

