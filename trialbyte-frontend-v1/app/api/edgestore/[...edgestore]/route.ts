import { initEdgeStore } from '@edgestore/server';
import { createEdgeStoreNextHandler } from '@edgestore/server/adapters/next/app';

const createEdgeStoreRouter = (es: ReturnType<typeof initEdgeStore.create>) => {
  console.log('[EdgeStore] createEdgeStoreRouter invoked');

  return es.router({
    trialOutcomeAttachments: es.fileBucket({
      maxSize: 1024 * 1024 * 50, // 50MB
      accept: ['image/*', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'], // PNG, DOC, DOCX, PDF
    }),
  });
};

const buildEdgeStoreHandler = () => {
  console.log('[EdgeStore] buildEdgeStoreHandler invoked');

  const accessKey = process.env.EDGE_STORE_ACCESS_KEY;
  const secretKey = process.env.EDGE_STORE_SECRET_KEY;

  if (!accessKey || !secretKey) {
    console.warn('[EdgeStore] Missing credentials – requests will fail until EDGE_STORE_ACCESS_KEY and EDGE_STORE_SECRET_KEY are configured.');
    throw new Error('EdgeStore credentials not configured');
  }

  const es = initEdgeStore.create({
    accessKey,
    secretKey,
  });

  /**
   * This is the main router for the Edge Store buckets.
   */
  const edgeStoreRouter = createEdgeStoreRouter(es);

  return createEdgeStoreNextHandler({
    router: edgeStoreRouter,
  });
};

const handler = async (...args: Parameters<ReturnType<typeof buildEdgeStoreHandler>>) => {
  console.log('[EdgeStore] handler invoked');
  const edgeStoreHandler = buildEdgeStoreHandler();
  return edgeStoreHandler(...args);
};

export { handler as GET, handler as POST };

/**
 * This type is used to create the type-safe client for the frontend.
 */
export type EdgeStoreRouter = ReturnType<typeof createEdgeStoreRouter>;

