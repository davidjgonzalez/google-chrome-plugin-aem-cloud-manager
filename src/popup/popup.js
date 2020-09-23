"use strict";

import "@spectrum-web-components/theme/sp-theme.js";
import "@spectrum-web-components/theme/theme-light.js";
import "@spectrum-web-components/theme/scale-medium.js";
import "@spectrum-web-components/action-menu/sp-action-menu.js";
import "@spectrum-web-components/menu/sp-menu.js";
import "@spectrum-web-components/menu/sp-menu-item.js";

import "@spectrum-css/alert/dist/index-vars.css";

import '@spectrum-web-components/icon/sp-icon.js';
import '@spectrum-web-components/icons/sp-icons-medium.js';

import '@spectrum-web-components/action-menu/sp-action-menu.js';
import '@spectrum-web-components/button/sp-button.js';
import '@spectrum-web-components/button/sp-clear-button.js';
import '@spectrum-web-components/button/sp-action-button.js';

import "./popup.css";

console.log("popup.js");

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
    }
  );
});


function getHtml(d) {

    return `    
    <!-- Tenant Id -->
    <p class="spectrum-Heading spectrum-Heading--L spectrum-Heading--light">Tenant</p>
    <sp-action-button selected>Tenant Id: ${d.tenantId}</sp-action-button>

    <!-- Program -->
    <p class="spectrum-Heading spectrum-Heading--L spectrum-Heading--light">Program</p>
    <sp-action-button selected>Type: ${d.programType}</sp-action-button>
    <sp-action-button selected>AEM Version: ${d.programVersion}</sp-action-button>
    <sp-action-button selected>Program Id: ${d.programName}</sp-action-button>
    <sp-action-button selected>Program Name: ${d.programId}</sp-action-button>
    <sp-action-button target="_blank" href="https://experience.adobe.com/#/@${d.tenantId}/cloud-manager/environments.html/program/${d.programId}">Open in Cloud Manager</sp-action-button>


    <!-- Environment -->
    <p class="spectrum-Heading spectrum-Heading--L spectrum-Heading--light">Environment</p>
    <!--<sp-action-button selected>Type: ${d.serviceType}</sp-action-button>-->
    <sp-action-button selected>Program Id: ${d.environmentName}</sp-action-button>
    <sp-action-button selected>Program Name: ${d.environmentId}</sp-action-button>
    <sp-action-button target="_blank" href="https://experience.adobe.com/#/@${d.tenantId}/cloud-manager/environments.html/program/${d.programId}/environment/${d.environmentId}">Open in Cloud Manager</sp-action-button>
    
    <!-- Tail Logs -->
    <p class="spectrum-Heading spectrum-Heading--L spectrum-Heading--light">Tail Logs <em>(copy/paste aio command)</em></p>
    <sp-action-button data-copy-to-clipboard="aio cloudmanager:tail-log --programId=${d.programId} ${d.environmentId} author aemerror">aemerror</sp-action-button>
    <sp-action-button data-copy-to-clipboard="aio cloudmanager:tail-log --programId=${d.programId} ${d.environmentId} author aemaccess">aemaccess</sp-action-button>
    <sp-action-button data-copy-to-clipboard="aio cloudmanager:tail-log --programId=${d.programId} ${d.environmentId} author aemrequest">aemrequest</sp-action-button>

    <!-- Download Logs -->
    <p class="spectrum-Heading spectrum-Heading--L spectrum-Heading--light">Download Logs <em>(copy/paste aio command)</em></p>
    <sp-action-button data-copy-to-clipboard="aio cloudmanager:download-logs --programId=${d.programId} ${d.environmentId} author aemerror 1">aemerror</sp-action-button>
    <sp-action-button data-copy-to-clipboard="aio cloudmanager:download-logs --programId=${d.programId} ${d.environmentId} author aemaccess 1">aemaccess</sp-action-button>
    <sp-action-button data-copy-to-clipboard="aio cloudmanager:download-logs --programId=${d.programId} ${d.environmentId} author aemrequest 1">aemrequest</sp-action-button>
    `;
}

function _copyToClipboard(text) {
    if (text) {
        let copyEl = document.getElementById("copy-to-clipboard-input");
        copyEl.value = text;
        copyEl.select();
        document.execCommand("copy");
    }
}
