interface Document {
    fonts: {
      load(font: string): Promise<void>;
    };
  }
  