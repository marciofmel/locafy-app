import { MercadoPagoConfig, Payment } from "mercadopago";
import { Router } from "express";
import express from "express";
import { prisma } from "../server.js";

const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN || "" });
const payment = new Payment(client);

const router = Router();

router.post("/mercadopago", express.raw({ type: "application/json" }), async (req, res) => {
  try {
    const body = Buffer.isBuffer(req.body) ? JSON.parse(req.body.toString()) : req.body;
    const { type, data } = body;
    if (type === "payment") {
      const paymentInfo = await payment.get({ id: data.id });
      const external = paymentInfo.external_reference;
      if (external) {
        const [userId, planId] = external.split(":");
        await prisma.subscription.upsert({
          where: { userId },
          update: { status: "active", planId, mpSubscriptionId: data.id.toString(), currentPeriodStart: new Date(), currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
          create: { userId, planId, status: "active", mpSubscriptionId: data.id.toString(), currentPeriodStart: new Date(), currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
        });
      }
    }
    if (type === "preapproval") {
      const preId = data.id;
      const sub = await prisma.subscription.findFirst({ where: { mpSubscriptionId: preId.toString() } });
      if (sub) {
        await prisma.subscription.update({
          where: { id: sub.id },
          data: { status: "active", currentPeriodStart: new Date(), currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
        });
      }
    }
    res.sendStatus(200);
  } catch {
    res.sendStatus(200);
  }
});

export default router;
