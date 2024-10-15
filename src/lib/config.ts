export default class ConfigService {
  static getBaseUrlPokeImage(): string {
    return process.env.NEXT_PUBLIC_BASE_URL_IMAGE_POKE!;
  }
}
