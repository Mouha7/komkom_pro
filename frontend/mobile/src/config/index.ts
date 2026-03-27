import { NativeModules } from 'react-native';

export type AppFeatureFlags = Readonly<{
	enableRoleGuards: boolean;
}>;

export const appFeatureFlags: AppFeatureFlags = {
	// Keep guards disabled while backend auth integration is in progress.
	enableRoleGuards: false,
};

const API_PORT = '3001';
const DEFAULT_API_BASE_URL = `http://localhost:${API_PORT}`;
const EXPO_TUNNEL_HOST_PATTERN = /(\.exp\.direct|\.expo\.dev)$/i;

const isLoopbackHost = (host: string): boolean => {
	return host === 'localhost' || host === '127.0.0.1';
};

const isExpoTunnelHost = (host: string): boolean => {
	return EXPO_TUNNEL_HOST_PATTERN.test(host);
};

const getHostFromUrlString = (url: string): string | null => {
	try {
		return new URL(url).hostname;
	} catch {
		const match = url.match(/^[a-z]+:\/\/([^/:]+)/i);
		return match?.[1] ?? null;
	}
};

const getHostFromBundleUrl = (): string | null => {
	const scriptUrl: unknown = NativeModules?.SourceCode?.scriptURL;

	if (typeof scriptUrl !== 'string') {
		return null;
	}

	const match = scriptUrl.match(/^[a-z]+:\/\/([^/:]+)/i);
	const host = match?.[1];

	if (!host || isLoopbackHost(host)) {
		return null;
	}

	return host;
};

const getDevFallbackApiBaseUrl = (): string => {
	const host = getHostFromBundleUrl();

	if (!host) {
		return DEFAULT_API_BASE_URL;
	}

	return `http://${host}:${API_PORT}`;
};

const resolveApiBaseUrl = (): string => {
	const envApiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL?.trim();
	const envApiTunnelBaseUrl = process.env.EXPO_PUBLIC_API_TUNNEL_BASE_URL?.trim();
	const bundleHost = getHostFromBundleUrl();
	const isBundleTunnel = Boolean(bundleHost && isExpoTunnelHost(bundleHost));
	const devFallbackApiBaseUrl = getDevFallbackApiBaseUrl();

	if (__DEV__ && isBundleTunnel && envApiTunnelBaseUrl) {
		return envApiTunnelBaseUrl;
	}

	if (envApiBaseUrl) {
		if (__DEV__) {
			const envHost = getHostFromUrlString(envApiBaseUrl);
			const fallbackHost = getHostFromUrlString(devFallbackApiBaseUrl);

			if (isBundleTunnel && envHost && isLoopbackHost(envHost)) {
				// eslint-disable-next-line no-console
				console.warn(
					'[config] Expo tunnel detected but EXPO_PUBLIC_API_BASE_URL targets localhost. Set EXPO_PUBLIC_API_TUNNEL_BASE_URL to your ngrok URL.'
				);
			}

			if (envHost && isLoopbackHost(envHost) && fallbackHost && !isLoopbackHost(fallbackHost)) {
				return devFallbackApiBaseUrl;
			}
		}

		return envApiBaseUrl;
	}

	if (!__DEV__) {
		return DEFAULT_API_BASE_URL;
	}

	if (isBundleTunnel) {
		// eslint-disable-next-line no-console
		console.warn(
			'[config] Expo tunnel detected without API tunnel URL. Define EXPO_PUBLIC_API_TUNNEL_BASE_URL for physical device access to json-server.'
		);
	}

	return devFallbackApiBaseUrl;
};

export const appConfig = {
	apiBaseUrl: resolveApiBaseUrl(),
} as const;

