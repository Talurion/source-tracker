const ST_MERGE_SUBDOMAINS_AND_DOMAIN = true;
let stData = '';
const stLastClickCookieName = 'stLastClick';
const stLastSignificantCookieName = 'stLastSignificant';

const stOrganicSources = {
    'ya.ru': 'yandex',
    'yandex.ru': 'yandex',
    'yandex': 'yandex',
    'google.com': 'google',
    'google': 'google',
    'bing.com': 'bing',
    'yahoo.com': 'yahoo',
    'rambler.ru': 'rambler',
    'duckduckgo.com': 'duckduckgo',
    'about.com': 'about.com',
    'aol.com': 'aol.com',
    'ask.com': 'ask.com'
};

function getUrlObject(url) {  
    if (!url) {
        return;
    }

    const { hostname, protocol, hash, search } = new URL(url);
    const domain = hostname.replace(/^www\./, '');

    const domainParts = domain.split('.');
    const mainDomain = domainParts.slice(-2).join('.');
    const subdomain = domainParts.length > 2 ? domainParts.slice(0, -2).join('.') : '';

    const params = new URLSearchParams(search);
    const utmSource = params.get('utm_source') ? decodeURIComponent(params.get('utm_source')) : '';
    const utmMedium = params.get('utm_medium') ? decodeURIComponent(params.get('utm_medium')) : '';
    const utmCampaign = params.get('utm_campaign') ? decodeURIComponent(params.get('utm_campaign')) : '(none)';
    const utmId = params.get('utm_id') ? decodeURIComponent(params.get('utm_id')) : '(none)';
    const utmTerm = params.get('utm_term') ? decodeURIComponent(params.get('utm_term')) : '(none)';
    const utmContent = params.get('utm_content') ? decodeURIComponent(params.get('utm_content')) : '(none)';

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
    if (!stData.referrerData) {
        return false;
    }

    if (merge) {
        return stData.currentUrlData.mainDomain === stData.referrerData.mainDomain;
    }
    return stData.currentUrlData.domain === stData.referrerData.domain;
}

function hasUTMParameters() {
    return isNotEmpty(stData.currentUrlData.utmSource) || isNotEmpty(stData.currentUrlData.utmMedium);
}

function selectOrganicSource(domain) {
    if (!domain) {
        return false;
    }
    if (stOrganicSources[domain]) {
        return stOrganicSources[domain];
    }
    const modifiedDomain = domain.replace(/\..*/, '');
    if (stOrganicSources[modifiedDomain]) {
        return stOrganicSources[modifiedDomain];
    }
    return false;
}

function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
    const value = document.cookie;
    const parts = value.split(`; ${name}=`);
    
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function getLastSignificantSource () {

    stData = {
        referrerData: getUrlObject(document.referrer),
        currentUrlData: getUrlObject(document.URL),
    }

    if (isInternalTransition(ST_MERGE_SUBDOMAINS_AND_DOMAIN)) {
        return;
    }

    if (hasUTMParameters()) {
        return stData.currentUrlData.utmSource + '||'
        + stData.currentUrlData.utmMedium + '||'
        + stData.currentUrlData.utmCampaign + '||'
        + stData.currentUrlData.utmId + '||'
        + stData.currentUrlData.utmContent + '||'
        + stData.currentUrlData.utmTerm
    }

    const organicSource = selectOrganicSource(stData.referrerData?.domain);
    if (organicSource) {
        return organicSource + '||organic||(none)||(none)||(none)||(none)';
    }

    if (stData.referrerData) {
        return stData.referrerData.domain
        + '||referral||(none)||(none)||(none)||(none)';
    }

    const cookieData = getCookie(stLastSignificantCookieName);

    if (cookieData) {
        return cookieData;
    }
    return '(direct)||(none)||(none)||(none)||(none)||(none)';
}

console.log(getLastSignificantSource());