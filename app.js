const {
  createBot,
  createProvider,
  createFlow,
  addKeyword,
  EVENTS,
} = require("@bot-whatsapp/bot");

const QRPortalWeb = require("@bot-whatsapp/portal");
const BaileysProvider = require("@bot-whatsapp/provider/baileys");
const MockAdapter = require("@bot-whatsapp/database/mock");
const hookQuery = require("./scripts/hook");

let nombre;
let platoMenu;
let hora;

const flowOpciones = addKeyword(EVENTS.WELCOME)
  .addAnswer("🙌 Hola bienvenido a este el mejor Restaurante")
  .addAnswer("Que desea realizar el dia de hoy")
  .addAnswer([
    "👉*Saber el horario*",
    "👉*Realizar un pedido*",
    "👉*Consultar el menu del día*",
  ]);

const flowHorario = addKeyword(["horario", "horario"]).addAnswer(
  "👨‍🍳 La apertura de nuestro restaurante es desde las  ( 12:00 pm hasta las 5:00 pm 🕗 )"
);

const flowMenu = addKeyword(["menu", "menú", "Menu"]).addAnswer([
  "👨‍🍳 El Dia tenemos:",
  "1 - *Lomo Saltado*",
  "2 - *Ají de Gallina*",
  "3 - *Arroz con Mariscos*",
]);

const flowPedido = addKeyword(["pedido", "Pedir", "Pedido"])
  .addAnswer("Muy buen dia , Necesito que me brindes algunos datos")
  .addAnswer(
    ["*Digame su Nombre:*"],
    { capture: true, delay: 1000 },
    async (ctx) => {
      nombre = ctx.body;
    }
  )
  .addAnswer(
    [
      "*El Nombre del Plato :*",
      "1 - *Lomo Saltado*",
      "2 - *Ají de Gallina*",
      "3 - *Arroz con Mariscos*",
    ],
    { capture: true, delay: 1000 },
    async (ctx) => {
      platoMenu = ctx.body;
    }
  )
  .addAnswer(
    ["*Hora de LLegada:*"],
    { capture: true, delay: 1000 },
    async (ctx) => {
      hora = ctx.body;
    }
  )
  .addAction(null, async (ctx, { endFlow }) => {
    const request = {
      name: nombre,
      plato: platoMenu,
      horaLlegada: hora,
    };

    await hookQuery(request);

    return endFlow(
      `Muchas gracias!!! , Su pedido estara listo ${nombre} los esperamos 😊 `
    );
  });

const main = async () => {
  const adapterDB = new MockAdapter();
  const adapterFlow = createFlow([
    flowOpciones,
    flowHorario,
    flowMenu,
    flowPedido,
  ]);
  const adapterProvider = createProvider(BaileysProvider);

  createBot({
    flow: adapterFlow,
    provider: adapterProvider,
    database: adapterDB,
  });

  QRPortalWeb();
};

main();
