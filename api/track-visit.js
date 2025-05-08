import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
const dbName = 'ees-store';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { visitorId } = req.body;

  try {
    await client.connect();
    const db = client.db(dbName);
    const coll = db.collection('visitors');

    const existing = await coll.findOne({ visitorId });
    if (!existing) {
      await coll.insertOne({ visitorId, firstVisit: new Date() });
    }

    const total = await coll.countDocuments();
    res.status(200).json({ uniqueVisitors: total });
  } catch (err) {
    console.error('Visit logging failed:', err);
    res.status(500).json({ error: 'Server error' });
  }
}
