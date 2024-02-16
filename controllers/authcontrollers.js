import { agentModel } from "./../model/agent.js";
import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";
import { orderModel } from "./../model/orders.js";

export const registerController = async (req, res) => {
  try {
    const { name, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 5);
    const registered = new agentModel({
      name,
      password: hashedPassword,
      sale: 0,
    })
      .save()
      .then(
        res.status(200).send({
          success: true,
          message: "Agent registered",
        })
      );
  } catch (error) {
    // Checking and HAndling Errors
    console.log(error);
    res.status(500).send({
      success: false,
      Message: "Error Registering Agent",
    });
  }
};

export const LoginController = async (req, res) => {
  try {
    const { name, password } = req.body;
    // Checking for User
    const user = await agentModel.findOne({ name: name });
    if (!user) {
      return res.send({ message: "Invalid Email or Password" });
    }
    // Checking User Password
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.send({ message: "Invalid Email or Password" });
    }
    // Generating Token
    const token = await JWT.sign({ _id: user._id }, process.env.JSON_SECRET, {
      expiresIn: "7d",
    });

    // Success Response
    res.send({
      success: true,
      message: "Login Successfull",
      user: user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Error in loging" });
  }
};

export const getAllPaid = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ paymentStatus: true })
      .sort({ createdAt: -1 });
    res.send(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error while geting the orders",
    });
  }
};
