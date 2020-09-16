(function() { 
    let tries = 0,
        data;

    function script() {
        var el = document.createElement("span");

        if (!window.digitalData || !window.digitalData.user || !window.digitalData.user.attributes || !window.digitalData.page || !window.digitalData.page.attributes) {
            return '';
        }

        el.setAttribute("id", "google-chrome-plugin-cloud-manager");
        el.setAttribute("style", "display: none");
        el.setAttribute("programName", window.digitalData.user.attributes.programName);
        el.setAttribute("programVersion", window.digitalData.page.solution.version);
        el.setAttribute("programId", window.digitalData.user.attributes.programId);
        el.setAttribute("programType", window.digitalData.page.attributes.environment);
        el.setAttribute("environmentName", window.digitalData.user.attributes.environmentName);
        el.setAttribute("environmentId", window.digitalData.user.attributes.environmentId);
        el.setAttribute("tenantId", window.digitalData.user.attributes.tenantId);
        el.setAttribute("serviceType", window.digitalData.user.attributes.runModes.indexOf('author') >= 0 ? 'author' : 'publish');

        document.body.appendChild(el);
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
            programType: el.getAttribute("programType"),
            programVersion: el.getAttribute("programVersion"),
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