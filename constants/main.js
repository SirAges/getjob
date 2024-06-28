
      
const production = process.env.NODE_ENV === "production";
const web = "https://getjobapi.vercel.app";
const local = "http://localhost:3000";

export const domain = production ? web : local;
