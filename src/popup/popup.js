"use strict";

import { getContentPath } from '../content-resolver';

import "@spectrum-web-components/theme/sp-theme.js";
import "@spectrum-web-components/theme/theme-light.js";
import "@spectrum-web-components/theme/scale-medium.js";
import "@spectrum-web-components/action-menu/sp-action-menu.js";
import "@spectrum-web-components/menu/sp-menu.js";
import "@spectrum-web-components/menu/sp-menu-item.js";

import '@spectrum-web-components/icon/sp-icon.js';
import '@spectrum-web-components/icons/sp-icons-medium.js';

import '@spectrum-web-components/action-menu/sp-action-menu.js';
import '@spectrum-web-components/button/sp-button.js';
import '@spectrum-web-components/button/sp-clear-button.js';
import '@spectrum-web-components/button/sp-action-button.js';

import '@spectrum-web-components/sidenav/sp-sidenav.js';
import '@spectrum-web-components/sidenav/sp-sidenav-heading.js';
import '@spectrum-web-components/sidenav/sp-sidenav-item.js';

import '@spectrum-web-components/icon/sp-icon.js';
import '@spectrum-web-components/icons/sp-icons-medium.js';

import '@spectrum-web-components/tabs/sp-tabs.js';
import '@spectrum-web-components/tabs/sp-tab.js';

import '@spectrum-web-components/progress-circle/sp-progress-circle.js';

import "@spectrum-css/vars/dist/spectrum-global.css";
import "@spectrum-css/vars/dist/spectrum-medium.css";
import "@spectrum-css/vars/dist/spectrum-light.css";
import "@spectrum-css/page/dist/index-vars.css";
import "@spectrum-css/typography/dist/index-vars.css";
import "@spectrum-css/icon/dist/index-vars.css";
import "@spectrum-css/alert/dist/index-vars.css";
import "@spectrum-css/button/dist/index-vars.css";

import "./popup.css";

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  chrome.tabs.sendMessage(
    tabs[0].id,
    { text: "collect_adobe-cloud-manager_data" },
    function (response) {
        
        if (!response || response.error === "missing_digital_data") {
          document.getElementById("error-alert").style.display = 'block';
          return;
        }

        let ul = document.getElementById("injection-point");        
        ul.innerHTML = getHtml(response);

        document.querySelectorAll('[data-copy-to-clipboard]').forEach((el) => {
            el.addEventListener('click', (e) => {
                _copyToClipboard(el.getAttribute('data-copy-to-clipboard'));
            });
        });

        document.querySelectorAll('a[href="#toggle"]').forEach((el) => {
            console.log(el);
            el.addEventListener('click', (e) => {
                console.log('clicked');
                el.nextElementSibling.classList.toggle('open');
            });
        });

              
    }
  );
});

function getHtml(d) {
    let html = ``;

    if ('author' === d.serviceType) {
        return html + getAuthorHtml(d);
    } else {
        return html + getPublishHtml(d);
    }
}

