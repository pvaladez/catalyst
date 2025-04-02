import { AnalyticsProvider } from '~/lib/analytics/types';

interface GoogleAnalyticsConfig {
  gaId: string;
  consentModeEnabled?: boolean;
  developerId?: string;
  dataLayerName?: string;
  debugMode?: boolean;
  nonce?: string;
}

export class GoogleAnalyticsProvider implements AnalyticsProvider {
  static #instance: GoogleAnalyticsProvider | null = null;

  readonly cart = this.getCartEvents();
  readonly navigation = this.getNavigationEvents();

  private readonly dataLayerScriptId = 'data-layer-script';
  private readonly gtagScriptId = 'gtag-script';

  constructor(private readonly config: GoogleAnalyticsConfig) {
    this.validateConfig();

    if (GoogleAnalyticsProvider.#instance) {
      return GoogleAnalyticsProvider.#instance;
    }

    GoogleAnalyticsProvider.#instance = this;
  }

  initialize() {
    if (typeof window === 'undefined') {
      throw new Error('Google Analytics is only available in the browser environment');
    }

    this.initializeDataLayer();
    this.initializeGTM();
  }

  private validateConfig() {
    if (!this.config.gaId) {
      throw new Error('Google Analytics requires a Google Analytics ID');
    }

    if (!this.config.dataLayerName) {
      this.config.dataLayerName = 'dataLayer';
    }
  }

  private initializeDataLayer() {
    const existingScript = document.getElementById(this.dataLayerScriptId);

    if (existingScript) {
      return;
    }

    const script = document.createElement('script');

    script.id = this.dataLayerScriptId;
    script.type = 'text/javascript';
    script.nonce = this.config.nonce;
    script.innerHTML = `
      window['${this.config.dataLayerName}'] = window['${this.config.dataLayerName}'] || [];
      function gtag(){window['${this.config.dataLayerName}'].push(arguments);}
      gtag('js', new Date());

      ${this.config.developerId ? `gtag('set', 'developer_id.${this.config.developerId}', true)` : ''};
      gtag('config', '${this.config.gaId}' ${this.config.debugMode ? ",{ 'debug_mode': true }" : ''});
    `;

    document.body.appendChild(script);
  }

  private initializeGTM() {
    const existingScript = document.getElementById(this.gtagScriptId);

    if (existingScript) {
      return;
    }

    const script = document.createElement('script');

    script.id = this.gtagScriptId;
    script.nonce = this.config.nonce;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${this.config.gaId}`;

    document.head.appendChild(script);
  }

  private getCartEvents() {
    return {
      cartViewed: (payload, metadata) => {
        gtag('event', 'view_cart', {
          event_id: metadata.eventUuid,
          channel_id: metadata.channelId,
          ...payload,
        });
      },
      productAdded: (payload, metadata) => {
        gtag('event', 'add_to_cart', {
          event_id: metadata.eventUuid,
          channel_id: metadata.channelId,
          ...payload,
        });
      },
      productRemoved: (payload, metadata) => {
        gtag('event', 'remove_from_cart', {
          event_id: metadata.eventUuid,
          channel_id: metadata.channelId,
          ...payload,
        });
      },
    } satisfies Analytics.Cart.ProviderEvents;
  }

  private getNavigationEvents() {
    return {
      categoryViewed: (payload, metadata) => {
        gtag('event', 'view_item_list', {
          event_id: metadata.eventUuid,
          channel_id: metadata.channelId,
          ...payload,
        });
      },
      productViewed: (payload, metadata) => {
        gtag('event', 'view_item', {
          event_id: metadata.eventUuid,
          channel_id: metadata.channelId,
          ...payload,
        });
      },
    } satisfies Analytics.Navigation.ProviderEvents;
  }
}
