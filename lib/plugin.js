<% if (!options.isSPA) { if (options.useWorker) { %>
import { fontsToLinks } from './utils/fontLoader'
<% } else { %>
import { loadFonts, fontsToLinks } from './utils/fontLoader'
<% } } %>

import '<%= options.fontFaceCSS %>';

const fonts = <%= options.fonts %>;

<% if (options.isSPA) { %>
fonts.forEach(font => font.classes.forEach(className => document.documentElement.classList.add(className)))
<% } else { %>

if (!process.server){
<% if (!options.useWorker) { %>
  loadFonts(<%= JSON.stringify(options.loadFontsOptions) %>);
<% } else { %>
  function ieVersion(){
    var match = /\b(MSIE |Trident.*?rv:|Edge\/)(\d+)/.exec(global.navigator.userAgent);
    if (match) return parseInt(match[2])
  }
  if (ieVersion() < 12) {
    fonts.forEach(font => font.classes.forEach(className => document.documentElement.classList.add(className)))
  }
<% } %>
}

export default function ({ app }) {
<% if (options.useWorker) { %>
  app.head.link.push(...fontsToLinks(fonts.filter(font => font.preload)));
<% } else { %>
  app.head.link.push(...fontsToLinks(fonts));
<% } %>
}

<% } %>
