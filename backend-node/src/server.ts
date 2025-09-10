import * as dotenv from "dotenv";
import { app } from "./index"
import fs from 'fs';

if (fs.existsSync('.env.local')) {
  dotenv.config({ path: '.env.local' });
} else {
  dotenv.config(); 
}

console.log("LUMEN_API_URL =", process.env.LUMEN_API_URL);
console.log("REDIS_HOST =", process.env.REDIS_HOST);
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Node service running on http://localhost:${PORT}`);
});