// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import data from "./data.json";
type Data = Array<string>


export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data|{message:string}>
) {
  const query = req.query.key as string;
  const cities = data.map(i => i.city)
  if (!!query) {
    if(query.toLowerCase() === "fail") {
      return res.status(400).json({message:"Error, Something went wrong!"})
    }
    const list = cities.filter(city => city.toLowerCase().includes(query.toLowerCase()))
    setTimeout((() => {
      return res.status(200).json(list)
    }), 2000)
  }
  else {
    res.status(200).json(cities.slice(0, 7))
  }
}
