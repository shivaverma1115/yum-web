// Lightweight logError utility that does not rely on any external logging library.
type LogErrorOptions = {
    context?: string;
    requestId?: string;
    userId?: string | number;
    meta?: Record<string, unknown>; // e.g. meta: {url: "/api/login",method: "POST",status: 401}
    fatal?: boolean; // system-breaking (DB down, config missing)
};

export const logError = (
    err: unknown,
    options: LogErrorOptions = {}
) => {
    const error = err instanceof Error ? err : new Error(typeof err === "string" ? err : "Unknown error");

    // Do not log to console in production environments
    if (process.env.NODE_ENV === "production") {
        return;
    }

    const payload = {
        message: error.message,
        stack: error.stack,
        context: options.context,
        requestId: options?.requestId ?? "",
        userId: options?.userId ?? "",
        meta: options?.meta ?? {},
        fatal: options?.fatal ?? false,
    };

    console.error(">>>>> ERROR:", payload);
};