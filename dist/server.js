"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
dotenv.config({ path: "dev.env" });
console.log("ENV : ", process.env.NODE_ENV);
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_1 = __importDefault(require("express"));
const dbConfig_1 = __importDefault(require("./config/dbConfig"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const rolesRoutes_1 = __importDefault(require("./routes/rolesRoutes"));
const memberRoutes_1 = __importDefault(require("./routes/memberRoutes"));
const communityRoutes_1 = __importDefault(require("./routes/communityRoutes"));
const auth_1 = __importDefault(require("./middlewares/auth"));
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
(async () => {
    await (0, dbConfig_1.default)();
    app.listen(port, () => console.log(`Server running on port ${port}`));
})();
// Routes
app.get("/", (req, res) => {
    res.redirect("/v1/auth/signin");
});
app.use("/v1", userRoutes_1.default);
app.use(auth_1.default);
app.use("/v1", rolesRoutes_1.default);
app.use("/v1", memberRoutes_1.default);
app.use("/v1", communityRoutes_1.default);
app.get("*", (req, res) => {
    res.status(404).json({ message: "Page not found!" });
});
//# sourceMappingURL=server.js.map