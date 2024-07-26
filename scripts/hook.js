const hookQuery = async (query) => {
  try {
    const dataApi = await fetch(
      "https://hook.eu2.make.com/8iewy58ohag75sggqrcmkjynvfsisf32",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(query),
      }
    );

    const response = await dataApi.json();

    console.log(response);

    return "200 OK";
  } catch (error) {
    console.log(error);
    return "ERROR";
  }
};
module.exports = hookQuery;
