import { agentModel } from "../model/agent.js";
import { orderModel } from "../model/orders.js";
import { mailSender } from "./../hepler/mailer.js";
import paypal from "paypal-rest-sdk";
import dotenv from "dotenv";

dotenv.config();

// Payment Gateway Initializaion
paypal.configure({
  mode: "live", //sandbox or live
  client_id: process.env.CLIENT_ID,
  client_secret: process.env.CLINET_SECRET,
});

export const customerRegistryController = async (req, res) => {
  try {
    const { name, email, phoneNo, from, to, price, agentID } = req.body;

    const agent = await agentModel.findById(agentID);
    const add = await new orderModel({
      name,
      email,
      phoneNo,
      from,
      to,
      price,
      agentID: agentID,
      agentName: agent.name,
    })
      .save()
      .then(res.send({ success: true, message: `${name} add successfully` }));
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "something went wrong while adding the client" });
  }
};

export const sendMailController = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await orderModel.findById(id);

    const email = order.email;
    const name = order.name;
    const from = order.from;
    const to = order.to;
    const link = `${process.env.RESPONSE_LINK}payment/${id}`;
    const mail = await mailSender(email, name, from, to, link);
    if (mail === 0) {
      return res.send({ success: true, message: "mail sent successfully" });
    }
  } catch (error) {
    console.log(error);
    res.send("something went wrong while mailing");
  }
};

export const upaidAgendBasedController = async (req, res) => {
  try {
    const { aid } = req.params;
    const orders = await orderModel
      .find({
        $and: [{ agentID: aid }, { paymentStatus: false }],
      })
      .sort({ createdAt: -1 });

    res.send({
      success: true,
      orders,
    });
  } catch (error) {
    console.log(error);
    res.send({ message: "something went wrong", error });
  }
};

export const paidAgendBasedController = async (req, res) => {
  try {
    const { aid } = req.params;
    const orders = await orderModel
      .find({
        $and: [{ agentID: aid }, { paymentStatus: true }],
      })
      .sort({ createdAt: -1 });

    res.send({
      success: true,
      orders,
    });
  } catch (error) {
    console.log(error);
    res.send({ message: "something went wrong", error });
  }
};

export const paymentscontroller = async (req, res) => {
  const { oid } = req.body;
  const order = await orderModel.findById(oid);

  if (!order) {
    return res.send("order not found");
  }

  var create_payment_json = {
    intent: "sale",
    payer: {
      payment_method: "paypal",
    },
    redirect_urls: {
      return_url: `https://teal-mite-tie.cyclic.app/api/auth/payment/success/${oid}`,
      cancel_url: "https://teal-mite-tie.cyclic.app/api/auth/payment/cancel",
    },
    transactions: [
      {
        item_list: {
          items: [
            {
              name: `${order?.from} to ${order?.to}`,
              sku: `${order?._id}`,
              price: `${order?.price}`,
              currency: "USD",
              quantity: 1,
            },
          ],
        },
        amount: {
          currency: "USD",
          total: `${order?.price}`,
        },
        description: "This is the travel payment.",
      },
    ],
  };

  paypal.payment.create(create_payment_json, function (error, payment) {
    if (error) {
      throw error;
    } else {
      for (let i = 0; i < payment.links.length; i++) {
        if (payment?.links[i].rel === "approval_url") {
          res.send(payment.links[i].href);
        }
      }
    }
  });
};

export const paymentCancel = (req, res) => {
  try {
    res.redirect(`${process.env.RESPONSE_LINK}/cancel`);
  } catch (error) {
    console.log(error);
    res.send("payment canceled");
  }
};

export const paymentSuccesfull = async (req, res) => {
  try {
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;
    const { oid } = req.params;
    const order = await orderModel.findById(oid);
    const execute_payment_json = {
      payer_id: payerId,
      transactions: [
        {
          amount: {
            currency: "USD",
            total: `${order.price}`,
          },
        },
      ],
    };

    paypal.payment.execute(
      paymentId,
      execute_payment_json,
      function (error, payment) {
        if (error) {
          console.log(error.response);
          throw error;
        } else {
          const upadting = orderModel
            .findByIdAndUpdate(oid, { paymentStatus: true }, { new: true })
            .then(res.redirect(`${process.env.RESPONSE_LINK}/successfull`));
        }
      }
    );
  } catch (error) {
    console.log(error);
    res.send("something went wrong");
  }
};
