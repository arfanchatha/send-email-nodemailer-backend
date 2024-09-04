const app = require("./app");

const port = process.env.PORT || 5000;

// Enable CORS for all routes

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
