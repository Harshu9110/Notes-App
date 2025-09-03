// server.js
import express from "express";
import path from "path";
import history from "connect-history-api-fallback";

const app = express();
const port = process.env.PORT || 3000;

// Redirect all requests to index.html
app.use(history());

// Serve static files from Vite build
app.use(express.static(path.join(process.cwd(), "dist")));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
