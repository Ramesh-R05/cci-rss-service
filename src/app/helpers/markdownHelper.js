import marked from 'marked';
import unmarked from 'remove-markdown';
import util from 'util';

let options = {
    breaks: true
};

let renderParagraph = content => {

    if (content) {
        return marked(content, options);
    }

    return '';
}

let renderImage = (content, attributes) => {

    if (content && content.url) {

        let url = content.url;

        if (attributes) {
            let attList = [];
            for (let i in attributes) {
                attList.push(i + '=' + attributes[i]);
            }
            url += '?' + attList.join('&');
        }

        let caption = content.caption || '';

        let html = util.format('<img src="%s" alt="%s" />', url, unmarked(caption));

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

