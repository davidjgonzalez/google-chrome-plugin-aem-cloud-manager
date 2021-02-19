const fetch = require('node-fetch')

function getContentPath(browserPath, browserHref) {


    if (!browserPath) { return "idk"; }

    let path = null;

    if (browserPath.indexOf('/assetdetails.html') === 0) {
        // Asset details
        path = browserPath.substring('/assetdetails.html'.length);

    } else  if (browserPath.indexOf('/assets.html') === 0) {
        // Asset folder
        path = browserPath.substring('/assets.html'.length);

    } else if (browserPath.indexOf('/dam/gui/content/assets/metadataeditor.external.html') > -1) {
        // Assets properties
        path = (new URL(browserHref)).searchParams.get("item");
        
    } else if (browserPath.indexOf('/sites.html') === 0) {
        // Sites page
        path = browserPath.substring('/sites.html'.length);

    } else if (browserPath.indexOf('/editor.html') === 0) {
        // Sites / XF / CF editor
        path = browserPath.substring('/editor.html'.length);

    } else if (browserPath.indexOf('/aem/experience-fragments.html') === 0) {
        // XFs
        path = browserPath.substring('/aem/experience-fragments.html'.length);
    }

    return path;
}

export { getContentPath }
