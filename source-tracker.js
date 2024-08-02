// function getReferrer() { 
//     const referrer = { 
//         url: document.referrer, 
//         domain: '', 
//         mainDomain: '', 
//         subdomain: '' 
//     }; 

//     if (referrer.url === '') { 
//         return; 
//     } 

//     referrer.domain = new URL(referrer.url).hostname.replace(/^www\./, ''); 

//     const domainParts = referrer.domain.split('.'); 

//     if (domainParts.length > 2) { 
//         referrer.subdomain = domainParts.slice(0, domainParts.length - 2).join('.'); 
//         referrer.mainDomain = domainParts.slice(domainParts.length - 2).join('.'); 
//     } else { 
//         referrer.mainDomain = referrer.domain; 
//     } 

//     return referrer;
// } 

// getReferrer();

function getReferrer() {
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

getReferrer();