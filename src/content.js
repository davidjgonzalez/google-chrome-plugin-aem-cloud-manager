require("babel-polyfill");

(function() { 
    let tries = 0,
        data;

   
    

    function script() {
        var el = document.createElement("span");

        let runModes = window.digitalData?.user?.attributes?.runModes;
        let serviceType = 'unknown';

        if (runModes) {
            serviceType = runModes.indexOf('author') >= 0 ? 'author' : 'publish';
        } else {
            serviceType = parseServiceTypeFromDomain(window.location.host);
        }

        el.setAttribute("id", "google-chrome-plugin-cloud-manager");
        el.setAttribute("style", "display: none");

        el.setAttribute("programName", window.digitalData?.user?.attributes?.programName || getMissingValue(serviceType));
        el.setAttribute("programVersion", window.digitalData?.page?.solution?.version || getMissingValue(serviceType));
        el.setAttribute("programId", window.digitalData?.user?.attributes?.programId || parseProgramIdFromDomain(window.location.host));
        el.setAttribute("environmentType", window.digitalData?.page?.attributes?.environment, getMissingValue(serviceType));
        el.setAttribute("environmentName", window.digitalData?.user?.attributes?.environmentName || getMissingValue(serviceType));
        el.setAttribute("environmentName", window.digitalData?.user?.attributes?.environmentName || getMissingValue(serviceType));    
        el.setAttribute("environmentId", window.digitalData?.user?.attributes?.environmentId || parseEnvironmentIdFromDomain(window.location.host)) ;
        el.setAttribute("tenantId", window.digitalData?.user?.attributes?.tenantId || getMissingValue(serviceType));
        el.setAttribute("serviceType", serviceType || parseServiceTypeFromDomain(window.location.host));
        
        document.body.appendChild(el);

        function getMissingValue(serviceType) {
            if ('author' === serviceType) {
                return 'Unavailable';
            } else if ('publish' === serviceType) {
                return null;
            } else {
                return 'Unavailable';
            }
        }    

        function parseServiceTypeFromDomain(host) {
            let segments = host.substring(0, host.indexOf('.')).split('-') || [];
    
            let serviceType = segments[0];
            if (serviceType === 'author' || serviceType == 'publish') {
                return serviceType;
            } else {
                return null;
            }
        }
    
        function parseProgramIdFromDomain(host) {
            let segments = host.substring(0, host.indexOf('.')).split('-') || [];
    
            let programId = segments[1];
            if (programId.indexOf('p') !== 0 && programId.length > 1) {
                return null;
            } else {
                return programId.substring(1, programId.length);
            }
        }
    
        function parseEnvironmentIdFromDomain(host) {
            let segments = host.substring(0, host.indexOf('.')).split('-') || [];
    
            let environmentId = segments[2];
            if (environmentId.indexOf('e') !== 0 && environmentId.length > 1) {
                return null;
            } else {
                return environmentId.substring(1, environmentId.length);
            }
        }
    }
    
    function inject(fn) {
        const script = document.createElement('script')
        if (script) {
            script.text = `(${fn.toString()})();`
            document.documentElement.appendChild(script);
        }
    }
    
    async function getData() {
        let el;

        inject(script);

        do {
            el = document.getElementById("google-chrome-plugin-cloud-manager");
            if (!el) {
                await sleep(100);
            }
        } while (!el && tries++ < 20);

        if (!el) {
            return { "error": "missing_digital_data"};
        }

        data = {
            currentWindow: {
                host: window.location.host,
                path: window.location.pathname
            },
            programName: el.getAttribute("programName"),
            programId: el.getAttribute("programId"),
            programVersion: el.getAttribute("programVersion"),
            environmentType: el.getAttribute("environmentType"),
            environmentName: el.getAttribute("environmentName"),
            environmentId: el.getAttribute("environmentId"),
            tenantId:  el.getAttribute("tenantId"),
            serviceType: el.getAttribute("serviceType"),
        };

        el.remove();

        return data;
    }


    chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {                
        if (msg.text === "collect_adobe-cloud-manager_data") {
            getData().then(data => sendResponse(data));
        }
    });

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}());