function getAuthorHtml(d) {

    return `${TABS}
        <div class="tabs-content">
            
            <div section="1">
            <!-- Tenant Id -->
            <p class="spectrum-Heading spectrum-Heading--S spectrum-Heading--light">Tenant</p>
            <sp-action-button selected>Tenant Id: ${d.tenantId}</sp-action-button>

            <!-- Program -->
            <p class="spectrum-Heading spectrum-Heading--S spectrum-Heading--light">Program</p>
            <sp-action-button selected>AEM Version: ${d.programVersion}</sp-action-button>
            <sp-action-button data-copy-to-clipboard="${d.programId}">Program Id: ${d.programId}</sp-action-button>
            <sp-action-button data-copy-to-clipboard="${d.programName}">Program Name: ${d.programName}</sp-action-button>
            <sp-action-button target="_blank" href="https://experience.adobe.com/#/@${d.tenantId}/cloud-manager/environments.html/program/${d.programId}">Open in Cloud Manager</sp-action-button>

            <!-- Environment -->
            <p class="spectrum-Heading spectrum-Heading--S spectrum-Heading--light">Environment</p>
            <sp-action-button selected>Type: ${d.environmentType}</sp-action-button>
            <sp-action-button data-copy-to-clipboard="${d.environmentId}">Environment Id: ${d.environmentId}</sp-action-button>
            <sp-action-button data-copy-to-clipboard="${d.environmentName}">Environment Name: ${d.environmentName}</sp-action-button>
            <sp-action-button target="_blank" href="https://experience.adobe.com/#/@${d.tenantId}/cloud-manager/environments.html/program/${d.programId}/environment/${d.environmentId}">Open in Cloud Manager</sp-action-button>
            <sp-action-button target="_blank" href="https://publish-p${d.programId}-e${d.environmentId}.adobeaemcloud.com">Open AEM Publish</sp-action-button>
        </div>

        <div section="2">
            <em>Copies aio CLI command to clipboard</em>

            <!-- Tail Logs -->
            <p class="spectrum-Heading spectrum-Heading--S spectrum-Heading--light">Tail Logs</p>
            <sp-action-button data-copy-to-clipboard="aio cloudmanager:tail-log --programId=${d.programId} ${d.environmentId} author aemerror">aemerror</sp-action-button>
            <sp-action-button data-copy-to-clipboard="aio cloudmanager:tail-log --programId=${d.programId} ${d.environmentId} author aemaccess">aemaccess</sp-action-button>
            <sp-action-button data-copy-to-clipboard="aio cloudmanager:tail-log --programId=${d.programId} ${d.environmentId} author aemrequest">aemrequest</sp-action-button>

            <!-- Download Logs -->
            <p class="spectrum-Heading spectrum-Heading--S spectrum-Heading--light">Download Logs</p>
            <sp-action-button data-copy-to-clipboard="aio cloudmanager:download-logs --programId=${d.programId} ${d.environmentId} author aemerror 1">aemerror</sp-action-button>
            <sp-action-button data-copy-to-clipboard="aio cloudmanager:download-logs --programId=${d.programId} ${d.environmentId} author aemaccess 1">aemaccess</sp-action-button>
            <sp-action-button data-copy-to-clipboard="aio cloudmanager:download-logs --programId=${d.programId} ${d.environmentId} author aemrequest 1">aemrequest</sp-action-button>

            <!-- Environment Variables -->
            <p class="spectrum-Heading spectrum-Heading--S spectrum-Heading--light">Environment Variables</p>
            <sp-action-button data-copy-to-clipboard="aio cloudmanager:set-environment-variables --programId=${d.programId} ${d.environmentId}">List variables</sp-action-button>
            <sp-action-button data-copy-to-clipboard="aio cloudmanager:set-environment-variables --programId=${d.programId} ${d.environmentId} --variable NAME VALUE">Set single variable</sp-action-button>
            <sp-action-button data-copy-to-clipboard="aio cloudmanager:set-environment-variables --programId=${d.programId} ${d.environmentId} --variable NAME_1 VALUE_1 NAME_2 VALUE_2">Set multiple variable</sp-action-button>            <sp-action-button data-copy-to-clipboard="aio cloudmanager:set-environment-variables --programId=${d.programId} ${d.environmentId} --delete NAME">Delete variables</sp-action-button>

        </div>

        <div section="3">
            ${getCRXDELite(d)}

            ${getContentDump(d)}
        </div>
    </div>`;
}

