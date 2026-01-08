import { initEdgeStore } from '@edgestore/server';
import { createEdgeStoreNextHandler } from '@edgestore/server/adapters/next/app';

const createEdgeStoreRouter = (es: ReturnType<typeof initEdgeStore.create>) => {
  console.log('[EdgeStore] createEdgeStoreRouter invoked');

  return es.router({
    trialOutcomeAttachments: es.fileBucket({
      maxSize: 1024 * 1024 * 50, // 50MB
    }),
  });
};

const buildEdgeStoreHandler = () => {
  console.log('[EdgeStore] buildEdgeStoreHandler invoked');

  const accessKey = process.env.EDGE_STORE_ACCESS_KEY;
  const secretKey = process.env.EDGE_STORE_SECRET_KEY;

  if (!accessKey || !secretKey) {
    console.error('[EdgeStore] Missing credentials – EDGE_STORE_ACCESS_KEY and EDGE_STORE_SECRET_KEY must be configured.');
    return null;
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

// Cache the handler to avoid rebuilding on every request
let cachedHandler: ReturnType<typeof buildEdgeStoreHandler> | null = null;

const handler = async (req: Request, ...args: any[]) => {
  console.log('[EdgeStore] handler invoked', { method: req.method, url: req.url });

  try {
    // Build handler if not cached
    if (!cachedHandler) {
      console.log('[EdgeStore] Building handler...');
      cachedHandler = buildEdgeStoreHandler();
    }

    if (!cachedHandler) {
      console.error('[EdgeStore] Handler not available - missing credentials');
      return new Response(
        JSON.stringify({
          error: 'EdgeStore not configured. Please set EDGE_STORE_ACCESS_KEY and EDGE_STORE_SECRET_KEY environment variables.'
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Call the Edge Store handler with all arguments
    console.log('[EdgeStore] Calling Edge Store handler...');
    return await cachedHandler(req, ...args);
  } catch (error) {
    console.error('[EdgeStore] Handler error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to process EdgeStore request';
    console.error('[EdgeStore] Error details:', { message: errorMessage, stack: error instanceof Error ? error.stack : undefined });
    return new Response(
      JSON.stringify({
        error: errorMessage
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};

export { handler as GET, handler as POST };

/**
 * This type is used to create the type-safe client for the frontend.
 */
export type EdgeStoreRouter = ReturnType<typeof createEdgeStoreRouter>;

