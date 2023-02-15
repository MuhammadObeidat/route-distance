// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import data from "./data.json";


export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<number|{message:string}>
) {
    const cityNames: Array<string> = req.body;
    if(cityNames.includes('Dijon')) return setTimeout(() => res.status(400).json({message:"Unable to calculate the distance!"}), 1500) 
    const cities = cityNames.map(name => data.find(city => city.city === name));
    let distance = 0;
  
    for (let i = 1; i < cities.length; i++) {
      const start = cities[i-1];
      const end = cities[i];
      const radius = 6371; // Earth's radius in km
      const lat1 = start!.latitude * Math.PI/180;
      const lat2 = end!.latitude * Math.PI/180;
      const deltaLat = (end!.latitude - start!.latitude) * Math.PI/180;
      const deltaLon = (end!.longitude - start!.longitude) * Math.PI/180;
  
      const a = Math.sin(deltaLat/2) * Math.sin(deltaLat/2) +
                Math.cos(lat1) * Math.cos(lat2) *
                Math.sin(deltaLon/2) * Math.sin(deltaLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      const d = radius * c;
      distance += d;
    }
  
    // Simulate delay of 1.5 seconds
    setTimeout(() => res.status(200).json(+distance.toFixed(2)), 1500)
    
  
}
