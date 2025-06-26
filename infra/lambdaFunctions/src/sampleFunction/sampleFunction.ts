export const handler = async (event: any) => {
  console.log("event", event);

  const response = {
    status: 200,
    body: {
      skra: "skoot",
    },
  };

  return response;
};
