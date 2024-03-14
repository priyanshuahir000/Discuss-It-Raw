const PORT = process.env.PORT || 3000;
const express = require("express");

const app = require(express);

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}.`);
});
