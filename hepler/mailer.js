import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.net",
  port: 465,
  secure: true,
  auth: {
    // TODO: replace `user` and `pass` values from <https://forwardemail.net>
    user: "arhmraf@gmail.com",
    pass: "chqlqjrezlprvjqe",
  },
});

export const mailSender = async (email, name, from, to, link) => {
  const info = await transporter.sendMail({
    from: '"Testing" <arhmraf@gmail.com>', // sender address
    to: `${email}`, // list of receivers
    subject: "✔ Pending Payment", // Subject line
    text: "Thanks for loging to my Website", // plain text body
    html: `<div class="box" style="width: 90%; border: 2px solid grey; margin: auto">
    <h1 style="width: 100%; text-align: center; margin-top: 3%">Thank You</h1>
    <hr width="80%" />
    <p style="text-align: center">
      We have recieved your travel request <br />
      make payment to proceed
    </p>
    <div class="container" style="width: 80%; margin: 50px auto">
      <p>Client Name : <b>${name}</b></p>
      <p>Boarding At: <b>${from}</b></p>
      <p>Arriving At : <b>${to}</b></p>

      <a
        href="${link}"
        style="
          padding: 12px 16px;
          display: block;
          width: 300px;
          text-align: center;
          text-decoration: none;
          color: aliceblue;
          background-color: blue;
          border-radius: 20px;
          margin: 40px auto;
        "
        >Make Payment</a
      >
    </div>
  </div>`,
  });
  console.log(`Mail to "${email}" has been sended Successfully`);
  return 0;
};