function getPublishHtml(d) {

    return `<div class="tabs-content">
        <em>Copies aio CLI command to clipboard</em>

        <div section="1">   
            <!-- Program -->
            <p class="spectrum-Heading spectrum-Heading--S spectrum-Heading--light">Program</p>
            <sp-action-button data-copy-to-clipboard="${d.programId}">Program Id: ${d.programId}</sp-action-button>

            <!-- Environment -->
            <p class="spectrum-Heading spectrum-Heading--S spectrum-Heading--light">Environment</p>
            <sp-action-button data-copy-to-clipboard="${d.environmentId}">Environment Id: ${d.environmentId}</sp-action-button>
            <sp-action-button target="_blank" href="https://author-p${d.programId}-e${d.environmentId}.adobeaemcloud.com">Open AEM Author</sp-action-button>
        </div>

        <div section="2">
            <!-- Tail Logs -->
            <p class="spectrum-Heading spectrum-Heading--S spectrum-Heading--light">Tail Logs</p>
            <sp-action-button data-copy-to-clipboard="aio cloudmanager:tail-log --programId=${d.programId} ${d.environmentId} author aemerror">aemerror</sp-action-button>
            <sp-action-button data-copy-to-clipboard="aio cloudmanager:tail-log --programId=${d.programId} ${d.environmentId} author aemaccess">aemaccess</sp-action-button>
            <sp-action-button data-copy-to-clipboard="aio cloudmanager:tail-log --programId=${d.programId} ${d.environmentId} author aemrequest">aemrequest</sp-action-button>

            <!-- Download Logs -->
            <p class="spectrum-Heading spectrum-Heading--S spectrum-Heading--light">Download Logs</p>
            <sp-action-button data-copy-to-clipboard="aio cloudmanager:download-logs --programId=${d.programId} ${d.environmentId} author aemerror 1">aemerror</sp-action-button>
            <sp-action-button data-copy-to-clipboard="aio cloudmanager:download-logs --programId=${d.programId} ${d.environmentId} author aemaccess 1">aemaccess</sp-action-button>
            <sp-action-button data-copy-to-clipboard="aio cloudmanager:download-logs --programId=${d.programId} ${d.environmentId} author aemrequest 1">aemrequest</sp-action-button>

            <!-- Environment Variables -->
            <p class="spectrum-Heading spectrum-Heading--S spectrum-Heading--light">Environment Variables</p>
            <sp-action-button data-copy-to-clipboard="aio cloudmanager:set-environment-variables --programId=${d.programId} ${d.environmentId}">List variables</sp-action-button>
            <sp-action-button data-copy-to-clipboard="aio cloudmanager:set-environment-variables --programId=${d.programId} ${d.environmentId} --variable NAME VALUE">Set single variable</sp-action-button>
            <sp-action-button data-copy-to-clipboard="aio cloudmanager:set-environment-variables --programId=${d.programId} ${d.environmentId} --variable NAME_1 VALUE_1 NAME_2 VALUE_2">Set multiple variable</sp-action-button>
            <sp-action-button data-copy-to-clipboard="aio cloudmanager:set-environment-variables --programId=${d.programId} ${d.environmentId} --delete NAME">Delete variables</sp-action-button>
        </div>

        <div section="3">
            ${getCRXDELite(d)}

            ${getContentDump(d)}
        </div>
    </div>`;
}

function getCRXDELite(d) {
    if (d.environmentType !== 'dev' || !d.contentPath) {
        return '';
    }

    return `
        <!-- Open in CRXDE Lite -->
        <p class="spectrum-Heading spectrum-Heading--S spectrum-Heading--light">Open in CRXDE Lite</p>
        <sp-action-button target="_blank" href="https://${d.currentWindow.host}/crx/de/index.jsp#${d.contentPath}">${d.contentPath}</sp-action-button>
        `;
}

function getContentDump(d) {

    let data = d.contentDump;

    if (!data) { return 'A reasonable content path could not be derived from the UR to scrape content from.<br/><br/>Try a different page in AEM!'; }
 
    return `
    <!-- Content Dump -->
    <p class="spectrum-Heading spectrum-Heading--S spectrum-Heading--light">Browse content tree</p>

    <div>Browse <strong>${d.contentPath}</strong></div>
    ${_tree(data)}        
    `;
}

