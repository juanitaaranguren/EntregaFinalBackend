import nodemailer from "nodemailer";
import twilio from "twilio";
import config from "../config/config.js";
import { generateTokenPass } from "../utils.js";

const client = twilio(config.twilio_sid, config.twilio_token);

const transport = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: "juanitaranguren@gmail.com",
    pass: "elolvidoqueseremos12",
  },
});

export const sentSms = async (req, res) => {
  try {
    const result = await client.messages.create({
      body: "Tu usuario registrado es: juanitaranguren@gmail.com",
      from: config.twilio_phone,
      to: "+573112270877",
    });

    console.log(result);
    res.send("SMS enviado");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al enviar el SMS");
  }
};

export const sentEmail = async (req, res) => {
  try {
    const token = generateTokenPass({ user: "juanitaranguren@gmail.com" });
    const result = await transport.sendMail({
      from: "juanitaranguren@gmail.com",
      to: "juanitaranguren@gmail.com",
      subject: "recuperar password",
      html: `
      <div>
        <p>recuperar contraseña</p>
        <a href="${resetLink}">${resetLink}</a>;
      </div>
      `,
    });

    console.log(result);
    res.render("resetPassOk", {});
  } catch (error) {
    console.error(error);
    res.status(500).send("Error de envío del correo electrónico");
  }
};

export const sentSuccessEmail = async (
  email,
  amountTotalBuy,
  products,
  newTicket
) => {
  try {
    const result = await transport.sendMail({
      from: "juanitaranguren@gmail.com",
      to: email,
      subject: "gracias por confiar en nosotros",
      html: `
        <div>
          <p>¡Gracias!</p>
          <h1>Factura</h1>
          <h2>Número del ticket: ${newTicket.code}</h2>
          <h2>Fecha: ${new Date(newTicket.purchase_datetime).toLocaleString()}</h2>
          <p>Productos:</p>
          <ul>
            ${products.map(
              (product) =>
                `<li>${product.quantity} ${product.pid.title} - ${product.pid.price} C/U </li>`
            )}
          </ul>
          <p>Total: $ ${amountTotalBuy}</p>
        </div>
      `,
    });

    console.log("Correo enviado:", result);
  } catch (error) {
    console.error("Error al enviar el correo electrónico:", error);
    throw new Error("Error al enviar el correo electrónico");
  }
};

export const sendContactEmail = async (req, res) => {
  try {
    const nombre = req.body.nombre;
    const email = req.body.email;
    const telefono = req.body.telefono;
    const mensaje = req.body.mensaje;

    const result = await transport.sendMail({
      from: email,
      to: "juanitaranguren@gmail.com",
      subject: "Mensaje de contacto",
      html: `
      <div>
        <h3>Mensaje de ${nombre}</h3>
        <p>Email: ${email}</p>
        <p>Teléfono: ${telefono}</p>
        <p>Mensaje: ${mensaje}</p>
      </div>
      `,
    });

    console.log(result);
    res.render("contacto", {});
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al enviar el correo electrónico");
  }
};

export const sentContactEmail = async (req, res) => {
  try {
    const nombre = req.body.nombre;
    const apellido = req.body.apellido;
    const email = req.body.email;
    const telefono = req.body.telefono;
    const mensaje = req.body.mensaje;

    const result = await transport.sendMail({
      from: email,
      to: "juanitaranguren@gmail.com",
      subject: "¡Hola!",
      html: `
      <div>
        <h3>Mensaje de ${nombre} ${apellido}</h3>
        <p><i>Nombre:</i> ${nombre} ${apellido}</p>
        <p><i>Mensaje:</i> <br> ${mensaje}</p>
      </div>
      `,
    });

    console.log(result);
    res.status(200).send("Mensaje enviado");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al enviar el correo electrónico");
  }
};
