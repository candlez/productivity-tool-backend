import { Router } from "express";

import { parseToken } from "../middleware/auth.mid.js";
import { ThemeRepository } from "../repositories/theme.repo.js";
import { ThemeService } from "../services/theme.service.js";
import { sendArray } from "../util/rest.util.js";
import { toPublicTheme, type PublicTheme, type Theme } from "../types/theme.types.js";


export const themeRouter: Router = Router();

themeRouter.use(parseToken);

// manual dependency injection
const themeRepo = new ThemeRepository();
const themeService = new ThemeService(themeRepo);


themeRouter.get("/", async (req, res) => {
    const themes: Theme[] = await themeService.getAllThemes();
    const publicThemes: PublicTheme[] = themes.map(toPublicTheme);
    return sendArray<PublicTheme>(res, publicThemes)
});