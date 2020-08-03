/**
 * Find elements by xpath
 * @param {String} STR_XPATH 
 */
export function _x(STR_XPATH) {
    var xresult = document.evaluate(STR_XPATH, document, null, XPathResult.ANY_TYPE, null);
    var xnodes = [];
    var xres;
    while (xres = xresult.iterateNext()) {
        xnodes.push(xres);
    }

    return xnodes;
}

/**
 * Fetch and parse HTML file from the Chrome extension resources
 * @param {String} path Resolve as Chrome runtime URL
 */
export const getHTMLAsync = async (path) => {
    const response = await fetch(chrome.runtime.getURL(path))
        .then(function (response) {
            // When the page is loaded convert it to text
            return response.text()
        }).then(function (html) {
            // Initialize the DOM parser
            var parser = new DOMParser();

            // Parse the text
            var doc = parser.parseFromString(html, "text/html");

            // You can now even select part of that html as you would in the regular DOM 
            // Example:
            // var docArticle = doc.querySelector('article').innerHTML;

            return doc;
        })
        .catch(function (err) {
            log('Failed to fetch page: ', err);
        });
    return response.body.innerHTML;
}