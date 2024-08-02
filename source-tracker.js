const MERGE_SUBDOMAINS_AND_DOMAIN = false;

function getUrlObject(url) {  
    if (!url) {
        return;
    }

    const { hostname, protocol, hash, search } = new URL(url);  
    const domain = hostname.replace(/^www\./, '');

    const domainParts = domain.split('.');
    const mainDomain = domainParts.slice(-2).join('.');
    const subdomain = domainParts.length > 2 ? domainParts.slice(0, -2).join('.') : '';

    const params = new URLSearchParams(window.location.search);
    const utmSource = params.get('utm_source');
    const utmMedium = params.get('utm_medium');
    const utmCampaign = params.get('utm_campaign');
    const utmId = params.get('utm_id') || '';
    const utmTerm = params.get('utm_term'); // не забудь ключи раскодировать decodeURIComponent
    const utmContent = params.get('utm_content');

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

function isNotEmpty(value) {
    return value !== null && value !== undefined && value !== '';
}

function isInternalTransition(merge) {
    if (!document.referrer) {
        console.log('Это не внутренний переход');
        return false;
    }

    const currentUrlObject = getUrlObject(document.URL);
    const referrerUrlObject = getUrlObject(document.referrer);

    if (merge) {
        console.log('Это внутренний переход? ' + currentUrlObject.mainDomain === referrerUrlObject.mainDomain);
        return currentUrlObject.mainDomain === referrerUrlObject.mainDomain;
    }
    console.log('Это внутренний переход? ' + currentUrlObject.domain === referrerUrlObject.domain);
    return currentUrlObject.domain === referrerUrlObject.domain;
}

function hasUTMParameters() {
    const currentUrlObject = getUrlObject(document.URL);

    const hasUtmSource = isNotEmpty(currentUrlObject.utmSource);
    const hasUtmMedium = isNotEmpty(currentUrlObject.utmMedium);
    const hasUtmCampaign = isNotEmpty(currentUrlObject.utmCampaign);

    return hasUtmSource || hasUtmMedium || hasUtmCampaign;
}

console.log(getUrlObject(document.URL));
console.log(getUrlObject(document.referrer));
console.log('Это внутренний переход? - ' + isInternalTransition(MERGE_SUBDOMAINS_AND_DOMAIN));
console.log('Есть UTM метки? - ' + hasUTMParameters());