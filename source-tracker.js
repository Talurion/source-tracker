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
    if (!document.referrer) { // проверяем есть ли referrer, если нет возвращаем false
        return false;
    }

    const currentUrlObject = getUrlObject(document.URL);
    const referrerUrlObject = getUrlObject(document.referrer);

    if (merge) { // если домены и поддомены отслеживаем вместе
        return currentUrlObject.mainDomain === referrerUrlObject.mainDomain; // сравниваем домен реферера и домен текущей страницы
    } // если домены и поддомены отслеживаем отдельно
    return currentUrlObject.domain === referrerUrlObject.domain; // сравниваем hostname реферера и hostname текущей страницы
}

function hasUTMParameters() {
    const currentUrlObject = getUrlObject(document.URL);

    const hasUtmSource = isNotEmpty(currentUrlObject.utmSource); // проверяем есть ли что то в переменных UTM
    const hasUtmMedium = isNotEmpty(currentUrlObject.utmMedium);
    const hasUtmCampaign = isNotEmpty(currentUrlObject.utmCampaign);

    return hasUtmSource || hasUtmMedium || hasUtmCampaign;
}

function selectOrganicSource (mainDomain) {
    let organicSource = '';
    switch (mainDomain) {
        case 'ya.ru': organicSource = 'yandex'; break;
        case 'yandex.ru': organicSource = 'yandex'; break;
        case 'google.com': organicSource = 'google'; break;
        case 'bing.com': organicSource = 'bing'; break;
        case 'go.mail.ru': organicSource = 'mail.ru'; break;
        case 'yahoo.com': organicSource = 'yahoo'; break;
        case 'rambler.ru': organicSource = 'rambler'; break;
        case 'duckduckgo.com': organicSource = 'duckduckgo'; break;
        case 'about.com': organicSource = 'about.com'; break;
        case 'aol.com': organicSource = 'aol.com'; break;
        case 'ask.com': organicSource = 'ask.com'; break;
        case 'globososo.com': organicSource = 'globososo'; break;
        case 'tut.by': organicSource = 'tut.by'; break;
        default:  organicSource = 'notFound'; break;
    }
    return organicSource;
}

console.log(getUrlObject(document.URL));
console.log(getUrlObject(document.referrer));
console.log('Это внутренний переход? - ' + isInternalTransition(MERGE_SUBDOMAINS_AND_DOMAIN));
console.log('Есть UTM метки? - ' + hasUTMParameters());