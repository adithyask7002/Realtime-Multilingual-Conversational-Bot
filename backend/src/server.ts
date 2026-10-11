import "dotenv/config";
import app from "./app.js";

const PORT = Number(process.env.PORT) || 5000;

app.listen(PORT, () => {
  console.log("");
  console.log("====================================");
  console.log("       VAANIX BACKEND RUNNING       ");
  console.log("====================================");
  console.log(`Server: http://localhost:${PORT}`);
  console.log(`Health: http://localhost:${PORT}/api/health`);
  console.log("====================================");
  console.log("");
});