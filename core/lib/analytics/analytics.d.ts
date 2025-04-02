declare namespace Analytics {
  interface Metadata {
    channelId: number;
    eventUuid: string;
  }

  namespace Navigation {
    interface Product {
      product_id: string;
      product_name: string;
      brand_name?: string;
      sku?: string;
      sale_price?: number;
      purchase_price: number;
      base_price?: number;
      retail_price?: number;
      currency: string;
      category_names?: string[];
      variant_id?: number[];
      quantity?: number;
    }

    interface ProductViewedPayload {
      currency: string;
      product_value: number;
      line_items: Product[];
    }

    interface CategoryViewedPayload {
      category_id: number;
      category_name: string;
      line_items: Product[];
    }

    interface ProviderEvents {
      categoryViewed: (payload: CategoryViewedPayload, metadata: Metadata) => void;
      productViewed: (payload: ProductViewedPayload, metadata: Metadata) => void;
    }

    export interface Events {
      categoryViewed: (payload: CategoryViewedPayload) => void;
      productViewed: (payload: ProductViewedPayload) => void;
    }
  }

  export namespace Cart {
    interface Product {
      product_id: string;
      product_name: string;
      brand_name?: string;
      sku?: string;
      sale_price?: number;
      purchase_price: number;
      base_price?: number;
      retail_price?: number;
      currency: string;
      category_names?: string[];
      variant_id?: number[];
      quantity?: number;
    }

    interface ProductAddedPayload {
      currency: string;
      product_value: number;
      line_items: Product[];
    }

    interface CartViewedPayload {
      currency: string;
      cart_value: number;
      line_items: Product[];
    }

    interface ProductRemovedPayload {
      currency: string;
      product_value: number;
      line_items: Product[];
    }

    interface ProviderEvents {
      cartViewed: (payload: CartViewedPayload, metadata: Metadata) => void;
      productAdded: (payload: ProductAddedPayload, metadata: Metadata) => void;
      productRemoved: (payload: ProductRemovedPayload, metadata: Metadata) => void;
    }

    export interface Events {
      cartViewed: (payload: CartViewedPayload) => void;
      productAdded: (payload: ProductAddedPayload) => void;
      productRemoved: (payload: ProductRemovedPayload) => void;
    }
  }
}
