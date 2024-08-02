function getReferrerObject() {
    const referrerUrl = document.referrer;

    if (!referrerUrl) {
        return;
    }

    const {hostname} = new URL(referrerUrl);
    const domain = hostname.replace(/^www\./, '');
    const domainParts = domain.split('.');
    
    const mainDomain = domainParts.slice(-2).join('.');
    const subdomain = domainParts.length > 2 ? domainParts.slice(0, -2).join('.') : '';

    return {url: referrerUrl, domain, mainDomain, subdomain};
}

getReferrerObject();

function getCurrentPageObject() {
    const url = document.URL;

    const { hostname, protocol, hash, search } = new URL(url);
    const domain = hostname.replace(/^www\./, '');
    const domainParts = domain.split('.');

    const mainDomain = domainParts.slice(-2).join('.');
    const subdomain = domainParts.length > 2 ? domainParts.slice(0, -2).join('.') : '';

    const params = new URLSearchParams(search);
    const utmSource = decodeURIComponent(params.get('utm_source')) || '';
    const utmMedium = decodeURIComponent(params.get('utm_medium')) || '';
    const utmCampaign = decodeURIComponent(params.get('utm_campaign')) || '';
    const utmId = decodeURIComponent(params.get('utm_id')) || '';
    const utmTerm = decodeURIComponent(params.get('utm_term')) || '';
    const utmContent = decodeURIComponent(params.get('utm_content')) || '';

    return {
        url,
        domain,
        mainDomain,
        subdomain,
        protocol,
        hash,
        utmSource,
        utmMedium,
        utmCampaign,
        utmId,
        utmContent,
        utmTerm
    };
}

getCurrentPageObject();