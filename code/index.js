// load app with current config
const app = (await import("./app.js")).app;

const hostname = "127.0.0.1";
const port = process.env.PORT || 3000;

app.listen(port, hostname, (error) => {
  if (error) {
    console.error(error);
  } else {
    console.log(`Server running at http://${hostname}:${port}/`);
  }
});
