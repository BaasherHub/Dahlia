// src/services/shipping.js
import EasyPostClient from '@easypost/api';

export async function createShippingLabel(order) {
  const client = new EasyPostClient(process.env.EASYPOST_API_KEY);
  const shipment = await client.Shipment.create({
    from_address: {
      name: process.env.SHIP_FROM_NAME,
      street1: process.env.SHIP_FROM_STREET,
      city: process.env.SHIP_FROM_CITY,
      state: process.env.SHIP_FROM_STATE,
      zip: process.env.SHIP_FROM_ZIP,
      country: process.env.SHIP_FROM_COUNTRY,
      phone: process.env.SHIP_FROM_PHONE,
    },
    to_address: {
      name: order.shipName,
      street1: order.shipStreet,
      city: order.shipCity,
      state: order.shipState,
      zip: order.shipZip,
      country: order.shipCountry,
      phone: order.shipPhone || '',
    },
    parcel: {
      // Reasonable defaults for a rolled/boxed canvas — update as needed
      length: 24,   // inches
      width: 4,
      height: 4,
      weight: 48,   // ounces (~3 lbs with packaging)
    },
  });

  // Buy the cheapest rate
  const lowestRate = shipment.lowestRate(['USPS', 'UPS', 'FedEx']);
  const purchased = await client.Shipment.buy(shipment.id, lowestRate);

  return {
    trackingCode: purchased.tracking_code,
    labelUrl: purchased.postage_label.label_url,
    carrier: purchased.selected_rate.carrier,
  };
}
