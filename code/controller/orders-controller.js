import { orderStore } from "../services/order-store.js";

export class OrdersController {
  getOrders = async (req, res) => {
    res.json((await orderStore.all()) || []); // Note: Should only return own orders
  };

  createPizza = async (req, res) => {
    res.json(await orderStore.add(req.body.name));
  };

  showOrder = async (req, res) => {
    res.json(await orderStore.get(req.params.id)); // Note: Should return 402 if permission failed. Error is detected by unit tests
  };

  deleteOrder = async (req, res) => {
    res.json(await orderStore.delete(req.params.id)); // Note: Should return 402 if permission failed. Error is detected by unit tests
  };
}

export const ordersController = new OrdersController();
