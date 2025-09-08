import * as dotenv from "dotenv";
import { app } from "./index"



// Load the env file mounted in Docker
dotenv.config(); // matches your volume in docker-compose
console.log("LUMEN_API_URL =", process.env.LUMEN_API_URL);
console.log("REDIS_HOST =", process.env.REDIS_HOST);
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Node service running on http://localhost:${PORT}`);
});