function _tree(resource) {
    let html = `<ul class="browse-content__list">`;

    for (var property in resource) {
        if (resource.hasOwnProperty(property)) {

            let propertyValue = resource[property];

            if (!propertyValue === null) {
                
            } else if (typeof propertyValue === 'object') {
                if (propertyValue['jcr:primaryType']) {
                    // Is a Resource
                    html += `
                        <li class="browse-content__item">
                            <a href="#toggle" class="browse-content__item--resource">${property}</a>
                            ${_tree(propertyValue)}
                        </li>`;

                } else {
                    // Is multi-value property
                    html += `
                    <li class="browse-content__item">
                        <span class="browse-content__item--label">${property}</span>: <span class="browse-content__item--value">[ ${Object.values(propertyValue).join(', ')} ]</span>
                    </li>`;                        
                }
            } else {
                html += `
                <li class="browse-content__item">
                    <span class="browse-content__item--label">${property}</span>: <span class="browse-content__item--value">${propertyValue}</span>
                </li>`;
            }
        }
    }
    
    html += `</ul>`;

    return html;
}

function _copyToClipboard(text) {
    if (text) {
        let copyEl = document.getElementById("copy-to-clipboard-input");
        copyEl.value = text;
        copyEl.select();
        document.execCommand("copy");
    }
}

const TABS = `
    <sp-tabs selected="1">
    <sp-tab label="General" value="1"></sp-tab>
    <sp-tab label="aio Commands" value="2"></sp-tab>
    <sp-tab label="Content" value="3"></sp-tab>
    </sp-tabs>
`;

const RESOURCE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 0 18 18" width="18">
<defs>
<style>
    .a {
    fill: #6E6E6E;
    }
</style>
</defs>
<title>S Box 18 N</title>
<rect id="Canvas" fill="#ff13dc" opacity="0" width="18" height="18" /><path class="a" d="M8.2,17.797,1.4115,14.0255A.8.8,0,0,1,1,13.326V6.597l7.2,4Z" />
<path class="a" d="M16.5885,14.0255,9.8,17.797v-7.2l7.2-4v6.729A.8.8,0,0,1,16.5885,14.0255Z" />
<path class="a" d="M12.3185,1.8585,9.381.2675a.8.8,0,0,0-.762,0L1.296,4.234a.4125.4125,0,0,0,0,.7255L4.0605,6.457Z" />
<path class="a" d="M16.704,4.234,13.985,2.7615l-8.2575,4.6L9,9.1325l7.704-4.173a.4125.4125,0,0,0,0-.7255Z" />
</svg>`;


const PROPERTY_SVG = `<svg xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 0 18 18" width="18">
<defs>
  <style>
    .a {
      fill: #6E6E6E;
    }
  </style>
</defs>
<title>S Stop 18 N</title>
<rect id="Canvas" fill="#ff13dc" opacity="0" width="18" height="18" /><rect class="a" height="14" rx="0.5" width="12" x="3" y="2" />
</svg>`;


const MULTI_VALUE_PROPERTY_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 0 18 18" width="18">
  <defs>
    <style>
      .a {
        fill: #6E6E6E;
      }
    </style>
  </defs>
  <title>S Multiple 18 N</title>
  <rect id="Canvas" fill="#ff13dc" opacity="0" width="18" height="18" /><path class="a" d="M15.5,2h-5a.5.5,0,0,0-.5.5V5h2a1,1,0,0,1,1,1V8h2.5a.5.5,0,0,0,.5-.5v-5A.5.5,0,0,0,15.5,2Z" />
  <rect class="a" height="6" rx="0.5" width="6" x="2" y="10" />
  <path class="a" d="M11.5,6h-5a.5.5,0,0,0-.5.5V9H8a1,1,0,0,1,1,1v2h2.5a.5.5,0,0,0,.5-.5v-5A.5.5,0,0,0,11.5,6Z" />
</svg>`;
