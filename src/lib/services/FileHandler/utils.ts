export function uint8ArrayToString(data: Uint8Array) {
  const decoder = new TextDecoder('utf-8');
  return decoder.decode(data);
}

export async function readStream(stream: ReadableStream<Uint8Array>) {
  const reader = stream.getReader();
  const chunks = [];
  let totalLength = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    chunks.push(value);
    totalLength += value.length;
  }

  const fileContent = new Uint8Array(totalLength);
  let offset = 0;
  for (const chunk of chunks) {
    fileContent.set(chunk, offset);
    offset += chunk.length;
  }

  return fileContent;
}
