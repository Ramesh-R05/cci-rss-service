import marked from 'marked';
import unmarked from 'remove-markdown';
import util from 'util';

let options = {
    breaks: true
};

function renderParagraph(content) {
    if (content) {
        return marked(content, options);
    }

    return '';
}

function renderImage(content, urlAttributes) {
    if (content && content.url) {
        let url = content.url;

        if (urlAttributes) {
            let attList = [];
            for (let i in urlAttributes) {
                if (urlAttributes.hasOwnProperty(i)) {
                    attList.push(i + '=' + urlAttributes[i]);
                }
            }
            url += '?' + attList.join('&');
        }

        let htmlTag = '<img src="%s" alt="%s"';

        content.attributes && Object.keys(content.attributes).forEach((key) => {
            htmlTag += ' ' + key + '="' + content.attributes[key] + '"';
        });

        htmlTag += ' />';

        let caption = content.caption || '';
        let html = util.format(htmlTag, url, unmarked(caption));

        if (caption) {
            html += renderParagraph(caption);
        }

        return '<div>' + html + '</div>';
    }
    return '';
}

export default {
    renderParagraph,
    renderImage
};

