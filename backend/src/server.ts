import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import personRouter from "./api/person";
import carRouter from "./api/cars";
import employeeRouter from "./api/employee";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use("/persons", personRouter);
app.use("/cars", carRouter)
app.use("/employee", employeeRouter)

app.get("/", (req, res) => {
  res.send("API is running...");
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
