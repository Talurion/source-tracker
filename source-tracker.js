const stMerge = true;
const stCookieLifetime = 365; // срок жизни куки в днях
const stSessionLifetime = 60; // срок жизни куки сессии в минутах

const stRandomIdMin = 1000000000;
const stRandomIdMax = 9999999999;

let stData = '';
const stLastClickCookieName = 'stLastClick';
const stLastNonDirectClickCookieName = 'stLastNonDirect';

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

function getUTime() {
    return Math.round(new Date().getTime()/1000.0);
}

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getSessionId() {
    return getUTime() + '.' + getRandomNumber(stRandomIdMin, stRandomIdMax);
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

function setCookie(name, value, minutes) {
    let expires = "";
    if (minutes) {
        const date = new Date();
        date.setTime(date.getTime() + (minutes * 60 * 1000));
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

    if (isInternalTransition(stMerge)) {
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

    const cookieData = getCookie(stLastNonDirectClickCookieName);

    if (cookieData) {
        return cookieData;
    }
    return '(direct)||(none)||(none)||(none)||(none)||(none)';
}

function setLastSignificantSourceCookie () {
    setCookie('stSessionId', getSessionId(), stSessionLifetime);
    setCookie(stLastNonDirectClickCookieName, getLastSignificantSource(), (stCookieLifetime * 24 * 60));
}

setLastSignificantSourceCookie();