

import type { ThemeRepository } from "../repositories/theme.repo.js";
import type { Theme } from "../types/theme.types.js";
import { ContextService } from "./context.service.js"; 

/**
 * handles logic and functionality pertaining to Themes
 */
export class ThemeService {
    constructor(private themeRepository: ThemeRepository) {}

    public async getAllThemes(): Promise<Theme[]> {

        ContextService.getLogger().info(`Getting all themes`);
        const themes = await this.themeRepository.getAllThemes();
        return themes;
    }
}