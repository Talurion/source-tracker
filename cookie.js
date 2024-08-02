function getCookie(name) { // функция получающая значения куки
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    
    if (parts.length === 2) return parts.pop().split(';').shift();
}

console.log(getCookie('_ym_uid'));