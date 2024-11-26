import { language } from '../utils/types/expressTypes';
import languages from './locale';

export const getLanguage = (lang: language) => languages[lang];
