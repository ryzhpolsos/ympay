const _ympConfig = {
    windowWidth: null,
    windowHeight: null,
    windowLeft: null,
    windowTop: null
};

function ympconfig(cfg){
    for(let i in cfg){
        if(_ympConfig[i] !== undefined){
            _ympConfig[i] = cfg[i];
        }
    }
}

function ympay(wallet, sum){
    return new Promise((res, rej)=>{
        let uuid = crypto.randomUUID();
        let pageUrl = encodeURIComponent(location.href + (location.search.length>0?'&':'?') + 'ympu=' + uuid);

        let width = _ympConfig.windowWidth ?? Math.floor(screen.width / 2);
        let height = _ympConfig.windowHeight ?? Math.floor(screen.height / 2);
        let left = _ympConfig.windowLeft ?? Math.floor((screen.width - width) / 2);
        let top = _ympConfig.windowTop ?? Math.floor((screen.height - height) / 2);

        let wnd = open(`https://yoomoney.ru/quickpay/confirm?receiver=${wallet}&quickpay-form=button&paymentType=AC&sum=${sum}&successURL=${pageUrl}`, '', `width=${width},height=${height},left=${left},top=${top}`);

        let throwOnClose = true;
        let iid = setInterval(()=>{
            if(wnd.closed){
                clearInterval(iid);
                rej();
            }
        }, 200);

        function listener(e){
            if(e.data == uuid){
                window.removeEventListener('message', listener);
                throwOnClose = false;
                clearInterval(iid);
                wnd.close();
                res();
            }
        }
        
        window.addEventListener('message', listener);
    });
}

window.addEventListener('load', ()=>{
    let q = {};
    location.search.slice(1).split('&').forEach(el=>{
        let sp = el.split('=');
        q[sp[0]] = sp[1];
    });

    if(q['ympu']){
        document.body.style.opacity = 0;
        window.opener.postMessage(q['ympu']);
    }
});
