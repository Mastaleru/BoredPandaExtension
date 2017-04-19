var HttpClient = function () {
    this.get = function (aUrl, aCallback) {
        var anHttpRequest = new XMLHttpRequest();
        anHttpRequest.onreadystatechange = function () {
            if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
                aCallback(anHttpRequest.responseText);
        }

        anHttpRequest.open("GET", aUrl, true);
        anHttpRequest.send(null);
    }
}

function renderContent(text) {
    var parser = new DOMParser();
    var doc = parser.parseFromString(text, "text/html");
    paginationAnchor = doc.getElementsByClassName("pagination-combined")[0].getElementsByClassName("pagination")[0];
    var items = Array.from(doc.getElementsByClassName("open-list-item"));
    var timeout = 0;
    items.forEach(function (item) {
        setTimeout(function () {
            appenderContainer.appendChild(item);
        }, timeout);
        timeout += 10;
    });
    setTimeout(function(){
        currentPage++;
    },timeout);

}

function elementIsBelow(elm, threshold, mode) {
    threshold = threshold || 0;
    var rect = elm.getBoundingClientRect();
    var viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
    var below = rect.top - viewHeight + threshold >= 0;
    return below;

}



var client = new HttpClient();
var appenderContainer = document.getElementsByClassName("open-list-items")[0];

var checkIfPagintion = document.getElementsByClassName("pagination-combined");
if (checkIfPagintion && checkIfPagintion.length === 1) {
    var paginationCtn = checkIfPagintion[0];
    var paginationAnchor = paginationCtn.getElementsByClassName("pagination")[0];
    var paginationText = paginationAnchor.outerText;
    paginationAnchor.style.display = "none";

    const regex = /PAGE ([1-9]{0,2})\/([0-9]{0,2}) >$/g;
    var m;
    var currentPage = 1;
    var totalPages = 1;
    while ((m = regex.exec(paginationText)) !== null) {
        currentPage = parseInt(m[1]);
        totalPages = parseInt(m[2]);
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }
    }

    var htmlPages = {};

    for (var i = currentPage; i <= totalPages; i++) {
        htmlPages["page" + i] = null;
    }

    var dist = -50;

    var blockRequest = false;
    window.onscroll = function () {
        var below = elementIsBelow(paginationCtn, dist);
        if (below === false) {
            if (currentPage <= totalPages) {
                if (blockRequest === false) {
                    if (htmlPages["page" + (currentPage + 1)] === null) {
                        var link = paginationAnchor.getAttribute("href");
                        blockRequest = true;
                        client.get(link, function (response) {
                            blockRequest = false;
                            htmlPages["page" + (currentPage + 1)] = response;
                            renderContent(response);
                        });
                    }
                }
            }
        }

    };

    elementIsBelow(paginationCtn, dist);

}