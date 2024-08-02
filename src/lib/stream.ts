export class TextDecodeTransformStream extends TransformStream<
  Uint8Array,
  string
> {
  constructor() {
    const decoder = new TextDecoder();
    super({
      transform(chutk, controller) {
        controller.enqueue(decoder.decode(chutk));
      },
    });
  }
}

export class TeeTransformStream<T> extends TransformStream<T, T> {
  constructor(
    callback: (
      data: { value: T; done: false } | { value: undefined; done: true },
    ) => void,
  ) {
    super({
      transform(chunk, controller) {
        controller.enqueue(chunk);
        callback({ value: chunk, done: false });
      },
      flush() {
        callback({ value: undefined, done: true });
      },
    });
  }
}

export function createTextStreamBuffer(): {
  promise: Promise<string>;
  collector: TeeTransformStream<string>;
} {
  let buffer = "";
  const { promise, resolve } = Promise.withResolvers<string>();
  const collector = new TeeTransformStream<string>(({ value, done }) => {
    if (done) {
      resolve(buffer);
    } else {
      buffer += value;
    }
  });
  return { promise, collector };
}
