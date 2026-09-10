import { useRouter } from "next/router";
import Script from "next/script";
import { useEffect } from "react";
import { useConsent } from "~/utils/consentManagement";

declare global {
	interface Window {
		_paq?: unknown[][];
	}
}

const MATOMO_URL = process.env.NEXT_PUBLIC_MATOMO_URL;
const MATOMO_SITE_ID = process.env.NEXT_PUBLIC_MATOMO_SITE_ID;

function pushMatomo(...args: unknown[]) {
	window._paq = window._paq || [];
	window._paq.push(args);
}

export default function Matomo() {
	const router = useRouter();
	const { finalityConsent } = useConsent();

	useEffect(() => {
		if (!MATOMO_URL || !MATOMO_SITE_ID) return;
		if (finalityConsent?.matomo === true) {
			pushMatomo("setConsentGiven");
		} else if (finalityConsent?.matomo === false) {
			pushMatomo("forgetConsentGiven");
		}
	}, [finalityConsent?.matomo]);

	useEffect(() => {
		if (!MATOMO_URL || !MATOMO_SITE_ID) return;

		const handleRouteChange = (url: string) => {
			pushMatomo("setCustomUrl", url);
			pushMatomo("setDocumentTitle", document.title);
			pushMatomo("trackPageView");
		};

		router.events.on("routeChangeComplete", handleRouteChange);
		return () => {
			router.events.off("routeChangeComplete", handleRouteChange);
		};
	}, [router.events]);

	if (!MATOMO_URL || !MATOMO_SITE_ID) return null;

	const trackerUrl = MATOMO_URL.endsWith("/") ? MATOMO_URL : `${MATOMO_URL}/`;

	return (
		<Script
			id="matomo-init"
			strategy="afterInteractive"
			dangerouslySetInnerHTML={{
				__html: `
					var _paq = window._paq = window._paq || [];
					_paq.push(['requireConsent']);
					_paq.push(['trackPageView']);
					_paq.push(['enableLinkTracking']);
					(function() {
						var u="${trackerUrl}";
						_paq.push(['setTrackerUrl', u+'matomo.php']);
						_paq.push(['setSiteId', '${MATOMO_SITE_ID}']);
						var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
						g.async=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
					})();
				`,
			}}
		/>
	);
}
