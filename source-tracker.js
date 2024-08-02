function getUrlObject(url) {
    if (!url) { // проверяем есть ли вообще данные о URL адресе или нет
        return;
    }

    const { hostname, protocol, hash, search } = new URL(url);
    const domain = hostname.replace(/^www\./, ''); // назначаем доменное имя и удаляем .www
    
    const domainParts = domain.split('.'); // дробим домен на части, что бы найти поддомен
    const mainDomain = domainParts.slice(-2).join('.');
    const subdomain = domainParts.length > 2 ? domainParts.slice(0, -2).join('.') : '';

    const params = new URLSearchParams(search); // выдергиваем параметры UTM и декодируем их
    const utmSource = decodeURIComponent(params.get('utm_source')) || '';
    const utmMedium = decodeURIComponent(params.get('utm_medium')) || '';
    const utmCampaign = decodeURIComponent(params.get('utm_campaign')) || '';
    const utmId = decodeURIComponent(params.get('utm_id')) || '';
    const utmTerm = decodeURIComponent(params.get('utm_term')) || '';
    const utmContent = decodeURIComponent(params.get('utm_content')) || '';

    return { // возвращаем объект со всеми собранными значениями
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

console.log(getUrlObject(document.referrer));
console.log(getUrlObject(document.URL));