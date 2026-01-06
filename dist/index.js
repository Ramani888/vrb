"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors")); // Change to ES module import
const routes_1 = __importDefault(require("./routes/routes"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3010;
const mongoUri = process.env.DATABASE_URL || 'mongodb+srv://CVLCluster1:Ramani%407258@atlascluster.g9ls9b9.mongodb.net/VR_Fashion';
mongoose_1.default.connect(mongoUri);
const database = mongoose_1.default.connection;
database.on('error', (error) => {
    console.log(error);
});
database.once('connected', () => {
    console.log('Database Connected');
});
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Create upload folders if not exist
["uploads/images", "uploads/videos"].forEach((dir) => {
    if (!fs_1.default.existsSync(dir)) {
        fs_1.default.mkdirSync(dir, { recursive: true });
    }
});
// Serve static files
app.use("/uploads", express_1.default.static(path_1.default.join(__dirname, "uploads")));
app.use('/api', routes_1.default);
app.get('/', (req, res) => {
    res.json("server working....");
});
app.get('*', (req, res) => {
    res.json("API route not found");
});
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
