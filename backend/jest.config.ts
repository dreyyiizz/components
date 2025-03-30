export default {
  preset: "ts-jest",
  testEnvironment: "node",
  testTimeout: 120000,  
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  setupFiles: ["dotenv/config"], 
};
