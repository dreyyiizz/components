import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import personRouter from "./api/person";
import carRouter from "./api/cars";
import employeeRouter from "./api/employee";
import studentRouter from "./api/students";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use("/persons", personRouter);
app.use("/cars", carRouter);
app.use("/employee", employeeRouter);
app.use("/students", studentRouter);

app.get("/", (req, res) => {
  res.send("API is running...");
});

export default app;

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
