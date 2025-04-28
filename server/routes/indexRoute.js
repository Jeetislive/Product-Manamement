import productRoutes from "./productRoutes.js";
import uploadRoutes from "./uploadRoutes.js";



const indexRoutes = [
  ...productRoutes,
  ...uploadRoutes
];

export default indexRoutes;
